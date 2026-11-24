import pytest
from pydantic import ValidationError

from app.config import Settings

_ENV_KEYS = ("APP_ENV", "LANGFUSE_TRACING_ENVIRONMENT", "APPLICATIONINSIGHTS_CONNECTION_STRING", "OTEL_SERVICE_NAME", "TELEMETRY_SAMPLING_RATIO")


@pytest.fixture(autouse=True)
def clean_env(monkeypatch):
    for key in _ENV_KEYS:
        monkeypatch.delenv(key, raising=False)


def test_defaults_disable_telemetry_and_name_the_role():
    s = Settings(_env_file=None)
    assert s.applicationinsights_connection_string is None
    assert s.otel_service_name == "shiksha-api"
    assert s.app_env == "local"
    assert s.telemetry_sampling_ratio == 1.0


def test_connection_string_read_from_standard_env_var(monkeypatch):
    monkeypatch.setenv("APPLICATIONINSIGHTS_CONNECTION_STRING", "InstrumentationKey=abc")
    assert Settings(_env_file=None).applicationinsights_connection_string == "InstrumentationKey=abc"


def test_environment_falls_back_to_langfuse_tracing_environment(monkeypatch):
    """Prod already sets LANGFUSE_TRACING_ENVIRONMENT=prod, so no new app setting is needed there."""
    monkeypatch.setenv("LANGFUSE_TRACING_ENVIRONMENT", "prod")
    assert Settings(_env_file=None).app_env == "prod"


def test_app_env_wins_over_langfuse_environment(monkeypatch):
    monkeypatch.setenv("LANGFUSE_TRACING_ENVIRONMENT", "prod")
    monkeypatch.setenv("APP_ENV", "staging")
    assert Settings(_env_file=None).app_env == "staging"


def test_sampling_ratio_is_bounded(monkeypatch):
    monkeypatch.setenv("TELEMETRY_SAMPLING_RATIO", "1.5")
    with pytest.raises(ValidationError):
        Settings(_env_file=None)
