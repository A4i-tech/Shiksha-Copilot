from types import SimpleNamespace

import pytest
from pydantic_ai import ModelRetry, RunContext
from pydantic_ai.models.test import TestModel
from pydantic_ai.usage import RunUsage

from app.services.presentation.agent import SlideTrackerToolset, designer_toolset


class _EchoToolset:
    max_retries = 3

    async def call_tool(self, name, tool_args, ctx, tool):
        return "Slide created successfully."


def _ctx(retries, slide_type="body"):
    metadata = {"slides_completed": [], "slide_ids_created": {}, "slide_types_used": []}
    deps = SimpleNamespace(
        metadata=metadata,
        outline=SimpleNamespace(total_slides=10, compute_slide_id=lambda spec: 1),
        slide=SimpleNamespace(slide_type=slide_type),
        prs=SimpleNamespace(slides=[]),
    )
    return RunContext(deps=deps, model=TestModel(), usage=RunUsage(), retries=dict(retries))


def _tool(name):
    return SimpleNamespace(toolset=designer_toolset, tool_def=SimpleNamespace(name=name))


async def test_successful_slide_resets_retry_budget():
    ctx = _ctx({"browse_images": 5, "ppt_add_quote_slide": 2})
    await SlideTrackerToolset(_EchoToolset()).call_tool("ppt_add_body_slide", {}, ctx, _tool("ppt_add_body_slide"))
    assert ctx.retries == {}


async def test_wrong_tool_keeps_retry_budget():
    ctx = _ctx({"browse_images": 5})
    with pytest.raises(ModelRetry):
        await SlideTrackerToolset(_EchoToolset()).call_tool("ppt_add_quote_slide", {}, ctx, _tool("ppt_add_quote_slide"))
    assert ctx.retries == {"browse_images": 5}


def test_browse_images_has_its_own_larger_budget():
    assert designer_toolset.tools["browse_images"].max_retries == 6
    assert designer_toolset.tools["ppt_add_body_slide"].max_retries == 3
