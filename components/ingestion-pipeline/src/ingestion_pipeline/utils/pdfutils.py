from contextlib import contextmanager
import os
import tempfile
from typing import Generator, List
from pdf2image import convert_from_path
from PIL import Image

@contextmanager
def convert_pdf_to_images(pdf_file, **kwargs) -> Generator[List[Image.Image], None, None]:
    """Convert pdf2image pages and store them in disk (temp) instead of piling up in RAM."""
    with tempfile.TemporaryDirectory() as tempdir:
        yield convert_from_path(pdf_file, output_folder=tempdir, thread_count=min(4, os.cpu_count() or 4), **kwargs)
