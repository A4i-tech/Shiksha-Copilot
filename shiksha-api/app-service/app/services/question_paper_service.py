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
from app.services.rag_adapters import BaseRagAdapter

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
        self._rags = RagAdapterCache(RagAdapterCache.from_factory)

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
        english_grammar_path = self.prompt_dir / "english_grammar_topics.yaml"

        prompts = {}

        with open(qp_prompts_path, "r", encoding="utf-8") as f:
            qp_data = yaml.safe_load(f)
            prompts.update(qp_data)

        with open(blooms_path, "r", encoding="utf-8") as f:
            blooms_data = yaml.safe_load(f)
            prompts.update(blooms_data)

        with open(english_grammar_path, "r", encoding="utf-8") as f:
            grammar_data = yaml.safe_load(f)
            prompts.update(grammar_data)

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


    def _get_grammar_topics(self, request: QuestionBankPartsGenerationRequest) -> str:
        """
        Reads the NCERT grammar topics YAML and returns a dict
        mapping grade (int) to list of topics (list of str).
        """
        if "english" in request.subject.lower():
            # The YAML top‐level key is 'ncert_grammar_topics'
            topics = self.prompts.get("grammar_topics", {})

            # Ensure all grade keys are ints (PyYAML may load them as ints already)
            topic_map = {int(grade): topic_list for grade, topic_list in topics.items()}

            return (
                "⚠ **GRAMMAR FOCUS REQUIREMENT**: For English subject only, include grammar-related questions drawn from each unit’s content."
                + "\nCover following topics: "
                + "; ".join(topic_map[request.grade])
                if request.grade in topic_map
                else ""
            )

        return ""


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


    def _format_system_prompt(self, request: QuestionBankPartsGenerationRequest, existing_questions: List[str], record: _LearningRecord) -> str:
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
            GRAMMAR_TOPICS=self._get_grammar_topics(request),
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
                response_content = await rag_adapter.chat_with_index(curr_message=user_message, chat_history=chat_history, output_cls=GeneratedQuestionItemResponse)
                items = GeneratedQuestionItemResponse.model_validate_json(response_content["response"]).items
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
            system_prompt = self._format_system_prompt(request, existing_flat, lr)
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
