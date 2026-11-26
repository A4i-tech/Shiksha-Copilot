import sys

import pytest
from pydantic import ValidationError

from app.config import Settings
from app.utils.blob_store import BlobStore, _ObjectStoreBackend


def test_object_store_backend_builds_without_azure_sdk(monkeypatch):
    monkeypatch.setitem(sys.modules, "azure.storage.blob.aio", None)
    monkeypatch.setattr("app.utils.blob_store.settings.storage_backend", "object-store")

    assert isinstance(BlobStore()._backend, _ObjectStoreBackend)


def test_settings_treat_empty_object_store_values_as_unset(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.setenv("STORAGE_BACKEND", "object-store")
    monkeypatch.delenv("BLOB_STORE_CONNECTION_STRING", raising=False)
    for key in ("OBJECT_STORE_ENDPOINT_URL", "OBJECT_STORE_ACCESS_KEY_ID", "OBJECT_STORE_SECRET_ACCESS_KEY", "BLOB_STORE_URL"):
        monkeypatch.setenv(key, "")

    settings = Settings(_env_file=None)

    assert settings.object_store_endpoint_url is None
    assert settings.object_store_access_key_id is None
    assert settings.blob_store_url is None


@pytest.mark.parametrize(
    "env, message",
    [
        ({"OBJECT_STORE_ACCESS_KEY_ID": "key"}, "must be set together"),
        ({"OBJECT_STORE_ENDPOINT_URL": "http://localhost:9000"}, "OBJECT_STORE_ENDPOINT_URL needs"),
        ({"STORAGE_BACKEND": "azure"}, "STORAGE_BACKEND=azure needs"),
        ({"STORAGE_BACKEND": "gcs"}, "Set STORAGE_BACKEND to 'object-store' or 'azure'"),
        ({"STORAGE_BACKEND": ""}, "Set STORAGE_BACKEND to 'object-store' or 'azure'"),
        ({"BLOB_STORE_URL": "https://acct.blob.core.windows.net"}, "found Azure settings and no OBJECT_STORE_"),
    ],
)
def test_settings_reject_incomplete_storage_config(monkeypatch, env, message):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.setenv("STORAGE_BACKEND", "object-store")
    monkeypatch.delenv("BLOB_STORE_CONNECTION_STRING", raising=False)
    monkeypatch.delenv("BLOB_STORE_URL", raising=False)
    for key, value in env.items():
        monkeypatch.setenv(key, value)

    with pytest.raises(ValidationError, match=message):
        Settings(_env_file=None)


def test_settings_fail_when_storage_backend_is_unset(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.delenv("STORAGE_BACKEND", raising=False)

    with pytest.raises(ValidationError, match="STORAGE_BACKEND is unset. Set STORAGE_BACKEND to 'object-store' or 'azure'"):
        Settings(_env_file=None)


def test_settings_accept_object_store_keys_with_azure_settings_present(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.setenv("STORAGE_BACKEND", "object-store")
    monkeypatch.setenv("BLOB_STORE_URL", "https://acct.blob.core.windows.net")
    monkeypatch.setenv("OBJECT_STORE_ACCESS_KEY_ID", "key")
    monkeypatch.setenv("OBJECT_STORE_SECRET_ACCESS_KEY", "secret")

    assert Settings(_env_file=None).storage_backend == "object-store"
