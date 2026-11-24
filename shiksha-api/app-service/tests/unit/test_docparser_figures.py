import asyncio
import ctypes
import io

import aiofiles
import pypdfium2 as pdfium
import pypdfium2.raw as pdfium_c
import pytest
from PIL import Image

from app.config import settings
from app.models.presentation import FigureInfo
from app.services.presentation import docparser
from app.utils.storage import Storage


def make_image_pdf(images: list[tuple[int, int, tuple[int, int, int]]], scale: float = 1) -> bytes:
    # scale: points per pixel
    doc = pdfium.PdfDocument.new()
    for w, h, color in images:
        page = doc.new_page(612, 792)
        img = pdfium.PdfImage.new(doc)
        img.set_bitmap(pdfium.PdfBitmap.from_pil(Image.new("RGB", (w, h), color)))
        img.set_matrix(pdfium.PdfMatrix().scale(w * scale, h * scale).translate(40, 40))
        page.insert_obj(img)
        page.gen_content()
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


def test_page_figures_keeps_a_figure_and_skips_a_full_page_image():
    pdf = pdfium.PdfDocument(make_image_pdf([(300, 200, (255, 0, 0)), (560, 700, (0, 255, 0))]))
    assert len(docparser._page_figures(pdf[0])) == 1
    assert docparser._page_figures(pdf[1]) == []


def make_text_pdf(pages: list[str]) -> bytes:
    doc = pdfium.PdfDocument.new()
    for text in pages:
        page = doc.new_page(612, 792)
        obj = pdfium_c.FPDFPageObj_CreateTextObj(doc.raw, pdfium_c.FPDFText_LoadStandardFont(doc.raw, b"Helvetica"), 12)
        utf16 = (ctypes.c_ushort * (len(text) + 1))(*map(ord, text), 0)
        pdfium_c.FPDFText_SetText(obj, ctypes.cast(utf16, ctypes.POINTER(ctypes.c_ushort)))
        pdfium_c.FPDFPageObj_Transform(obj, 1, 0, 0, 1, 72, 700)
        pdfium_c.FPDFPage_InsertObject(page.raw, obj)
        page.gen_content()
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


def test_markdown_is_the_page_text_joined_by_blank_lines():
    assert docparser._to_markdown(make_text_pdf(["First page", "Second page"])) == "First page\n\nSecond page"


def make_vector_pdf(rects: list[tuple[float, float, float, float]]) -> bytes:
    # bottom-left origin
    doc = pdfium.PdfDocument.new()
    page = doc.new_page(612, 792)
    for x, y, w, h in rects:
        rect = pdfium_c.FPDFPageObj_CreateNewRect(x, y, w, h)
        pdfium_c.FPDFPageObj_SetFillColor(rect, 200, 0, 0, 255)
        pdfium_c.FPDFPath_SetDrawMode(rect, 1, 0)
        pdfium_c.FPDFPage_InsertObject(page.raw, rect)
    page.gen_content()
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


@pytest.mark.parametrize("rects", [
    [(100, 300, 300, 200), (120, 320, 200, 130), (50, 50, 50, 50)],
    [(120, 320, 200, 130), (100, 300, 300, 200), (50, 50, 50, 50)],
])
def test_page_figures_keeps_only_the_outer_of_nested_vector_boxes(rects):
    [png] = docparser._page_figures(pdfium.PdfDocument(make_vector_pdf(rects))[0])
    assert Image.open(io.BytesIO(png)).size == (600, 400)


@pytest.mark.parametrize("rect", [(10, 10, 560, 700), (10, 10, 510, 670)])
def test_page_figures_skips_a_vector_box_that_is_most_of_the_page(rect):
    assert docparser._page_figures(pdfium.PdfDocument(make_vector_pdf([rect]))[0]) == []


@pytest.mark.parametrize("size", [(100, 100), (300, 100), (200, 700)])
def test_page_figures_skips_an_image_that_is_too_small_or_too_tall(size):
    pdf = pdfium.PdfDocument(make_image_pdf([(*size, (255, 0, 0))]))
    assert docparser._page_figures(pdf[0]) == []


def test_page_figures_caps_the_longest_side():
    pdf = pdfium.PdfDocument(make_image_pdf([(2000, 1500, (0, 0, 255))], scale=0.2))
    [png] = docparser._page_figures(pdf[0])
    assert max(Image.open(io.BytesIO(png)).size) == docparser.MAX_FIGURE_SIDE


@pytest.fixture
def fake_caption(monkeypatch):
    state = {"now": 0, "max": 0, "calls": 0}

    async def caption(png, name, page_text):
        state["calls"] += 1
        state["now"] += 1
        state["max"] = max(state["max"], state["now"])
        await asyncio.sleep(0.2)
        state["now"] -= 1
        return FigureInfo(path=name, caption="c", context="x")

    monkeypatch.setattr(docparser, "_caption", caption)
    return state


async def read(tmp_path, data, concurrency=5):
    path = tmp_path / "in.pdf"
    path.write_bytes(data)
    async with aiofiles.open(path, "rb") as f:
        return await docparser._actually_read_figures(Storage("memory", ""), f, "out/" + tmp_path.name, concurrency)


async def test_figure_limit_stops_the_job_early(tmp_path, monkeypatch, fake_caption):
    monkeypatch.setattr(settings, "pres_max_figures", 2)
    pages = []
    real = docparser._page_figures
    monkeypatch.setattr(docparser, "_page_figures", lambda page: pages.append(page) or real(page))
    figures = await read(tmp_path, make_image_pdf([(300, 200, (i * 40, 0, 0)) for i in range(5)]))
    assert len(figures) == 2
    assert fake_caption["calls"] == 2
    assert len(pages) == 2


async def test_captions_never_exceed_the_concurrency(tmp_path, fake_caption):
    figures = await read(tmp_path, make_image_pdf([(300, 200, (i * 40, 0, 0)) for i in range(6)]), concurrency=2)
    assert len(figures) == 6
    assert fake_caption["max"] == 2


async def test_figure_limit_applies_inside_a_page(tmp_path, monkeypatch, fake_caption):
    monkeypatch.setattr(settings, "pres_max_figures", 2)
    assert len(await read(tmp_path, make_vector_pdf([(40, 40, 200, 150), (300, 40, 200, 150), (40, 400, 200, 150)]))) == 2


async def test_an_invalid_pdf_gives_no_figures(tmp_path, fake_caption):
    assert await read(tmp_path, b"not a pdf") == []


async def test_a_caption_error_reaches_the_caller_unwrapped(tmp_path, monkeypatch):
    async def boom(png, name, page_text):
        raise RuntimeError("caption failed")

    monkeypatch.setattr(docparser, "_caption", boom)
    with pytest.raises(RuntimeError, match="caption failed"):
        await read(tmp_path, make_image_pdf([(300, 200, (9, 0, 0))]))


async def test_an_existing_figure_is_not_captioned_again(tmp_path, fake_caption):
    pdf = make_image_pdf([(300, 200, (7, 7, 7))])
    assert len(await read(tmp_path, pdf)) == 1
    assert await read(tmp_path, pdf) == []
