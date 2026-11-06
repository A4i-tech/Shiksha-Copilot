import asyncio
import io
import os
import shutil
import stat
import sys
import zipfile
from contextlib import asynccontextmanager

import aiofiles
import pytest
from fastapi import UploadFile
from pptx import Presentation

from app.config import settings
from app.routers.presentation import ALLOWED_MIMES
from app.services.presentation import docparser
from app.services.presentation.docparser import OFFICE_MIME_SUFFIXES
from app.services.presentation.utils import LibreOffice, save_file_with_hash
from app.utils.storage import Storage

PDF = "application/pdf"
DOC = "application/msword"
DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
PPT = "application/vnd.ms-powerpoint"
PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
OFFICE = [DOC, DOCX, PPT, PPTX]

needs_soffice = pytest.mark.skipif(shutil.which("soffice") is None, reason="soffice not installed")


def make_pptx(text: str) -> bytes:
    prs = Presentation()
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = text
    buf = io.BytesIO()
    prs.save(buf)
    return buf.getvalue()


def make_docx() -> bytes:
    # minimal OOXML package, enough for libmagic to identify it as docx
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as z:
        z.writestr("[Content_Types].xml", '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr("_rels/.rels", '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        z.writestr("word/document.xml", '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Photosynthesis</w:t></w:r></w:p></w:body></w:document>')
    return buf.getvalue()


@asynccontextmanager
async def reader(tmp_path, data: bytes):
    path = tmp_path / "in.bin"
    path.write_bytes(data)
    async with aiofiles.open(path, "rb") as f:
        yield f


class TestAllowedMimes:
    def test_every_non_text_mime_has_a_conversion_path(self):
        # otherwise the raw file reaches OpenAI and fails with "Unsupported binary content type"
        convertible = {PDF, *OFFICE_MIME_SUFFIXES}
        assert {m for m in ALLOWED_MIMES if not m.startswith("text/")} <= convertible


def fake_soffice(tmp_path, body: str) -> LibreOffice:
    """A stand-in `soffice` script, so the real subprocess handling in LibreOffice runs."""
    script = tmp_path / "soffice"
    script.write_text("#!/bin/bash\n" + body)
    script.chmod(script.stat().st_mode | stat.S_IEXEC)
    lo = LibreOffice()
    lo.path = str(script)
    return lo


# soffice is invoked as: <script> <flags...> --convert-to FMT --outdir DIR INPUT_PATH
FIND_ARGS = 'for a; do if [ "$prev" = "--outdir" ]; then outdir="$a"; fi; prev="$a"; last="$a"; done\n'


def pid_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    return True


@pytest.mark.skipif(sys.platform == "win32", reason="uses a bash stand-in for soffice")
class TestLibreOfficeSubprocess:
    @pytest.mark.parametrize("suffix", [".doc", ".docx", ".ppt", ".pptx"])
    async def test_input_file_keeps_original_suffix(self, tmp_path, suffix):
        lo = fake_soffice(tmp_path, FIND_ARGS + 'basename "$last" > "$outdir/input.pdf"\n')
        assert (await lo.convert(io.BytesIO(b"data"), "pdf", suffix)).decode().strip() == "input" + suffix

    async def test_failure_without_stderr_reports_exit_code(self, tmp_path):
        lo = fake_soffice(tmp_path, "exit 3\n")
        with pytest.raises(RuntimeError, match="code 3"):
            await lo.convert(io.BytesIO(b"data"), "pdf", ".docx")

    async def test_success_without_output_names_input_and_output_format(self, tmp_path):
        lo = fake_soffice(tmp_path, "exit 0\n")
        with pytest.raises(RuntimeError, match=r"no pdf output for \.docx input"):
            await lo.convert(io.BytesIO(b"data"), "pdf", ".docx")

    async def test_hung_soffice_is_killed_on_timeout(self, tmp_path, monkeypatch):
        monkeypatch.setattr(settings, "pres_soffice_timeout", 1)
        pidfile = tmp_path / "pid"
        lo = fake_soffice(tmp_path, f'echo $$ > "{pidfile}"\nexec sleep 60\n')
        with pytest.raises(RuntimeError, match="timed out"):
            await lo.convert(io.BytesIO(b"data"), "pdf", ".docx")
        assert not pid_alive(int(pidfile.read_text()))

    async def test_cancelled_conversion_kills_soffice(self, tmp_path):
        pidfile = tmp_path / "pid"
        lo = fake_soffice(tmp_path, f'echo $$ > "{pidfile}"\nexec sleep 60\n')
        task = asyncio.create_task(lo.convert(io.BytesIO(b"data"), "pdf", ".docx"))
        while not (pidfile.exists() and pidfile.read_text().strip()):
            await asyncio.sleep(0.05)
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        assert not pid_alive(int(pidfile.read_text()))


class TestTransform:
    @pytest.mark.parametrize("mime", OFFICE)
    async def test_office_converted_to_pdf_then_markdown(self, tmp_path, monkeypatch, mime):
        calls = {}

        async def fake_convert(self, data, output_format, input_suffix=".pptx"):
            calls["args"] = (data.read(), output_format, input_suffix)
            return b"%PDF-converted"

        monkeypatch.setattr(LibreOffice, "convert", fake_convert)
        monkeypatch.setattr(docparser, "_to_markdown", lambda data: "# md from " + data.decode())

        async with reader(tmp_path, b"office-bytes") as f:
            result = await docparser._transform(f, mime)

        assert result == "# md from %PDF-converted"
        assert calls["args"] == (b"office-bytes", "pdf", OFFICE_MIME_SUFFIXES[mime])

    async def test_pdf_goes_straight_to_markdown(self, tmp_path, monkeypatch):
        async def boom(*a, **k):
            raise AssertionError("LibreOffice must not run for PDF")

        monkeypatch.setattr(LibreOffice, "convert", boom)
        monkeypatch.setattr(docparser, "_to_markdown", lambda data: "pdf:" + data.decode())
        async with reader(tmp_path, b"pdfbytes") as f:
            assert await docparser._transform(f, PDF) == "pdf:pdfbytes"

    @pytest.mark.parametrize("mime", ["text/plain", "text/markdown"])
    async def test_text_is_passed_through(self, tmp_path, mime):
        async with reader(tmp_path, b"hello") as f:
            assert await docparser._transform(f, mime) is None

    async def test_transform_writes_markdown_next_to_out_path(self, tmp_path, monkeypatch):
        async def fake_convert(self, data, output_format, input_suffix=".pptx"):
            return b"%PDF"

        monkeypatch.setattr(LibreOffice, "convert", fake_convert)
        monkeypatch.setattr(docparser, "_to_markdown", lambda data: "# Converted")
        storage = Storage("memory", "")
        async with reader(tmp_path, b"x") as f:
            name = await docparser.transform(storage, f, DOCX, "out/stem/stem")
        assert name == "stem.md"
        assert await storage.read_text("out/stem/stem.md") == "# Converted"

    @needs_soffice
    async def test_real_pptx_conversion(self, tmp_path):
        async with reader(tmp_path, make_pptx("Photosynthesis basics")) as f:
            md = await docparser._transform(f, PPTX)
        assert md is not None and "Photosynthesis" in md

    @needs_soffice
    async def test_real_docx_conversion(self, tmp_path):
        async with reader(tmp_path, make_docx()) as f:
            md = await docparser._transform(f, DOCX)
        assert md is not None and "Photosynthesis" in md


class TestUploadMimeDetection:
    @pytest.fixture
    def storage(self):
        return Storage("memory", "")

    @staticmethod
    def upload(data: bytes, name: str) -> UploadFile:
        return UploadFile(io.BytesIO(data), filename=name)

    async def test_pptx_accepted(self, storage):
        name, mime = await save_file_with_hash(storage, self.upload(make_pptx("t"), "deck.pptx"), "deck.pptx", ALLOWED_MIMES, 1024, 10_000_000)
        assert mime == PPTX and name.endswith(".pptx")

    async def test_docx_accepted(self, storage):
        name, mime = await save_file_with_hash(storage, self.upload(make_docx(), "book.docx"), "book.docx", ALLOWED_MIMES, 1024, 10_000_000)
        assert mime == DOCX and name.endswith(".docx")

    async def test_unsupported_binary_rejected(self, storage):
        png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32
        with pytest.raises(ValueError, match="Unexpected mime"):
            await save_file_with_hash(storage, self.upload(png, "x.png"), "x.png", ALLOWED_MIMES, 1024, 10_000_000)

    async def test_oversize_rejected(self, storage):
        with pytest.raises(ValueError, match="Bad file size"):
            await save_file_with_hash(storage, self.upload(b"a" * 100, "a.txt"), "a.txt", ALLOWED_MIMES, 10, 50)
