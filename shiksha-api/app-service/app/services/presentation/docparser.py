import asyncio
import io
import json, logging, pathlib
from typing import Any
import zlib
from concurrent.futures import ThreadPoolExecutor

from PIL import Image
from app.config import settings
from app.models.presentation import FigureInfo
from app.services.presentation.utils import ConversionFailed, LibreOffice
from app.utils.storage import Storage
from pptx import Presentation, presentation
from pptx.enum.shapes import PP_PLACEHOLDER

from pydantic_ai import AgentRunError, BinaryContent
import pypdfium2 as pdfium
import pypdfium2.raw as pdfium_c
from aiofiles.threadpool.binary import AsyncBufferedReader


MAX_FIGURE_SIDE = 1600
_pdfium = ThreadPoolExecutor(max_workers=1)  # pdfium is not thread-safe


async def _in_pdfium(fn, *args):
    return await asyncio.get_running_loop().run_in_executor(_pdfium, fn, *args)


async def _caption(png: bytes, figure_path: str, page_text: str) -> FigureInfo | None:
    from app.services.presentation.agent import captioner
    try:
        resp = await captioner.run(["Page text:\n" + page_text, BinaryContent(png, media_type="image/png")])
    except AgentRunError:
        return None
    if resp.output.caption is None or resp.output.context is None:
        return None
    return FigureInfo(path=figure_path, caption=resp.output.caption, context=resp.output.context)


Rect = tuple[float, float, float, float]  # left, bottom, right, top in page points


def _contains(a: Rect, b: Rect) -> bool:
    return a[0] <= b[0] and a[1] <= b[1] and a[2] >= b[2] and a[3] >= b[3]


def _png(image: Image.Image) -> bytes:
    image.thumbnail((MAX_FIGURE_SIDE, MAX_FIGURE_SIDE))
    buf = io.BytesIO()
    image.convert("RGB").save(buf, format="PNG")
    return buf.getvalue()


def _page_figures(page: pdfium.PdfPage) -> list[bytes]:
    pw, ph = page.get_size()
    figures = []
    for img in page.get_objects([pdfium_c.FPDF_PAGEOBJ_IMAGE]):
        x0, y0, x1, y1 = img.get_bounds()
        w, h = img.get_px_size()
        if x1 - x0 > pw * 0.85 or y1 - y0 > ph * 0.85 or w < 180 or h < 120:
            continue
        figures.append(_png(img.get_bitmap().to_pil()))

    buf: list[Rect] = []
    for path in page.get_objects([pdfium_c.FPDF_PAGEOBJ_PATH]):
        rect = path.get_bounds()
        w, h = rect[2] - rect[0], rect[3] - rect[1]
        if w < 180 or h < 120 or w > pw * 0.85 or h > ph * 0.85 or w * h > pw * ph * 0.7:
            continue
        if any(_contains(r, rect) for r in buf):
            continue
        buf = [r for r in buf if not _contains(rect, r)]
        buf.append(rect)

    for x0, y0, x1, y1 in buf:
        scale = min(2, MAX_FIGURE_SIDE / max(x1 - x0, y1 - y0))
        figures.append(_png(page.render(scale=scale, crop=(x0, y0, pw - x1, ph - y1)).to_pil()))
    return figures


def _page_text(page: pdfium.PdfPage) -> str:
    return page.get_textpage().get_text_range()


def _page_data(doc: pdfium.PdfDocument, index: int) -> tuple[list[bytes], str]:
    page = doc[index]
    figures = _page_figures(page)
    return figures, _page_text(page) if figures else ""


