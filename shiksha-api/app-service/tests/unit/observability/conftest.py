"""
Conftest for observability unit tests.

Sets minimal Azure OpenAI env vars so that module-level service instantiation
(e.g. GENERAL_CHAT_SERVICE_INSTANCE = GeneralChatService()) does not raise
during pytest collection or test import.
"""
import os

# Set required env vars before any app module is imported.
# These are fake values used only for unit tests; no real API calls are made.
_TEST_ENV_VARS = {
    "AZURE_OPENAI_API_KEY": "test-key-for-unit-tests",
    "AZURE_OPENAI_ENDPOINT": "https://test.openai.azure.com",
    "AZURE_OPENAI_API_VERSION": "2024-02-01",
    "AZURE_OPENAI_DEPLOYMENT_NAME": "gpt-4-test",
    "AZURE_CHAT_DEPLOYMENT_NAME": "gpt-4-chat-test",
    "AZURE_OPENAI_EMBED_MODEL": "text-embedding-ada-002",
}

for _k, _v in _TEST_ENV_VARS.items():
    os.environ.setdefault(_k, _v)
