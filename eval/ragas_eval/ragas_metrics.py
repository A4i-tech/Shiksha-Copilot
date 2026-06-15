from ragas.metrics import (
    ContextPrecision,
    ContextRecall,
    Faithfulness,
    AnswerCorrectness,
    AspectCritic,
    ResponseRelevancy,
)
from ragas.llms import LangchainLLMWrapper
from langchain_openai import AzureChatOpenAI
import config


def get_judge_llm() -> LangchainLLMWrapper:
    cfg = config.GPT4O_CONFIG
    llm = AzureChatOpenAI(
        azure_deployment=cfg["deployment_name"],
        openai_api_key=cfg["api_key"],
        azure_endpoint=cfg["endpoint"],
        api_version=cfg["api_version"],
        temperature=0,
    )
    return LangchainLLMWrapper(llm)


def get_core_ragas_metrics(judge_llm: LangchainLLMWrapper) -> list:
    """All 4 core RAGAS metrics from issue #184."""
    return [
        ContextPrecision(llm=judge_llm),
        ContextRecall(llm=judge_llm),
        Faithfulness(llm=judge_llm),
        AnswerCorrectness(llm=judge_llm),
    ]


def get_domain_metrics_for_type(eval_type: str, judge_llm: LangchainLLMWrapper) -> list:
    """Domain-specific AspectCritic + ResponseRelevancy per eval type."""
    relevancy = ResponseRelevancy(llm=judge_llm)

    if eval_type == "lesson_plan":
        return [
            relevancy,
            AspectCritic(
                name="pedagogical_soundness",
                definition=(
                    "Does the response demonstrate sound pedagogical practices appropriate for K-12 classrooms? "
                    "It should include clear explanations, examples, and structured learning progression."
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="grade_appropriateness",
                definition=(
                    "Is the language, complexity, and content depth appropriate for the specified grade level? "
                    "Vocabulary, sentence length, and concept difficulty should match the grade."
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="curriculum_alignment",
                definition=(
                    "Does the response directly address the stated learning outcomes and chapter topic? "
                    "Content should be aligned to the specified curriculum goals."
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="classroom_practicality",
                definition=(
                    "Can a teacher use this content directly in a classroom without significant modification? "
                    "It should be actionable, clear, and practically implementable."
                ),
                llm=judge_llm,
            ),
        ]

    elif eval_type == "lesson_resource":
        return [
            relevancy,
            AspectCritic(
                name="resource_richness",
                definition=(
                    "Does the response provide rich and varied teaching resources including activities, "
                    "discussion questions, vocabulary work, or comprehension tasks?"
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="english_pedagogy",
                definition=(
                    "Does the response follow best practices for English language teaching including "
                    "pre-reading, while-reading, and post-reading phases where applicable?"
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="activity_quality",
                definition=(
                    "Are the activities engaging, student-centered, and designed to develop language skills "
                    "such as reading, writing, speaking, or listening?"
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="scaffolding_quality",
                definition=(
                    "Does the response provide appropriate scaffolding for learners, such as guided questions, "
                    "context building, and support for comprehension before independent work?"
                ),
                llm=judge_llm,
            ),
        ]

    elif eval_type == "question_paper":
        return [
            relevancy,
            AspectCritic(
                name="bloom_taxonomy_coverage",
                definition=(
                    "Do the generated questions span multiple levels of Bloom's Taxonomy "
                    "(knowledge, understanding, application, analysis)? There should be a mix of cognitive levels."
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="question_quality",
                definition=(
                    "Are the questions well-formed, unambiguous, and grammatically correct? "
                    "MCQs should have one clearly correct answer; answers should be accurate."
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="curriculum_coverage",
                definition=(
                    "Do the questions cover the specified chapter topics and learning outcomes? "
                    "Questions should be directly tied to the curriculum content provided."
                ),
                llm=judge_llm,
            ),
            AspectCritic(
                name="difficulty_balance",
                definition=(
                    "Is there an appropriate distribution across Easy, Average, and Difficult questions? "
                    "A good question paper should not be uniformly easy or uniformly hard."
                ),
                llm=judge_llm,
            ),
        ]

    else:
        raise ValueError(f"Unknown eval_type: {eval_type}")
