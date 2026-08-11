from collections import defaultdict
import json
from app.services.rag_adapter_cache import RagAdapterCache
from app.utils.utils import local_unique_id
from pydantic import Field, create_model
import yaml
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging

# 1. Official OpenAI SDK (For Direct Generation & Chat)
from langfuse import observe, propagate_attributes
from langfuse.openai import AsyncOpenAI

# 2. LlamaIndex Imports (Strictly for RAG Adapter Compatibility)
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.base.response.schema import PydanticResponse
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAIResponses

# 3. Import only the Factory and Base Adapter
from app.services.rag_adapters import BaseRagAdapter

from app.models.question_paper import (
    FourOptionsQuestion,
    GeneratedQuestionItem,
    GeneratedTemplate,
    _LearningRecord,
    MatchingListQuestion,
    QuestionBankPartsGenerationRequest,
    QuestionBankResponse,
    QuestionBankMetadata,
    QuestionDistribution,
    QuestionModel,
    QuestionTypeResponse,
    GRAMMAR_QUESTION_TYPES,
    TextQuestion,
)
from app.config import settings

logger = logging.getLogger(__name__)
SlotId = tuple[int, int]
GenerationSlot = tuple[SlotId, GeneratedTemplate, QuestionDistribution]
GeneratedSlotQuestion = tuple[SlotId, GeneratedQuestionItem]


