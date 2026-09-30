import subprocess
import sys
from pathlib import Path

APP_SERVICE_DIR = Path(__file__).resolve().parents[2]

# Runs in a fresh interpreter so modules that earlier tests imported cannot hide a top-level Azure import.
CHILD_CODE = """
import sys
sys.modules["azure.storage.blob"] = None
try:
    import azure.storage.blob
except ImportError:
    pass
else:
    sys.exit("azure.storage.blob block did not work")

import app.utils.blob_store
import app.services.rag_adapters
from app.config import settings

settings.storage_backend = "s3"
app.utils.blob_store.BlobStore()

settings.storage_backend = "azure"
try:
    app.utils.blob_store.BlobStore()
except ImportError as e:
    assert "STORAGE_BACKEND=azure" in str(e) and "--extras azure" in str(e), str(e)
else:
    sys.exit("STORAGE_BACKEND=azure must raise ImportError when the Azure SDK is missing")
"""


def test_storage_modules_import_without_azure_blob_package():
    result = subprocess.run(
        [sys.executable, "-c", CHILD_CODE],
        cwd=APP_SERVICE_DIR,
        capture_output=True,
        text=True,
        timeout=180,
    )

    assert result.returncode == 0, result.stderr or result.stdout
