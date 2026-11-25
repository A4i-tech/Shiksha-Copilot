"""Azure Application Insights wiring for shiksha-api (OpenTelemetry).

Call ``configure_telemetry(settings)`` once, before FastAPI, Langfuse or pydantic-ai are touched:
FastAPI instrumentation patches the ``FastAPI`` class, and Langfuse attaches its span processor to the
global tracer provider if one already exists (otherwise it creates and installs its own, which would
leave App Insights with no traces).

Tracing is set up here rather than by ``configure_azure_monitor`` so prompt/response content can be
scrubbed from what goes to Azure (see ``scrub.py``) while Langfuse still gets full spans. Logs, metrics
and library instrumentation still come from the Azure distro.
"""

import logging
import os
from typing import Any

from opentelemetry import trace
from opentelemetry.sdk.resources import (
    DEPLOYMENT_ENVIRONMENT,
    SERVICE_NAME,
    SERVICE_VERSION,
    Resource,
    get_aggregated_resources,
)
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from app.observability.context import EnvironmentSpanProcessor, UserSpanProcessor
from app.observability.scrub import RedactingLogRecordProcessor, ScrubbingSpanExporter

logger = logging.getLogger(__name__)

APP_LOGGER_NAME = "app"
_MAX_LOG_MESSAGE_LENGTH = 4_000
# Hosts that the Azure distro itself calls (remote config, VM metadata probe); never worth telemetry.
_DISTRO_INTERNAL_HOSTS = "settings.sdk.monitor.azure.com,169.254.169.254"

_configured = False


class _AppLogFilter(logging.Filter):
    """Filter for the App Insights log handler only (stdout logging is untouched)."""

    def filter(self, record: logging.LogRecord) -> bool:
        # Exceptions the request span already carries must not be reported a second time via the log.
        if getattr(record, "telemetry_handled", False):
            return False
        message = record.getMessage()
        if len(message) > _MAX_LOG_MESSAGE_LENGTH:
            record.msg = f"{message[:_MAX_LOG_MESSAGE_LENGTH]}...[truncated {len(message) - _MAX_LOG_MESSAGE_LENGTH} chars]"
            record.args = None
        return True


def _build_resource(settings: Any) -> Resource:
    from opentelemetry.resource.detector.azure.app_service import AzureAppServiceResourceDetector

    base = Resource.create(
        {
            # Becomes cloud_RoleName. Do not add service.namespace: the exporter would prefix it.
            SERVICE_NAME: settings.otel_service_name,
            SERVICE_VERSION: settings.build or settings.version,
            DEPLOYMENT_ENVIRONMENT: settings.app_env,
        }
    )
    return get_aggregated_resources([AzureAppServiceResourceDetector()], initial_resource=base)


def _setup_tracing(settings: Any, resource: Resource) -> None:
    from azure.monitor.opentelemetry.exporter import ApplicationInsightsSampler, AzureMonitorTraceExporter

    # NOTE: Langfuse consults this sampler too; a ratio below 1.0 also drops LLM traces from Langfuse.
    provider = TracerProvider(sampler=ApplicationInsightsSampler(settings.telemetry_sampling_ratio), resource=resource)
    provider.add_span_processor(EnvironmentSpanProcessor(settings.app_env))
    provider.add_span_processor(UserSpanProcessor())
    exporter = AzureMonitorTraceExporter(connection_string=settings.applicationinsights_connection_string)
    provider.add_span_processor(BatchSpanProcessor(ScrubbingSpanExporter(exporter, settings.telemetry_max_attribute_length)))
    trace.set_tracer_provider(provider)

    try:  # Azure SDK calls (blob storage) become dependency spans
        from azure.core.settings import settings as azure_core_settings
        from azure.core.tracing.ext.opentelemetry_span import OpenTelemetrySpan

        azure_core_settings.tracing_implementation = OpenTelemetrySpan
    except ImportError:
        logger.warning("azure-core OpenTelemetry tracing unavailable; blob calls will not be traced", exc_info=True)


def _configure_distro_without_tracing(settings: Any, resource: Resource) -> None:
    """Logs, metrics and library instrumentation from the Azure distro; tracing is already set up.

    azure-monitor-opentelemetry 1.8 ignores a ``disable_tracing`` kwarg (only OTEL_TRACES_EXPORTER=none
    works) and would otherwise build a second, rejected, tracer provider.
    """
    from azure.monitor.opentelemetry import configure_azure_monitor

    previous = os.environ.get("OTEL_TRACES_EXPORTER")
    os.environ["OTEL_TRACES_EXPORTER"] = "none"
    try:
        configure_azure_monitor(
            connection_string=settings.applicationinsights_connection_string,
            resource=resource,
            enable_live_metrics=False,
            logger_name=APP_LOGGER_NAME,
            log_record_processors=[RedactingLogRecordProcessor()],
        )
    finally:
        if previous is None:
            os.environ.pop("OTEL_TRACES_EXPORTER", None)
        else:
            os.environ["OTEL_TRACES_EXPORTER"] = previous


def _instrument_extra_libraries() -> None:
    """Libraries the Azure distro does not instrument itself (httpx, requests, urllib3 it does)."""
    from opentelemetry.instrumentation.aiohttp_client import AioHttpClientInstrumentor
    from opentelemetry.instrumentation.pymongo import PymongoInstrumentor

    AioHttpClientInstrumentor().instrument()
    PymongoInstrumentor().instrument()


def configure_telemetry(settings: Any) -> bool:
    """Wire up App Insights. Returns True if telemetry is active.

    No-op without a connection string. Never raises: telemetry must not take the API down.
    """
    global _configured
    if _configured:
        return True
    if not settings.applicationinsights_connection_string:
        logger.info("APPLICATIONINSIGHTS_CONNECTION_STRING not set; Application Insights telemetry disabled")
        return False

    try:
        os.environ.setdefault("OTEL_PYTHON_FASTAPI_EXCLUDED_URLS", settings.telemetry_excluded_urls)
        # The distro's own calls (remote config, VM metadata probe) must not show up as dependencies.
        os.environ.setdefault("OTEL_PYTHON_REQUESTS_EXCLUDED_URLS", _DISTRO_INTERNAL_HOSTS)
        os.environ.setdefault("OTEL_PYTHON_URLLIB3_EXCLUDED_URLS", _DISTRO_INTERNAL_HOSTS)
        resource = _build_resource(settings)
        _setup_tracing(settings, resource)
        _configure_distro_without_tracing(settings, resource)
        for handler in logging.getLogger(APP_LOGGER_NAME).handlers:
            if type(handler).__name__ == "LoggingHandler":
                handler.addFilter(_AppLogFilter())
        # Without an explicit level the app logger inherits the root's WARNING, so INFO context
        # ("Processing ... for user ...") never reached App Insights.
        logging.getLogger(APP_LOGGER_NAME).setLevel(settings.log_level.upper())
        _instrument_extra_libraries()
    except Exception:
        logger.exception("Failed to configure Application Insights; continuing without it")
        return False

    _configured = True
    logger.info("Application Insights telemetry enabled (role=%s, env=%s)", settings.otel_service_name, settings.app_env)
    return True


def flush_telemetry(timeout_millis: int = 5_000) -> None:
    """Flush buffered spans on shutdown so the last requests are not lost."""
    provider = trace.get_tracer_provider()
    if isinstance(provider, TracerProvider):
        provider.force_flush(timeout_millis)
