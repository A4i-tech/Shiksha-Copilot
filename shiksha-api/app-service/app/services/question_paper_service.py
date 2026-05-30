from collections import defaultdict
import json
from app.services.rag_adapter_cache import RagAdapterCache
from app.utils.utils import new_rag_embed, new_rag_llm
from pydantic import BaseModel
import yaml
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging

# 1. Official OpenAI SDK (For Direct Generation & Chat)
from openai import AsyncAzureOpenAI
from openai.types import ResponsesModel

# 2. LlamaIndex Imports (Strictly for RAG Adapter Compatibility)
from llama_index.core.llms import ChatMessage

# 3. Import only the Factory and Base Adapter
from app.services.rag_adapters import BaseRagAdapter, RagAdapterFactory

from app.models.question_paper import (
    AIGeneratedQuestionItem,
    FourOptionsQuestion,
    GeneratedQuestionItem,
    GeneratedTemplate,
    _LearningRecord,
    MatchingListQuestion,
    QBQuestionDistributionGenerationRequest,
    QuestionBankPartsGenerationRequest,
    QuestionBankResponse,
    QuestionBankMetadata,
    QuestionDistribution,
    QuestionTypeResponse,
    GRAMMAR_QUESTION_TYPES,
    TextQuestion,
)
from app.config import settings

logger = logging.getLogger(__name__)


class TemplateResponse(BaseModel):
    items: list[GeneratedTemplate]


class GeneratedQuestionItemResponse(BaseModel):
    items: list[AIGeneratedQuestionItem]


