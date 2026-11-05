from pydantic_ai import RunContext
from pydantic_ai.usage import RunUsage

from app.models.presentation import PresentationOutline, SectionSpec, SlideSpec
from app.services.presentation.agent import DesignerDeps, _ImageResolverMixin, designer, next_slide_spec
from app.services.presentation.template import Templates
from app.utils.storage import Storage


def outline():
    slides = [SlideSpec(
        slide_type="body",
        title=title,
        content_goals=["Explain the concept", "Give an example"],
        engagement_strategy="Ask students a focused question.",
        context="Detailed classroom context for this presentation slide. " * 2,
    ) for title in ("First", "Second")]
    return PresentationOutline(
        title="Lesson",
        learning_objectives=["One", "Two", "Three", "Four"],
        sections=[SectionSpec(section_title=title, slides=[slide]) for title, slide in zip(("A", "B"), slides)],
    )


def test_advances_through_outline_with_stable_slide_ids():
    plan = outline()
    prs = Templates.new_presentation()
    deps = DesignerDeps(Storage("memory", ""), prs, Templates(prs), "", plan, None, {"slides_completed": ["welcome"]})
    context = RunContext(deps=deps, model=designer.model, usage=RunUsage())

    first = next_slide_spec(context)
    deps.metadata["slides_completed"].append("first")
    second = next_slide_spec(context)
    deps.metadata["slides_completed"].append("second")

    assert [first.slide_number, second.slide_number] == [1, 2]
    assert [plan.compute_slide_id(first.slide), plan.compute_slide_id(second.slide)] == [0, 64]
    assert next_slide_spec(context) is None


def test_image_url_mapping_is_and_reversible():
    resolver = _ImageResolverMixin()
    url = "https://example.com/diagram.gif"
    mapped = resolver.map_url(url)
    assert mapped.endswith(".gif")
    assert resolver.map_url(url) == mapped
    assert resolver.resolve_url(mapped) == url


def test_rate_limit_error_backs_off_longer():
    from types import SimpleNamespace
    from app.services.presentation.service import PresentationService
    job = SimpleNamespace(metadata={})
    svc = object.__new__(PresentationService)
    other = svc._error_metadata(job, "x", "boom")
    limited = svc._error_metadata(job, "x", "APIError: exceeded rate limit")
    assert other["metadata.error.next_attempt"] < limited["metadata.error.next_attempt"] - 20


def test_rate_limit_backoff_is_exponential_with_jitter():
    import time
    from types import SimpleNamespace
    from app.services.presentation.service import PresentationService
    svc = object.__new__(PresentationService)
    for attempt, low in [(1, 30), (2, 60), (3, 120), (5, 480), (6, 480)]:
        job = SimpleNamespace(metadata={"error": {"attempt": attempt - 1}})
        now = time.time()
        delay = svc._error_metadata(job, "x", "exceeded rate limit")["metadata.error.next_attempt"] - now
        assert low <= delay < low + 31
