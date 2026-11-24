import logging
import os
from types import SimpleNamespace
from unittest.mock import patch

import pytest

from app.observability import setup


def _settings(**overrides):
    base = dict(
        applicationinsights_connection_string="InstrumentationKey=00000000-0000-0000-0000-000000000000",
        otel_service_name="shiksha-api",
        app_env="test",
        build="sha-abc",
        version="1.0.1",
        telemetry_sampling_ratio=1.0,
        telemetry_max_attribute_length=256,
        telemetry_excluded_urls="/health$",
    )
    base.update(overrides)
    return SimpleNamespace(**base)


@pytest.fixture(autouse=True)
def reset_configured(monkeypatch):
    monkeypatch.setattr(setup, "_configured", False)


def test_disabled_without_connection_string():
    with patch("azure.monitor.opentelemetry.configure_azure_monitor") as configure:
        assert setup.configure_telemetry(_settings(applicationinsights_connection_string=None)) is False
    configure.assert_not_called()


def test_configures_once_with_service_identity():
    seen_env = {}

    def record_env(**kwargs):
        seen_env["traces_exporter"] = os.environ.get("OTEL_TRACES_EXPORTER")

    with patch("azure.monitor.opentelemetry.configure_azure_monitor", side_effect=record_env) as configure, \
         patch.object(setup, "_setup_tracing") as tracing, \
         patch.object(setup, "_instrument_extra_libraries") as extra:
        assert setup.configure_telemetry(_settings()) is True
        assert setup.configure_telemetry(_settings()) is True  # idempotent: uvicorn re-imports app.main

    configure.assert_called_once()
    tracing.assert_called_once()
    extra.assert_called_once()
    kwargs = configure.call_args.kwargs
    # tracing is built by us (scrubbing exporter); the distro must not build a second provider
    assert seen_env["traces_exporter"] == "none"
    assert os.environ.get("OTEL_TRACES_EXPORTER") != "none"  # restored afterwards
    assert kwargs["enable_live_metrics"] is False
    assert kwargs["logger_name"] == "app"
    attrs = kwargs["resource"].attributes
    assert attrs["service.name"] == "shiksha-api"
    assert attrs["service.version"] == "sha-abc"
    assert attrs["deployment.environment"] == "test"
    assert "service.namespace" not in attrs  # would be prefixed onto cloud_RoleName


def test_failure_never_raises():
    with patch("azure.monitor.opentelemetry.configure_azure_monitor", side_effect=RuntimeError("bad connection string")), \
         patch.object(setup, "_setup_tracing"):
        assert setup.configure_telemetry(_settings()) is False


class TestAppLogFilter:
    def _record(self, msg, **extra):
        record = logging.LogRecord("app.x", logging.ERROR, __file__, 1, msg, None, None)
        record.__dict__.update(extra)
        return record

    def test_drops_records_flagged_as_handled_by_span(self):
        assert setup._AppLogFilter().filter(self._record("boom", telemetry_handled=True)) is False

    def test_keeps_normal_records(self):
        assert setup._AppLogFilter().filter(self._record("boom")) is True

    def test_truncates_huge_messages(self):
        record = self._record("z" * 10_000)
        assert setup._AppLogFilter().filter(record) is True
        assert len(record.getMessage()) < 4_100 and "truncated" in record.getMessage()