class QuestionPaperService:
    """Service for handling question paper generation using Azure OpenAI."""

    chat_deployment: ResponsesModel
    def __init__(self):
        self.client = AsyncAzureOpenAI(
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
            azure_endpoint=settings.azure_openai_endpoint,
        )
        if settings.azure_openai_deployment_name is None:
            raise RuntimeError("OpenAI deployment model must be specified")
        self.chat_deployment = settings.azure_openai_deployment_name
        self.embedding_deployment = settings.azure_openai_embed_model

        self._rag_llm = new_rag_llm()
        self._rag_embed = new_rag_embed()
        self._rags = RagAdapterCache(RagAdapterFactory.create_adapter)

        # Load YAML prompts
        self.prompt_dir = Path(__file__).parent.parent.parent / "prompts"
        self.prompts = self._load_prompts()
        self.max_questions_per_slot = 20
        self.concurrency = asyncio.Semaphore(5)


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


    def _flatten_existing_questions(self, existing: List[QuestionTypeResponse]) -> List[str]:
        """Extract question text from existing questions for uniqueness checking."""
        questions = []
        for qtr in existing:
            for q in qtr.questions:
                match q:
                    case TextQuestion(question=question) | FourOptionsQuestion(question=question):
                        questions.append(question)
                    case MatchingListQuestion(value1=value1, value2=value2):
                        questions.append(f"{value1} :: {value2}")
                    case _:
                        raise RuntimeError("don't know how to flatten %s" % q.__qualname__)
        return [q for q in questions if q]

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
        unit_questions: dict[str, list[tuple[GeneratedTemplate, QuestionDistribution]]] = defaultdict(list)  # Group questions by unit_name first
        for template in request.template:
            for dist in template.question_distribution:
                if dist.unit_name not in unit_lr:
                    logger.error(f"Unit mismatch. Searched for: '{dist.unit_name}'. Available: {list(unit_lr)}")
                    raise ValueError(f"Unit Name `{dist.unit_name}` is not present in the `chapters` list. Available: {list(unit_lr)}")
                unit_questions[dist.unit_name].append((template, dist))

        for unit_name, questions in unit_questions.items():
            lr = unit_lr[unit_name]
            for i in range(0, len(questions), self.max_questions_per_slot):
                yield lr, questions[i : i + self.max_questions_per_slot]


    def _format_system_prompt(
        self,
        request: QuestionBankPartsGenerationRequest,
        existing_questions: List[str],
        record: _LearningRecord,
        slot: list[tuple[GeneratedTemplate, QuestionDistribution]],
    ) -> str:
        """Format the system prompt using YAML templates for a specific unit slot."""
        # Get the main template
        template = self.prompts.get("question_bank_parts_gen", "")

        # Get Bloom's taxonomy guide
        bloom_lang = "english" if "english" in request.subject.lower() else "general"
        blooms_guide = self.prompts.get("blooms-taxonomy", {}).get(bloom_lang, "")

        # Format learning outcomes for this specific unit
        if record.learning_outcomes:
            unit_los_text = f"Unit Name: {record.title}:\n" + "\n".join(f"  - {lo}" for lo in record.learning_outcomes)
        else:
            unit_los_text = f"Unit Name: {record.title} (No specific LOs provided)"

        # Build grammar topics text, appending grammar guide if slot has grammar types
        grammar_topics_text = self._get_grammar_topics(request, record)
        slot_types = {template.type for template, _ in slot}
        if slot_types & GRAMMAR_QUESTION_TYPES:
            grammar_guide = self.prompts.get("grammar_question_types_guide", "")
            if grammar_guide:
                grammar_topics_text = (grammar_topics_text + "\n\n" + grammar_guide).strip()

        # Format the prompt for this specific unit
        return template.format(
            BOARD=request.board,
            MEDIUM=request.medium,
            GRADE=request.grade,
            SUBJECT=request.subject,
            TOTAL_MARKS=request.total_marks,
            CHAPTERS=record.title,  # Single unit for this batch
            UNIT_WISE_LEARNING_OUTCOMES=unit_los_text,
            EXISTING_QUESTIONS_JSON=json.dumps(existing_questions, ensure_ascii=False),
            QUESTION_BANK_BLOOM_TAXONOMY_GUIDE=blooms_guide,
            GRAMMAR_TOPICS=grammar_topics_text,
        )


    async def _generate_questions_batch(self, system_prompt: str, record: _LearningRecord, slot: list[tuple[GeneratedTemplate, QuestionDistribution]], rag_adapter: Optional[BaseRagAdapter]) -> list[GeneratedQuestionItem]:
        """
        Generate questions for a batch of slots.
        Uses RAG Adapter if available, otherwise uses direct Azure OpenAI call.
        """

        # Generate dynamic format rules
        unique_types = set(t.type for t, _ in slot)
        format_rules_text = "\n".join(f"- For {qtype.value}: conform to JSON schema for {qtype.model.__name__}." for qtype in unique_types)

        user_message = (
            "Generate questions for the following slots by following the rules listed below. "
            "`keyAnswer` field must be non-empty if the question model supports it.\n\n"
            "Return a JSON object: {\"items\": [...]} where each item has fields: "
            "`type` (one of the slot types below), `unit_name` (copy from the slot), "
            "`objective` (copy from the slot), `marks_per_question` (copy from the slot), "
            "`difficulty` (one of 'Easy', 'Average', 'Difficult'), and `item` (the generated "
            "question object matching the rule for that type).\n\n"
            "Rules by question type:\n"
            f"{format_rules_text}\n\n"
            f"Question slots:\n"
        )
        for _, question in slot:
            user_message += "- " + question.model_dump_json(ensure_ascii=False) + "\n"

        try:
            if not rag_adapter:
                # No Index -> Direct Generation (Zero-Shot)
                logger.info("Using Direct LLM Generation (No RAG).")
                response = await self.client.responses.parse(
                    model=self.chat_deployment,
                    instructions=system_prompt,
                    input=user_message,
                    text_format=GeneratedQuestionItemResponse,
                    temperature=0.7,
                )
                if response.output_parsed is None:
                    raise RuntimeError("Did not retrieve a valid response from model")
                items = response.output_parsed.items
            else:
                # Index Available -> RAG Generation
                logger.info(f"Using RAG Adapter for index: {record.index_path}")
                chat_history = [ChatMessage(role="system", content=system_prompt)]
                response_content = await rag_adapter.chat_with_index(
                    # rag-adapter does not support structured output, so we pass model json schema for now.
                    curr_message=user_message + "\n\nResponse format must conform to JSON schema:\n" + json.dumps(GeneratedQuestionItemResponse.model_json_schema()),
                    chat_history=chat_history,
                )
                # chat_with_index returns {"response": str, "source_nodes": list}
                content: str = response_content["response"]
                content = content.strip().removeprefix("```json").removesuffix("```")
                items = GeneratedQuestionItemResponse.model_validate_json(content).items
        except Exception as e:
            logger.exception(e)
            items = []

        return list(map(lambda x: GeneratedQuestionItem.model_validate({"unit_name": record.title, **x.model_dump()}), items))

    async def _generate_questions_batch_async(self, system_prompt: str, record: _LearningRecord, slot: list[tuple[GeneratedTemplate, QuestionDistribution]]) -> list[GeneratedQuestionItem]:
        async with self.concurrency:
            if not record.index_path.strip():
                fut = asyncio.Future()
                fut.set_result(None)
                logger.warning(f"Index path is missing for unit '{record.title}'. RAG retrieval will be skipped.")
            else:
                fut = self._rags.get(record.index_path, self._rag_llm, self._rag_embed)

            try:
                rag_adapter = await fut
                if rag_adapter is not None:
                    await rag_adapter.initiate_index()
            except RuntimeError as e:
                logger.exception(e)
                rag_adapter = None

            if rag_adapter is None:
                logger.debug(f"[RAG_ADAPTER] Skipping adapter creation for empty/fallback path: '{record.index_path}'")
            return await self._generate_questions_batch(system_prompt, record, slot, rag_adapter)

    def _organize_questions_into_response(self, request: QuestionBankPartsGenerationRequest, all_generated: list[GeneratedQuestionItem]) -> List[QuestionTypeResponse]:
        """Organize all generated questions into the final response structure."""
        question_directory = defaultdict(list)
        for g in all_generated:
            question_directory[g.type, g.marks_per_question, g.unit_name, g.objective].append(g.item)

        response_questions = []
        for template in request.template:
            questions = []
            for q_dist in template.question_distribution:
                key = template.type, template.marks_per_question, q_dist.unit_name, q_dist.objective
                if key in question_directory and len(question_directory[key]) > 0:
                    questions.append(question_directory[key].pop(0))
                    if len(question_directory[key]) == 0:
                        del question_directory[key]
                else:
                    logger.warning(f"--\nNo question found for Normalized key: {key}")

            response_questions.append(QuestionTypeResponse(
                type=template.type,
                number_of_questions=(
                    len(template.question_distribution)
                    if template.question_distribution
                    else template.number_of_questions
                ),
                marks_per_question=template.marks_per_question,
                questions=questions,
            ))

        return response_questions

    async def generate_question_bank_by_parts(self, request: QuestionBankPartsGenerationRequest) -> QuestionBankResponse:
        """
        Generate question bank by parts using parallel processing with delays and RAG.
        Updated to provide default values for school_name and examination_name to prevent DB validation errors.
        """

        existing_flat = self._flatten_existing_questions(request.existing_questions)
        tasks = []
        for lr, questions in self._build_generation_slots(request):
            logger.debug(f"[SLOT_PROCESSING] unit='{lr.title}' | index_path='{lr.index_path}'")
            system_prompt = self._format_system_prompt(request, existing_flat, lr, questions)
            tasks.append(self._generate_questions_batch_async(system_prompt, lr, questions))

        if not tasks:
            raise ValueError("No generation slots could be built from template/distribution.")

        all_generated: list[GeneratedQuestionItem] = []
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


    async def cleanup(self):
        await self._rags.cleanup()


    async def get_question_distribution(self, request: QBQuestionDistributionGenerationRequest) -> List[GeneratedTemplate]:
        """
        Generate question paper template based on unit-wise marks distribution.
        """

        def prepare_context() -> dict[str, Any]:
            lrs = request.chapters[0].subtopics if request.unit_level == "SUBTOPIC" else request.chapters
            units_str = ", ".join(lr.title for lr in lrs)

            # Helper to safely serialize pydantic models
            marks_distribution_str = json.dumps([md.model_dump(mode="json") for md in request.marks_distribution], indent=2)
            objective_distribution_str = json.dumps([od.model_dump(mode="json") for od in request.objective_distribution], indent=2)
            template_str = json.dumps([t.model_dump(mode="json") for t in request.template], indent=2)

            # Get Bloom's taxonomy guide
            bloom_lang = "english" if "english" in request.subject.lower() else "general"
            blooms_guide = self.prompts.get("blooms-taxonomy", {}).get(bloom_lang, "")

            return {
                "BOARD": request.board,
                "MEDIUM": request.medium,
                "GRADE": str(request.grade),
                "SUBJECT": request.subject,
                "TOTAL_MARKS": str(request.total_marks),
                "CHAPTERS": units_str,
                "QUESTION_BANK_BLOOM_TAXONOMY_GUIDE": blooms_guide,
                "MARKS_DISTRIBUTION": marks_distribution_str,
                "OBJECTIVE_DISTRIBUTION": objective_distribution_str,
                "TEMPLATE_JSON": template_str,
            }

        # Prepare Prompt Context
        prompt_context = prepare_context()
        prompt_template = self.prompts.get("question_bank_distribution", "")
        prompt = prompt_template.format(**prompt_context)
        # Call Azure OpenAI with Strict System Instructions
        response = await self.client.responses.parse(
            model=self.chat_deployment,
            instructions=(
                "You are a strict data generation assistant.\n"
                "You must output only a valid JSON Array based on the user request.\n"
                "Do not add any conversational text, markdown formatting, or explanations."
            ),
            input=prompt,
            temperature=0.1,
            text_format=TemplateResponse
        )

        if not response.output_parsed:
            logger.error(f"Failed raw response: {response.output_text}")
            raise RuntimeError("The AI model failed to generate a valid JSON structure.")

        return response.output_parsed.items


QUESTION_PAPER_SERVICE_INSTANCE = QuestionPaperService()
