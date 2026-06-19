import hashlib

from app.config import settings
from llama_index.llms.openai import OpenAIResponses
from llama_index.llms.azure_openai import AzureOpenAIResponses
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding


def new_rag_llm() -> OpenAIResponses:
    return AzureOpenAIResponses(
        model=settings.azure_openai_deployment_name,
        deployment_name=settings.azure_openai_deployment_name,
        api_key=settings.azure_openai_api_key,
        api_version=settings.azure_openai_api_version,
        azure_endpoint=settings.azure_openai_endpoint,
    )


def new_rag_embed() -> OpenAIEmbedding:
    return AzureOpenAIEmbedding(
        model=settings.azure_openai_embed_model,
        deployment_name=settings.azure_openai_embed_model,
        api_key=settings.azure_openai_api_key,
        azure_endpoint=settings.azure_openai_endpoint,
        api_version=settings.azure_openai_api_version,
    )


def local_unique_id(counter: int) -> str:
    # key really does not matter here, wee aren't aiming for crypto-secure but rather 'random-enough'. determinism
    # does not matter either - we just need to generate a sufficiently non-sequential stream of values. for instance,
    # a stream such as ['xxea', 'xxeb', 'xxec'] is sequential (bad) - one char off and the llm has 'guessed' some
    # other mapping. the solution below works well for up to 65,536 generations, far more than the amount an agent
    # would ever request during its runtime.
    return hashlib.blake2s(counter.to_bytes(2, "big"), key=b"shiksha-copilot", digest_size=4).hexdigest()