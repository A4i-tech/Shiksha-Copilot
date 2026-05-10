from datetime import datetime, timezone
from typing import Annotated, Any, Literal
import uuid

from app.services.presentation import template
from pydantic import BaseModel, ConfigDict, Field, PositiveInt, StringConstraints


UserId = Annotated[str, StringConstraints(pattern=r"^[0-9a-f]{24}$")]


class CaptionerResponse(BaseModel):
    caption: str | None = Field(description=(
        "A concise, accessible description of the image for users who cannot see it. "
        "Focus on the main subject, visible actions, setting, and any important visual details. "
        "Use null if the image cannot be meaningfully described."
    ), examples=["A gray cat sitting on a wooden table."])
    context: str | None = Field(description=(
        "Relevant contextual information that explains how the image relates to the surrounding content, "
        "document, page, or user request. This should add meaning beyond the visual caption. "
        "Use null if no useful context is available or the image is not captionable."
    ), examples=["The image appears in a document section discussing common domestic cat breeds."])


_SLIDE_TYPES: list[str] = list(template.SLIDE_META.keys())
_SLIDE_TYPES.remove("welcome")
_SLIDE_TYPES.remove("thank_you")
SlideTypeLiteral = Literal[tuple(_SLIDE_TYPES)]
JobStatus = Literal[
    "init",
    "extracting_figures",
    "planning_structure",
    "creating_slides",
    "adding_media",
    "quality_check",
    "complete",
    "idle",
    "error"
]

class SlideSpec(BaseModel):
    """Specification for a single slide"""
    model_config = ConfigDict(extra="forbid")

    # ideally we need not annotate `slide_type` desc with _SLIDE_TYPES, but responses api generates bad
    # data for this field otherwise. probably something to do with us dynamically creating a Literal[] type.
    slide_type: SlideTypeLiteral = Field(description="One of: " + ", ".join(_SLIDE_TYPES)) # type: ignore
    title: str = Field(min_length=1)
    content_goals: list[str] = Field(description="What content should be covered", min_length=2)
    engagement_strategy: str = Field(default="Standard engagement", description="A summary of the strategy to use to engage viewers", min_length=16)
    context: str = Field(description="\n".join([
        "Comprehensive, very elaborate, self-contained content needed to create the slide without looking up textbook content anymore.",
        "This can also include instructions or anything worthy for the slide maker agent.",
        "Must be elaborate (more than 64 chars)."
    ]), min_length=64)


class SectionSpec(BaseModel):
    """Specification for a presentation section"""
    section_title: str = Field(description="Title of the section", min_length=1)
    slides: list[SlideSpec] = Field(description="Ordered list of slide specs", min_length=1)


class NextSlideSpec(BaseModel):
    section_title: str = Field(description="Title of the section this slide belongs to")
    slide: SlideSpec = Field(description="Specification of this slide")
    slide_number: PositiveInt


class FigureInfo(BaseModel):
    path: str = Field(description="Local path to the figure", examples=["xxxx.png"])
    caption: str = Field(description="Description of the image", examples=["This is a cat"])
    context: str = Field(description="Context pertaining to this image", examples=["The document is on different species of cats and this is a generic image of a cat."])


class ImageSearchResult(BaseModel):
    url: str = Field(description="URL of the image. Can be passed to image slides.")
    description: str = Field(description="A description of what the image is about.")
    source: str = Field(description="Where the image was found", examples=["Wikimedia Commons"])
    license: str = Field(description="Image license", examples=["CC BY 2.0"])
    attribution: str = Field(description="Who published the image")


class ImageSearchResults(BaseModel):
    results: list[ImageSearchResult] = Field(description="List of images found")
    message: str | None = Field(description="Information about this search operation")


class JobDetail(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    creation_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: UserId
    textbook_file: str
    slides: int | None
    instruction: str | None
    use_pre_generated_outline: bool = True
    status: JobStatus = "init"
    message: str = "Pending"
    metadata: dict[str, Any] = Field(default_factory=dict)


class PresentationOutline(BaseModel):
    """Complete presentation outline with all specifications"""
    title: str = Field(description="Presentation title", min_length=1)
    learning_objectives: list[str] = Field(description="List of learning objectives for the presentation", min_length=4)
    sections: list[SectionSpec] = Field(description="Ordered list of section specifications", min_length=1)

    @property
    def total_slides(self) -> int: return sum(len(section.slides) for section in self.sections)

    def compute_slide_id(self, slide: SlideSpec) -> int:
        return next(
            (section_idx << 6) | slide_idx  # good enough, can go up to 64 slides without hash collision
            for section_idx, section in enumerate(self.sections)
            for slide_idx, current_slide in enumerate(section.slides)
            if current_slide == slide
        )


class ShikshaAgentEvent(BaseModel):
    type: str
    content: Any = None


class ShikshaCheckpointEvent(BaseModel):
    metadata: Any = None
    message: str | None = None


class ToolInfo(BaseModel):
    name: str = Field(..., description="Human-readable name of the tool")
    function_name: str = Field(..., description="The actual Python function name that implements the tool")
    description: str = Field(..., description="A brief explanation of what the tool does")


class WelcomeSlideInfo(BaseModel):
    slide_width_inches: float
    slide_height_inches: float
    message: str = "Slide created successfully."


class YouTubeVideoResult(BaseModel):
    title: str
    description: str
    channel: str
    published_at: str
    url: str
    thumbnail_url: str