async def _actually_read_figures(storage: Storage, textbook: AsyncBufferedReader, out_dir: str, caption_concurrency: int) -> list[FigureInfo]:
    logger = logging.getLogger(__name__)
    sem = asyncio.Semaphore(caption_concurrency)
    tasks: list[asyncio.Task[FigureInfo | None]] = []

    async def proc(page_text: str, figure_name: str, png: bytes):
        try:
            storage_path = storage.path(out_dir, figure_name)
            if await storage.exists(storage_path):
                return None
            await storage.write_bytes(storage_path, png)
            return await _caption(png, figure_name, page_text)
        finally:
            sem.release()

    await textbook.seek(0)
    try:
        doc = await _in_pdfium(pdfium.PdfDocument, await textbook.read())
    except pdfium.PdfiumError:
        return []

    # No `with doc`: a cancelled executor call keeps using the page, so the document must close by refcount.
    try:
        async with asyncio.TaskGroup() as tg:
            for index in range(await _in_pdfium(len, doc)):
                if len(tasks) >= settings.pres_max_figures:
                    logger.warning("Figure limit %d reached, skipping the rest of the document", settings.pres_max_figures)
                    break
                figures, page_text = await _in_pdfium(_page_data, doc, index)
                for png in figures[: settings.pres_max_figures - len(tasks)]:
                    await sem.acquire()
                    tasks.append(tg.create_task(proc(page_text, '%d.png' % zlib.crc32(png), png)))
    except ExceptionGroup as eg:
        for extra in eg.exceptions[1:]:
            logger.warning("Figure task failed", exc_info=extra)
        raise eg.exceptions[0] from None

    figures = [f for f in (t.result() for t in tasks) if f is not None]
    logger.info("Captioned %d figures", len(figures))
    return figures


async def read_figures(storage: Storage, textbook: AsyncBufferedReader, out_dir: str, caption_concurrency: int = 5) -> list[FigureInfo]:
    storage_mf_path = storage.path(out_dir, "manifest.json")
    if await storage.exists(storage_mf_path):
        return list(map(FigureInfo.model_validate, json.loads(await storage.read_text(storage_mf_path))))

    figures = await _actually_read_figures(storage, textbook, out_dir, caption_concurrency)
    await storage.write_text(storage_mf_path, json.dumps(list(map(lambda v: v.model_dump(), figures))))
    return figures


def _to_markdown(data: bytes) -> str:
    with pdfium.PdfDocument(data) as doc:
        return "\n\n".join(_page_text(page) for page in doc)


# Office formats OpenAI cannot ingest directly.
OFFICE_MIME_SUFFIXES = {
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
}


async def _transform(content: AsyncBufferedReader, mime: str) -> str | None:
    if mime == "application/pdf":
        await content.seek(0)
        return await _in_pdfium(_to_markdown, await content.read())
    if mime in OFFICE_MIME_SUFFIXES:
        await content.seek(0)
        try:
            pdf = await LibreOffice().convert(io.BytesIO(await content.read()), "pdf", OFFICE_MIME_SUFFIXES[mime])
        except ConversionFailed as e:
            raise RuntimeError("The document could not be converted. Check that it opens in Word or PowerPoint, then upload it again.") from e
        return await _in_pdfium(_to_markdown, pdf)
    return None


async def transform(storage: Storage, content: AsyncBufferedReader, mime: str, out_path: str) -> str | None:
    storage_path = out_path + ".md"
    if not await storage.exists(storage_path):
        markdown = await _transform(content, mime)
        if markdown is None:
            return None
        await storage.write_text(storage_path, markdown)
    return pathlib.Path(storage_path).name


def list_slide_content(prs: presentation.Presentation) -> list[dict[str, Any]]:
    slides = []
    for s in prs.slides:
        title = ""
        text = []
        for shp in s.shapes:
            if shp.is_placeholder and shp.placeholder_format.type == PP_PLACEHOLDER.TITLE:
                title = shp.text.strip()
            if hasattr(shp, "text") and shp.text:
                text.append(shp.text)
        slides.append({"title": title, "text": " ".join(text)})
    return slides


async def save_pptx(storage: Storage, prs: presentation.Presentation, path: str):
    data = io.BytesIO()
    await asyncio.to_thread(prs.save, data)
    await storage.write_bytes(path, data.getvalue())


async def load_pptx(data: bytes) -> presentation.Presentation:
    return await asyncio.to_thread(Presentation, io.BytesIO(data))
