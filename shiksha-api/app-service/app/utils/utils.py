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