"""The one call path. Every model call in this codebase is constructed here.

A second path silently opts out of every guardrail, budget and trace this one enforces,
so tests/test_primitives.py fails the build if one appears.
"""
from pydantic_ai import Agent, DeferredToolRequests, ModelRetry, RunContext, UsageLimits
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider
from pydantic_ai.settings import ModelSettings

from . import config, hooks, tools
from .deps import Deps

BUDGETS = {
    # the loop's step budget: high for the open-ended path, tight for the bounded subagent
    "journey": UsageLimits(
        request_limit=config.JOURNEY_REQUEST_LIMIT,
        tool_calls_limit=config.JOURNEY_TOOL_CALLS_LIMIT,
    ),
    "verifier": UsageLimits(request_limit=2, tool_calls_limit=0),
}


def provider_name() -> str:
    if config.FAKE_MODEL:
        return "fake"
    return "azure" if config.AZURE_OPENAI_ENDPOINT else "openai-compatible"


def _provider():
    """Any OpenAI-compatible endpoint, plus Azure OpenAI, which needs its own api-version."""
    if config.AZURE_OPENAI_ENDPOINT:
        from pydantic_ai.providers.azure import AzureProvider

        return AzureProvider(
            azure_endpoint=config.AZURE_OPENAI_ENDPOINT,
            api_version=config.AZURE_OPENAI_API_VERSION,
            api_key=config.OPENAI_API_KEY,
        )
    return OpenAIProvider(base_url=config.OPENAI_BASE_URL, api_key=config.OPENAI_API_KEY)


def _model(name: str):
    if config.FAKE_MODEL:
        from pydantic_ai.models.test import TestModel

        return TestModel(call_tools=config.FAKE_MODEL_TOOLS)
    return OpenAIChatModel(name, provider=_provider())


def setup_tracing() -> None:
    """Instrument once, at the framework level. Per-service instrumentation drifts into styles."""
    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.resources import Resource
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    provider = TracerProvider(resource=Resource.create({"service.name": "agentic-journey"}))
    provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
    trace.set_tracer_provider(provider)
    Agent.instrument_all()


def _toolsets(profile: str) -> list:
    """Platform tools plus, for the journey agent, whatever an MCP server exposes.

    MCP tools run in the trusted plane: they are a tool channel, not the execution plane.
    """
    sets = [hooks.TimedToolset(tools.toolset_for(profile).prepared(hooks.prepare_tools))]
    if config.MCP_URL and profile == "journey":
        from pydantic_ai.mcp import MCPToolset

        sets.append(hooks.TimedToolset(MCPToolset(config.MCP_URL)))
    return sets


def make_agent(profile: str, model_name: str | None = None, output_type=None) -> Agent:
    return Agent(
        _model(model_name or config.MODEL_NAME),
        deps_type=Deps,
        toolsets=_toolsets(profile),
        instructions=hooks.instructions_for(profile),
        output_type=output_type or [str, DeferredToolRequests],
        retries=2,
        model_settings=ModelSettings(timeout=config.MODEL_TIMEOUT_SECONDS),
    )
