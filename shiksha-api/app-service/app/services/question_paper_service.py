import os
import json
import yaml
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging
import re

# 1. Official OpenAI SDK (For Direct Generation & Chat)
from openai import AzureOpenAI

# 2. LlamaIndex Imports (Strictly for RAG Adapter Compatibility)
from llama_index.llms.azure_openai import AzureOpenAI as LlamaAzureOpenAI
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.core.llms import ChatMessage

# 3. Import only the Factory and Base Adapter
# DO NOT IMPORT RAG_ADAPTER_CACHE here
from app.services.rag_adapters import BaseRagAdapter, RagAdapterFactory

from app.models.question_paper import (
    QBQuestionDistributionGenerationRequest,
    QuestionBankPartsGenerationRequest,
    QuestionBankResponse,
    QuestionBankMetadata,
    QuestionDistribution,
    QuestionTypeResponse,
    QuestionType,
    Template,
)
from app.config import settings

logger = logging.getLogger(__name__)


class QuestionPaperService:
    """Service for handling question paper generation using Azure OpenAI."""

    def __init__(self):
        self.client = AzureOpenAI(
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
            azure_endpoint=settings.azure_openai_endpoint,
        )
        self.chat_deployment = settings.azure_openai_deployment_name
        self.embedding_deployment = settings.azure_openai_embed_model

        self._rag_llm = LlamaAzureOpenAI(
            model=settings.azure_openai_deployment_name,
            deployment_name=settings.azure_openai_deployment_name,
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
            azure_endpoint=settings.azure_openai_endpoint,
        )
        self._rag_embed = AzureOpenAIEmbedding(
            model=settings.azure_openai_embed_model,
            deployment_name=settings.azure_openai_embed_model,
            api_key=settings.azure_openai_api_key,
            azure_endpoint=settings.azure_openai_endpoint,
            api_version=settings.azure_openai_api_version,
        )

        self._adapter_cache: Dict[str, BaseRagAdapter] = {}

        # Load YAML prompts
        self.prompt_dir = Path(__file__).parent.parent.parent / "prompts"
        self.prompts = self._load_prompts()
        self.max_questions_per_slot = 20

    def _normalize_string(self, s: str) -> str:
        """Centralized string normalization to collapse whitespace and trim."""
        if not s:
            return ""
        return re.sub(r"\s+", " ", s).strip().lower()

    def _load_prompts(self) -> Dict[str, Any]:
        """Load prompts from YAML files."""
        # Load question paper prompts
        qp_prompts_path = self.prompt_dir / "question_paper_prompts.yaml"
        blooms_path = self.prompt_dir / "blooms_taxonomy.yaml"
        english_grammar_path = self.prompt_dir / "english_grammar_topics.yaml"

        prompts = {}

        try:
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

        except Exception as e:
            logger.error(f"Error loading prompt templates: {e}")
            raise ValueError(f"Failed to load prompt templates: {e}")

    def _flatten_existing_questions(
        self, existing: List[QuestionTypeResponse]
    ) -> List[str]:
        """Extract question text from existing questions for uniqueness checking."""
        questions = []
        for qtr in existing:
            for q in qtr.questions:
                if hasattr(q, "question") and q.question:
                    questions.append(q.question)
                elif hasattr(q, "pairs") and q.pairs:
                    # For matching questions — stringify each pair
                    for pair in q.pairs:
                        questions.append(f"{pair.left} :: {pair.right}")
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

    def _get_unit_metadata(self, request: QuestionBankPartsGenerationRequest) -> Dict[str, Dict[str, Any]]:
        """
        Consolidated method to get Learning Outcomes and Index Paths for units.
        Ensures keys are consistent between LOs and Paths.
        """
        metadata = {}
        
        # Determine if this is a single-chapter request with subtopics
        use_subtopics = (
            len(request.chapters) == 1 
            and request.chapters[0].subtopics 
            and len(request.chapters[0].subtopics) > 0
        )

        if use_subtopics:
            chapter = request.chapters[0]
            # Use subtopics as units
            for subtopic in chapter.subtopics:
                metadata[subtopic.title] = {
                    "learning_outcomes": subtopic.learning_outcomes,
                    # Fallback to chapter index path if subtopic doesn't have specific one
                    "index_path": getattr(subtopic, "index_path", None) or chapter.index_path
                }
        else:
            # Use chapters as units
            for chapter in request.chapters:
                metadata[chapter.title] = {
                    "learning_outcomes": chapter.learning_outcomes,
                    "index_path": chapter.index_path
                }
        
        return metadata

    def _find_best_matching_unit(self, search_name: str, available_names: List[str]) -> Optional[str]:
        """
        Finds the best matching unit name from available names, handling prefixes and minor variations.
        """
        if not search_name or not available_names:
            return None

        normalized_search = self._normalize_string(search_name)

        # 1. Try Exact Match (Normalized)
        for name in available_names:
            if self._normalize_string(name) == normalized_search:
                return name

        # 2. Try Core Identifier Match
        def get_core_identifier(s: str) -> str:
            # Remove "unit" label followed by any numbering, or just numbering at start
            # e.g. "Unit 1: Name" -> "Name"
            # "1. Name" -> "Name"
            s_norm = self._normalize_string(s)
            # Remove "unit <d> :" or "unit <d>" prefix
            s_norm = re.sub(r"^unit\s*\d+[:.]?\s*", "", s_norm)
            # Remove "<d>. " prefix
            s_norm = re.sub(r"^\d+[:.]\s*", "", s_norm)
            return s_norm.strip()

        core_search = get_core_identifier(search_name)
        
        for name in available_names:
            if get_core_identifier(name) == core_search:
                return name

        # 3. Try containment (Normalized)
        # Check if one is a substring of the other (careful with short names)
        for name in available_names:
            norm_name = self._normalize_string(name)
            if norm_name in normalized_search or normalized_search in norm_name:
                return name

        return None

    def _build_generation_slots(
        self, request: QuestionBankPartsGenerationRequest
    ) -> List[Dict[str, Any]]:
        """Build generation slots from template distributions, grouped by unit with max 20 questions per slot."""
        
        # 1. Get unified metadata
        unit_metadata = self._get_unit_metadata(request)
        available_units = list(unit_metadata.keys())

        # Group questions by unit_name first
        unit_questions = {}

        for template in request.template:
            if (
                template.question_distribution
                and len(template.question_distribution) > 0
            ):
                # Use specified distribution
                for dist in template.question_distribution:
                    
                    matched_unit_name = self._find_best_matching_unit(dist.unit_name, available_units)
                    
                    if matched_unit_name is None:
                        logger.error(f"Unit mismatch. Searched for: '{dist.unit_name}'. Available: {available_units}")
                        raise ValueError(
                            f"Unit Name `{dist.unit_name}` is not present in the `chapters` list. Available: {available_units}"
                        )
                    
                    # Update distribution with correct key for consistency
                    dist.unit_name = matched_unit_name
                    
                    question_info = {
                        "type": template.type,
                        "objective": dist.objective,
                        "marks_per_question": template.marks_per_question,
                        "schema_hint": template.type.schema_dict(),
                    }

                    if dist.unit_name not in unit_questions:
                        unit_questions[dist.unit_name] = []
                    unit_questions[dist.unit_name].append(question_info)
            else:
                raise ValueError("Question Distribution should be defined")

        # Create slots with max 20 questions per slot
        slots = []

        for unit_name, questions in unit_questions.items():
            # Get metadata
            meta = unit_metadata.get(unit_name)
            unit_los = meta["learning_outcomes"]
            index_path = meta["index_path"]
            
            # Validate Index Path
            if not index_path:
                 logger.warning(f"Index path is missing for unit '{unit_name}'. RAG retrieval will be skipped.")
                 index_path = "EMPTY_INDEX_PATH_FALLBACK"

            for i in range(0, len(questions), self.max_questions_per_slot):
                batch = questions[i : i + self.max_questions_per_slot]
                slots.append(
                    {
                        "unit_name": unit_name,
                        "learning_outcomes": unit_los,
                        "questions": batch,
                        "index_path": index_path,
                    }
                )

        return slots

    def _format_system_prompt(
        self,
        request: QuestionBankPartsGenerationRequest,
        existing_questions: List[str],
        slot: Dict[str, Any],
    ) -> str:
        """Format the system prompt using YAML templates for a specific unit slot."""
        try:
            # Get the main template
            template = self.prompts.get("question_bank_parts_gen", "")

            # Get unit-specific information from the slot
            unit_name = slot["unit_name"]
            learning_outcomes = slot["learning_outcomes"]

            # Get Bloom's taxonomy guide
            blooms_guide = self.prompts.get("blooms-taxonomy", {}).get("general", "")
            if "english" in request.subject.lower():
                blooms_guide = self.prompts.get("blooms-taxonomy", {}).get(
                    "english", ""
                )

            # Format learning outcomes for this specific unit
            if learning_outcomes:
                unit_los_text = f"Unit Name: {unit_name}:\n" + "\n".join(
                    [f"  - {lo}" for lo in learning_outcomes]
                )
            else:
                unit_los_text = f"Unit Name: {unit_name} (No specific LOs provided)"

            # Format the prompt for this specific unit
            formatted_prompt = template.format(
                BOARD=request.board,
                MEDIUM=request.medium,
                GRADE=request.grade,
                SUBJECT=request.subject,
                TOTAL_MARKS=request.total_marks,
                CHAPTERS=unit_name,  # Single unit for this batch
                UNIT_WISE_LEARNING_OUTCOMES=unit_los_text,
                EXISTING_QUESTIONS_JSON=json.dumps(
                    existing_questions, ensure_ascii=False
                ),
                QUESTION_BANK_BLOOM_TAXONOMY_GUIDE=blooms_guide,
                GRAMMAR_TOPICS=self._get_grammar_topics(request),
            )

            return formatted_prompt

        except Exception as e:
            logger.error(f"Error formatting system prompt: {e}")
            raise ValueError(f"Failed to format system prompt: {e}")

    def _get_format_instruction_for_type(self, qtype: QuestionType) -> str:
        """Generate format instruction for a specific question type."""
        return f"- For {qtype}: {qtype.description}. Use format: {qtype.schema_dict()}"

    async def _get_or_create_rag_adapter(self, index_path: str) -> BaseRagAdapter:
        """
        Internal Cache Manager: Get or create a RAG adapter instance.
        """
        # Check Internal Cache
        if index_path in self._adapter_cache:
            return self._adapter_cache[index_path]

        logger.info(f"Creating new RAG Adapter for path: {index_path}")
        
        # 1. Create the instance
        adapter = RagAdapterFactory.create_adapter(
            index_path=index_path,
            completion_llm=self._rag_llm,      # Pass LlamaIndex wrapper
            embedding_llm=self._rag_embed,     # Pass LlamaIndex wrapper
        )
        
        # --- FIX START: Initialize the adapter before using it ---
        logger.info(f"Initializing RAG Adapter for path: {index_path}")
        await adapter.initialize() 
        # --- FIX END ---
        
        # 3. Store in Internal Cache
        self._adapter_cache[index_path] = adapter
        
        return adapter

    async def _generate_questions_batch(
        self, system_prompt: str, slot: Dict[str, Any], rag_adapter: Optional[BaseRagAdapter]
    ) -> List[Dict[str, Any]]:
        """
        Generate questions for a batch of slots.
        Uses RAG Adapter if available, otherwise uses direct Azure OpenAI call.
        """
        try:
            # Build slot directives
            slot_questions = slot["questions"]
            index_path = slot.get("index_path")

            # Generate dynamic format rules
            unique_types = set(q["type"] for q in slot_questions)
            format_rules = [
                self._get_format_instruction_for_type(qtype) for qtype in unique_types
            ]
            format_rules_text = "\n".join(format_rules)

            user_message = (
                "Generate questions for the following slots in a SINGLE JSON object with an `items` array. "
                "For each slot, return exactly ONE object with the following fields:\n "
                "`unit_name`, `type`, `objective`, `marks_per_question`, `difficulty` and `item`\n"
                "`difficulty` must be one of: 'Easy', 'Average', 'Difficult'. "
                "Vary difficulty across questions — aim for a roughly even spread. Do not use 'Average' for all questions.\n"
                "`item` field should adhere to the question's `schema_hint`.\n\n"
                "Format rules by question type:\n"
                f"{format_rules_text}\n"
                f"Question slots:\n{json.dumps(slot_questions, ensure_ascii=False)}"
            )

            print(
                "********************* SYSTEM PROMPT *********************",
                system_prompt,
            )
            print(
                "********************* USER MESSAGE *********************", user_message
            )

            response_content = ""

            if index_path == "EMPTY_INDEX_PATH_FALLBACK" or not rag_adapter:
                # No Index -> Direct Generation (Zero-Shot)
                logger.info("Using Direct LLM Generation (No RAG).")
                completion = self.client.chat.completions.create(
                    model=self.chat_deployment,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    temperature=0.7,
                    response_format={"type": "json_object"}
                )
                response_content = completion.choices[0].message.content

            else:
                # Index Available -> RAG Generation
                logger.info(f"Using RAG Adapter for index: {index_path}")
                chat_history = [ChatMessage(role="system", content=system_prompt)]
                response_content = await rag_adapter.chat_with_index(
                    curr_message=user_message, chat_history=chat_history
                )

            # Clean response
            content = response_content.strip("```json").strip("```")
            response_data = json.loads(content)

            print(
                "********************** RESPONSE DATA **********************",
                json.dumps(response_data, indent=2),
            )

            items = response_data.get("items")
            if not items:
                logger.warning("No items found in completion response")
                return []
            
            # Post-process items to ensure difficulty text case
            for item in items:
                if 'difficulty' in item:
                    item['difficulty'] = item['difficulty'].capitalize()

            return items

        except Exception as e:
            logger.exception(f"Error in batch generation: {e}")
            return []

    async def _generate_questions_batch_async(
        self,
        system_prompt: str,
        slot: Dict[str, Any],
        rag_adapter: Optional[BaseRagAdapter],
        delay_seconds: int = 0,
    ) -> List[Dict[str, Any]]:
        """Async version of _generate_questions_batch with optional delay."""
        if delay_seconds > 0:
            await asyncio.sleep(delay_seconds)
        return await self._generate_questions_batch(system_prompt, slot, rag_adapter)

    def _organize_questions_into_response(
        self,
        request: QuestionBankPartsGenerationRequest,
        all_generated: List[Dict[str, Any]],
    ) -> List[QuestionTypeResponse]:
        """Organize all generated questions into the final response structure."""
        try:
            # Create a question directory to organize questions by their specification
            question_directory = {}

            # Need available units for matching
            available_units = [chapter.title for chapter in request.chapters]
            if len(request.chapters) == 1 and request.chapters[0].subtopics:
                 available_units = [sub.title for sub in request.chapters[0].subtopics]

            for i, generated in enumerate(all_generated):
                qtype = QuestionType(generated.get("type"))
                unit_name = generated.get("unit_name")
                objective = generated.get("objective")
                marks_per_question = generated.get("marks_per_question")
                difficulty = generated.get("difficulty", "Average")
                item = generated.get("item")
                
                # Inject difficulty into item if it's a dict
                if isinstance(item, dict):
                    item["difficulty"] = difficulty

                # Normalize key
                norm_type = self._normalize_string(qtype.value)
                
                # --- FIX: Use smart matching for unit name ---
                matched_unit = self._find_best_matching_unit(unit_name, available_units)
                if matched_unit:
                    norm_unit = self._normalize_string(matched_unit)
                else:
                    # Fallback to normalized input if no match found (might still fail lookup but logs will show why)
                    logger.warning(f"Could not map generated unit '{unit_name}' to any available unit: {available_units}")
                    norm_unit = self._normalize_string(unit_name)
                # ---------------------------------------------

                # Objective can be None or empty
                norm_objective = self._normalize_string(objective) if objective else "none"
                
                key = f"{norm_type}|{marks_per_question}|{norm_unit}|{norm_objective}"
                if key not in question_directory:
                    question_directory[key] = []

                question_directory[key].append(qtype.cast(item))

            # Build the final response
            response_questions = []
            for template in request.template:
                question_type_resp = QuestionTypeResponse(
                    type=template.type,
                    number_of_questions=(
                        len(template.question_distribution)
                        if template.question_distribution
                        else template.number_of_questions
                    ),
                    marks_per_question=template.marks_per_question,
                    questions=[],
                )

                for q_dist in template.question_distribution or []:
                    norm_type = self._normalize_string(template.type.value)
                    norm_unit = self._normalize_string(q_dist.unit_name)
                    norm_objective = self._normalize_string(q_dist.objective) if q_dist.objective else "none"
                    
                    key = f"{norm_type}|{template.marks_per_question}|{norm_unit}|{norm_objective}"

                    if key in question_directory and len(question_directory[key]) > 0:
                        question = question_directory[key].pop(0)
                        question_type_resp.questions.append(question)

                        if len(question_directory[key]) == 0:
                            del question_directory[key]
                    else:
                        logger.warning(
                            f"--\nNo question found for Normalized key: {key}"
                        )

                response_questions.append(question_type_resp)

            return response_questions

        except Exception as e:
            logger.exception(f"Error organizing questions into response: {e}")
            raise

    async def generate_question_bank_by_parts(
        self, request: QuestionBankPartsGenerationRequest
    ) -> QuestionBankResponse:
        """
        Generate question bank by parts using parallel processing with delays and RAG.
        Updated to provide default values for school_name and examination_name to prevent DB validation errors.
        """
        try:
            # Build generation slots
            slots = self._build_generation_slots(request)
            if not slots:
                raise ValueError(
                    "No generation slots could be built from template/distribution."
                )

            # Prepare existing questions
            existing_flat = self._flatten_existing_questions(request.existing_questions)

            # Process in parallel batches
            all_generated = []
            batch_size = 3

            for i in range(0, len(slots), batch_size):
                batch_slots = slots[i : i + batch_size]
                tasks = []
                for j, slot in enumerate(batch_slots):
                    index_path = slot["index_path"]
                    
                    # Get Native/Qdrant adapter from cache
                    rag_adapter = await self._get_or_create_rag_adapter(index_path)
                    
                    # Generate system prompt
                    system_prompt = self._format_system_prompt(
                        request, existing_flat, slot
                    )

                    # Create task
                    task = self._generate_questions_batch_async(
                        system_prompt, slot, rag_adapter, j * 2
                    )
                    tasks.append(task)

                # Wait for batch
                batch_results = await asyncio.gather(*tasks)

                for raw_items in batch_results:
                    if raw_items:
                        all_generated.extend(raw_items)

            # Organize response
            response_questions = self._organize_questions_into_response(
                request, all_generated
            )
            
            # safely get school_name (default if missing)
            req_school_name = getattr(request, "school_name", None)
            final_school_name = req_school_name if req_school_name else "Shiksha Partner School"

            # safely get examination_name (default if missing)
            req_exam_name = getattr(request, "examination_name", None)
            final_exam_name = req_exam_name if req_exam_name else "Class Assessment"

            return QuestionBankResponse(
                metadata=QuestionBankMetadata(
                    user_id=request.user_id,
                    subject=request.subject,
                    grade=str(request.grade),
                    unit_names=[c.title for c in request.chapters],
                    school_name=final_school_name,
                    examination_name=final_exam_name, 
                ),
                questions=response_questions,
            )

        except Exception as e:
            logger.error(f"Error in generate_question_bank_by_parts: {e}")
            raise

    async def cleanup(self) -> None:
        """Clear the internal RAG adapter cache and resources."""
        # Cleanup all adapters in local cache
        for adapter in self._adapter_cache.values():
             await adapter.cleanup()
        self._adapter_cache.clear()

    async def get_question_distribution(
        self,
        request: QBQuestionDistributionGenerationRequest,
    ) -> List[Template]:
        """
        Generate question paper template based on unit-wise marks distribution.
        """

        def prepare_context() -> str:
            units_str = ""
            if len(request.chapters) > 1:
                units_str = ", ".join(chapter.title for chapter in request.chapters)
            elif len(request.chapters) == 1:
                if request.chapters[0].subtopics:
                    units_str = ", ".join(
                        [sub.title for sub in request.chapters[0].subtopics]
                    )
                else:
                    units_str = request.chapters[0].title

            # Helper to safely serialize pydantic models
            marks_distribution_str = json.dumps(
                [md.model_dump() for md in request.marks_distribution], indent=2
            )
            objective_distribution_str = json.dumps(
                [od.model_dump() for od in request.objective_distribution], indent=2
            )
            template_str = json.dumps(
                [t.model_dump() for t in request.template], indent=2
            )

            # Example structure to guide the LLM
            output_structure = json.dumps(
                [
                    Template(
                        type=QuestionType.ANSWER_SHORT,
                        number_of_questions=3,
                        marks_per_question=2,
                        question_distribution=[
                            QuestionDistribution(
                                unit_name="Example Unit Name", objective="Knowledge"
                            )
                        ],
                    ).model_dump()
                ],
                indent=4,
            )

            # Get Bloom's taxonomy guide
            blooms_guide = self.prompts.get("blooms-taxonomy", {}).get("general", "")
            if "english" in request.subject.lower():
                blooms_guide = self.prompts.get("blooms-taxonomy", {}).get(
                    "english", ""
                )

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
                "OUTPUT_FORMAT": output_structure,
            }

        try:
            # Prepare Prompt Context
            prompt_context = prepare_context()
            prompt_template = self.prompts.get("question_bank_distribution", "")
            prompt = prompt_template.format(**prompt_context)

            # Extract Valid Enum Values to enforce constraint
            valid_types = [t.value for t in QuestionType]
            valid_types_str = json.dumps(valid_types, indent=2)

            print(
                "********************** QUESTION DISTRIBUTION PROMPT **********************",
                prompt,
            )

            # Call Azure OpenAI with Strict System Instructions
            response = self.client.chat.completions.create(
                model=self.chat_deployment,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a strict data generation assistant.\n"
                            "You must output only a valid JSON Array based on the user request.\n"
                            "Do not add any conversational text, markdown formatting, or explanations.\n\n"
                            "CRITICAL SCHEMA RULES:\n"
                            "1. The output objects must NOT contain a 'description' field.\n"
                            "2. The 'type' field must match exactly one of the following strings:\n"
                            f"{valid_types_str}\n"
                            "3. 'question_distribution' must be a list of objects with 'unit_name' and 'objective'.\n"
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.1,
            )

            # Clean Response
            response_text = response.choices[0].message.content.strip()

            # Remove Markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            response_text = response_text.strip()

            print(
                "********************** QUESTION DISTRIBUTION RESPONSE **********************",
                response_text,
            )

            # Parse and Sanitize Data
            js = json.loads(response_text)
            
            cleaned_items = []
            for item in js:
                if "description" in item:
                    del item["description"]
                
                if "question_distribution" in item and item["question_distribution"] is None:
                     item["question_distribution"] = []

                cleaned_items.append(item)

            new_template = [Template(**item) for item in cleaned_items]

            verfication_status, reason = (
                request.verify_template_for_marks_and_objective_distribution(new_template)
            )
            logger.info(verfication_status)
            logger.info(reason)

            return new_template

        except json.JSONDecodeError as je:
            logger.error(f"Failed to decode JSON from LLM response: {je}")
            logger.error(f"Raw Response: {response_text}")
            raise ValueError("The AI model failed to generate a valid JSON structure.")
        except Exception as e:
            logger.exception(f"Error in get_question_distribution: {e}")
            raise


QUESTION_PAPER_SERVICE_INSTANCE = QuestionPaperService()
