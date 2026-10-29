import sys

import pytest
from pydantic import ValidationError

from app.config import Settings
from app.utils.blob_store import BlobStore, _S3Backend


def test_s3_backend_builds_without_azure_sdk(monkeypatch):
    monkeypatch.setitem(sys.modules, "azure.storage.blob.aio", None)
    monkeypatch.setattr("app.utils.blob_store.settings.storage_backend", "s3")

    assert isinstance(BlobStore()._backend, _S3Backend)


def test_settings_treat_empty_s3_values_as_unset(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    for key in ("S3_ENDPOINT_URL", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"):
        monkeypatch.setenv(key, "")

    settings = Settings(_env_file=None)

    assert settings.s3_endpoint_url is None
    assert settings.s3_access_key_id is None


@pytest.mark.parametrize(
    "env, message",
    [
        ({"S3_ACCESS_KEY_ID": "key"}, "must be set together"),
        ({"S3_ENDPOINT_URL": "http://localhost:9000"}, "S3_ENDPOINT_URL needs"),
        ({"STORAGE_BACKEND": "azure"}, "STORAGE_BACKEND=azure needs"),
        ({"STORAGE_BACKEND": "gcs"}, "storage_backend"),
    ],
)
def test_settings_reject_incomplete_storage_config(monkeypatch, env, message):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    for key, value in env.items():
        monkeypatch.setenv(key, value)

    with pytest.raises(ValidationError, match=message):
        Settings(_env_file=None)