class QuestionPaperService:
    """Service for handling question paper generation using OpenAI."""

    def __init__(self):
        self.client = AsyncOpenAI()
        self._rag_llm = OpenAIResponses(model=settings.question_paper_model)
        self._rag_embed = OpenAIEmbedding(model=settings.embed_model)
        self._rags = RagAdapterCache(RagAdapterCache.from_factory)
        self.prompt_dir = Path(__file__).parent.parent.parent / "prompts"
        self.prompts = self._load_prompts()
        self.max_questions_per_slot = 20
        self.concurrency = asyncio.Semaphore(5)


    async def __aenter__(self):
        return self


    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self._rags.cleanup()


    def _load_prompts(self) -> Dict[str, Any]:
        """Load prompts from YAML files."""
        # Load question paper prompts
        qp_prompts_path = self.prompt_dir / "question_paper_prompts.yaml"
        blooms_path = self.prompt_dir / "blooms_taxonomy.yaml"

        prompts = {}

        with open(qp_prompts_path, "r", encoding="utf-8") as f:
            qp_data = yaml.safe_load(f)
            prompts.update(qp_data)

        with open(blooms_path, "r", encoding="utf-8") as f:
            blooms_data = yaml.safe_load(f)
            prompts.update(blooms_data)

        grammar_prompts_path = self.prompt_dir / "grammar_prompt_templates.yaml"
        with open(grammar_prompts_path, "r", encoding="utf-8") as f:
            grammar_prompt_data = yaml.safe_load(f)
            prompts.update(grammar_prompt_data)


        logger.info("Successfully loaded prompt templates")
        return prompts

    def _flatten_questions(self, existing: list[QuestionModel]) -> list[str]:
        to_text = lambda v: "\n".join(c.content.decode("utf-8") for c in v if c.content_type == "text/plain")
        questions = []
        for q in existing:
            match q:
                case TextQuestion(question=question) | FourOptionsQuestion(question=question):
                    if text := to_text(question):
                        questions.append(text)
                case MatchingListQuestion(value1=value1, value2=value2):
                    if (v1 := to_text(value1)) and (v2 := to_text(value2)):
                        questions.append(f"{v1} :: {v2}")
                case _:
                    raise RuntimeError("don't know how to flatten %s" % type(q).__qualname__)
        return questions

    def _get_grammar_topics(self, request: QuestionBankPartsGenerationRequest, record: _LearningRecord) -> str:
        """Return a grammar focus instruction for the slot, or "" when no grammar
        chapter is selected. Grammar chapters are identified by the ``is_grammar``
        flag and their topics by ``grammar_topics``."""
        grammar_units = [
            topic.strip()
            for ch in request.chapters
            if ch.is_grammar
            for topic in (ch.grammar_topics or [])
            if topic and topic.strip()
        ]
        if not grammar_units:
            return ""

        grammar_topic = "; ".join(grammar_units)

        source_chapters = record.grammar_source_chapters or []
        if source_chapters:
            chapter_names = ", ".join(source_chapters)
            return self.prompts["grammar_context_prompt"].format(
                GRAMMAR_TOPIC=grammar_topic,
                GRAMMAR_TOPIC_UPPER=grammar_topic.upper(),
                CHAPTER_NAMES=chapter_names,
            )

        return self.prompts["grammar_simple_prompt"].format(GRAMMAR_TOPIC=grammar_topic)


    def _build_generation_slots(self, request: QuestionBankPartsGenerationRequest):
        """Build generation slots from template distributions, grouped by unit with max questions per slot."""
        lrs = request.chapters[0].subtopics if request.unit_level == "SUBTOPIC" else request.chapters
        unit_lr = {lr.title: lr for lr in lrs}
        unit_questions: dict[str, list[GenerationSlot]] = defaultdict(list)  # Group questions by unit_name first
        for template_i, template in enumerate(request.template):
            for dist_i, dist in enumerate(template.question_distribution):
                if dist.unit_name not in unit_lr:
                    logger.error(f"Unit mismatch. Searched for: '{dist.unit_name}'. Available: {list(unit_lr)}")
                    raise ValueError(f"Unit Name `{dist.unit_name}` is not present in the `chapters` list. Available: {list(unit_lr)}")
                unit_questions[dist.unit_name].append(((template_i, dist_i), template, dist))

        for unit_name, questions in unit_questions.items():
            lr = unit_lr[unit_name]
            for i in range(0, len(questions), self.max_questions_per_slot):
                yield lr, questions[i : i + self.max_questions_per_slot]


    def _format_system_prompt(self, request: QuestionBankPartsGenerationRequest, record: _LearningRecord, slot: list[GenerationSlot]) -> str:
        """Format the system prompt using YAML templates for a specific unit slot."""
        # Get the main template
        template = self.prompts["question_bank_parts_gen"]

        # Get Bloom's taxonomy guide
        bloom_lang = "english" if "english" in request.subject.lower() else "general"
        blooms_guide = self.prompts["blooms-taxonomy"][bloom_lang]

        # Build grammar topics text, appending grammar guide if slot has grammar types
        grammar_topics_text = self._get_grammar_topics(request, record)
        slot_types = {template.type for _, template, _ in slot}
        if slot_types & GRAMMAR_QUESTION_TYPES:
            grammar_guide = self.prompts.get("grammar_question_types_guide", "")
            if grammar_guide:
                grammar_topics_text = (grammar_topics_text + "\n\n" + grammar_guide).strip()

        # Build question clarity guide, appending the maths-specific add-on when the subject is maths
        clarity_guide = self.prompts.get("question_clarity_guide", "")
        if "math" in request.subject.lower():
            maths_clarity_guide = self.prompts.get("maths_question_clarity_guide", "")
            if maths_clarity_guide:
                clarity_guide = (clarity_guide + "\n\n" + maths_clarity_guide).strip()

        return self.prompts["question_bank_parts_gen"].format(
            BLOOM_TAXONOMY_GUIDE=blooms_guide, GRAMMAR_TOPICS=grammar_topics_text, QUESTION_CLARITY_GUIDE=clarity_guide
        )


    @observe(name="question_generation")
    async def _generate_questions_batch(self, system_prompt: str, request: QuestionBankPartsGenerationRequest, existing_questions: list[str], record: _LearningRecord, slot: list[GenerationSlot], rag_adapter: Optional[BaseRagAdapter]) -> list[GeneratedSlotQuestion]:
        """
        Generate questions for a batch of slots.
        Uses RAG Adapter if available, otherwise uses direct OpenAI call.
        """

        # Format learning outcomes for this specific unit
        if record.learning_outcomes:
            unit_los_text = f"Unit Name: {record.title}:\n" + "\n".join(f"  - {lo}" for lo in record.learning_outcomes)
        else:
            unit_los_text = f"Unit Name: {record.title} (No specific LOs provided)"

        user_message = self.prompts["question_bank_parts_gen_retrieval_query_template"].format(
            RULES="\n".join(f"- {q.value}: {q.description}" for q in set(t.type for _, t, _ in slot)),
            CHAPTER=record.title,
            LEARNING_OUTCOMES="\n".join(f"- {lo}" for lo in record.learning_outcomes),
            BOARD=request.board,
            MEDIUM=request.medium,
            GRADE=request.grade,
            SUBJECT=request.subject,
            TOTAL_MARKS=request.total_marks,
            CHAPTERS=record.title,  # Single unit for this batch
            UNIT_WISE_LEARNING_OUTCOMES=unit_los_text,
            EXISTING_QUESTIONS_JSON=json.dumps(existing_questions, ensure_ascii=False),
        )

        slot_indexed = {local_unique_id(i): v for i, v in enumerate(slot)}
        response_format = create_model("QuestionResponse", **{
            k: (template.type.model, Field(description=f"{template.type.value} model for {question.model_dump(mode='json')}"))
            for k, (_, template, question) in slot_indexed.items()
        })  # type: ignore[call-overload]

        try:
            if not rag_adapter:
                # No Index -> Direct Generation (Zero-Shot)
                logger.info("Using Direct LLM Generation (No RAG).")
                response = await self.client.responses.parse(
                    model=settings.question_paper_model,
                    instructions=system_prompt,
                    input=user_message,
                    text_format=response_format,
                    temperature=0.7,
                )
                if response.output_parsed is None:
                    raise RuntimeError("Did not retrieve a valid response from model")
                items = response.output_parsed
            else:
                # Index Available -> RAG Generation
                logger.info(f"Using RAG Adapter for index: {record.index_path}")
                chat_history = [ChatMessage(role=MessageRole.SYSTEM, content=system_prompt)]
                with propagate_attributes(metadata={
                    "unit_name": record.title,
                    "question_types": ", ".join(t.type.value for _, t, _ in slot),
                    "slot_count": str(len(slot)),
                    "model": settings.question_paper_model,
                    "rag_enabled": "true" if rag_adapter is not None else "false",
                    "index_path": record.index_path,
                }):
                    response_content = await rag_adapter.chat_with_index(curr_message=user_message, chat_history=chat_history, output_cls=response_format)
                    assert isinstance(response_content, PydanticResponse)
                items = response_content.response
        except Exception as e:
            logger.exception(e)
            return []

        return [
            (slot_id, GeneratedQuestionItem(unit_name=record.title, type=template.type, objective=question.objective, marks_per_question=template.marks_per_question, item=getattr(items, k)))
            for k, (slot_id, template, question) in slot_indexed.items()
        ]

    async def _generate_questions_batch_async(self, system_prompt: str, request: QuestionBankPartsGenerationRequest, existing_questions: list[str], record: _LearningRecord, slot: list[GenerationSlot]) -> list[GeneratedSlotQuestion]:
        async with self.concurrency:
            if not record.index_path.strip():
                fut = asyncio.Future()
                fut.set_result(None)
                logger.warning(f"Index path is missing for unit '{record.title}'. RAG retrieval will be skipped.")
            else:
                fut = self._rags.get(record.index_path, self._rag_llm, self._rag_embed)

            try:
                rag_adapter = await fut
            except RuntimeError as e:
                logger.exception(e)
                rag_adapter = None

            if rag_adapter is None:
                logger.debug(f"[RAG_ADAPTER] Skipping adapter creation for empty/fallback path: '{record.index_path}'")
            return await self._generate_questions_batch(system_prompt, request, existing_questions, record, slot, rag_adapter)

    @observe(name="output_formatting")
    def _organize_questions_into_response(self, request: QuestionBankPartsGenerationRequest, all_generated: list[GeneratedSlotQuestion]) -> List[QuestionTypeResponse]:
        """Organize all generated questions into the final response structure."""
        question_directory = {slot_id: g.item for slot_id, g in all_generated}

        response_questions = []
        for template_i, template in enumerate(request.template):
            questions = []
            for dist_i, q_dist in enumerate(template.question_distribution):
                key = template_i, dist_i
                if key in question_directory:
                    questions.append(question_directory[key])
                else:
                    logger.warning(f"--\nNo question found for slot: {(template.type, template.marks_per_question, q_dist.unit_name, q_dist.objective)}")

            expected = (
                len(template.question_distribution)
                if template.question_distribution
                else template.number_of_questions
            )
            actual = len(questions)
            if actual < expected:
                logger.warning(
                    "Partial QB result for type=%s: expected %d questions, got %d. "
                    "LLM generation may have returned fewer items than requested.",
                    template.type.value,
                    expected,
                    actual,
                )
            response_questions.append(QuestionTypeResponse(
                type=template.type,
                number_of_questions=expected,
                marks_per_question=template.marks_per_question,
                questions=questions,
            ))

        total_expected = sum(
            len(t.question_distribution) if t.question_distribution else t.number_of_questions
            for t in request.template
        )
        total_actual = sum(len(qtr.questions) for qtr in response_questions)
        if total_actual < total_expected:
            logger.warning(
                "QB generation incomplete: expected %d total questions, produced %d. "
                "Returning partial result to caller.",
                total_expected,
                total_actual,
            )

        return response_questions

    @observe(name="Shiksha-QB")
    async def generate_question_bank_by_parts(self, request: QuestionBankPartsGenerationRequest) -> QuestionBankResponse:
        """
        Generate question bank by parts using parallel processing with delays and RAG.
        Updated to provide default values for school_name and examination_name to prevent DB validation errors.
        """
        all_los = [lo for ch in request.chapters for lo in ch.learning_outcomes]
        all_generated: list[GeneratedSlotQuestion] = []
        with propagate_attributes(
            user_id=request.user_id,
            session_id=request.session_id,
            tags=[
                "chat_type:question-bank",
                f"board:{request.board}",
                f"grade:{request.grade}",
                f"subject:{request.subject}",
            ],
            metadata={
                "board": request.board,
                "grade": str(request.grade),
                "subject": request.subject,
                "medium": request.medium,
                "chapters": ", ".join(ch.title for ch in request.chapters),
                "learning_outcomes": ", ".join(all_los),
                "question_types": ", ".join(t.type.value for t in request.template),
                "total_marks": str(request.total_marks),
                "model": settings.question_paper_model,
            },
        ):
            existing_flat = list({q for batch in request.existing_questions for q in self._flatten_questions(batch.questions)})
            tasks = []
            for lr, questions in self._build_generation_slots(request):
                logger.debug(f"[SLOT_PROCESSING] unit='{lr.title}' | index_path='{lr.index_path}'")
                system_prompt = self._format_system_prompt(request, lr, questions)
                tasks.append(self._generate_questions_batch_async(system_prompt, request, existing_flat, lr, questions))

            if not tasks:
                raise ValueError("No generation slots could be built from template/distribution.")

            for raw_items in await asyncio.gather(*tasks):
                all_generated.extend(raw_items)

        response_questions = self._organize_questions_into_response(request, all_generated)
        return QuestionBankResponse(metadata=QuestionBankMetadata(
            user_id=request.user_id,
            subject=request.subject,
            grade=str(request.grade),
            unit_names=[c.title for c in request.chapters],
            school_name=request.school_name,
            examination_name=request.examination_name,
        ), questions=response_questions)
