import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "journey")

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
BUCKET = os.getenv("MINIO_BUCKET", "workspaces")

OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "unset")
# Azure OpenAI is not plain OpenAI-compatible: it needs a deployment URL and an api-version.
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-10-21")
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4o-mini")
CHEAP_MODEL_NAME = os.getenv("CHEAP_MODEL_NAME", MODEL_NAME)
VERIFIER_MODEL_NAME = os.getenv("VERIFIER_MODEL_NAME", CHEAP_MODEL_NAME)
VERIFIER_ENABLED = os.getenv("VERIFIER_ENABLED", "1") == "1"
# offered in the console's model picker; the endpoint and key never change with the choice
MODEL_CHOICES = [m.strip() for m in os.getenv(
    "MODEL_CHOICES", f"{MODEL_NAME},gpt-4.1,gpt-5-nano,gpt-4o-mini").split(",")]

SANDBOX_IMAGE = os.getenv("SANDBOX_IMAGE", "python:3.12-slim")
SANDBOX_MEM_LIMIT = os.getenv("SANDBOX_MEM_LIMIT", "512m")
# "" = the host default runtime (shared kernel). "runsc" (gVisor) or "kata" give a
# kernel boundary per sandbox, which is what model-authored code actually needs.
SANDBOX_RUNTIME = os.getenv("SANDBOX_RUNTIME", "")
SANDBOX_POOL_SIZE = int(os.getenv("SANDBOX_POOL_SIZE", "2"))
SANDBOX_POOL_COUNT = max(1, int(os.getenv("SANDBOX_POOL_COUNT", "1")))
SANDBOX_POOL_MAX = int(os.getenv("SANDBOX_POOL_MAX", "8"))
SANDBOX_MAX_CONCURRENT = int(os.getenv("SANDBOX_MAX_CONCURRENT", "20"))
SANDBOX_AUTOSIZE = os.getenv("SANDBOX_AUTOSIZE", "0") == "1"
# Pools come and go with demand. Utilisation is bound sessions over the ceiling of the pools
# still accepting placement.
SANDBOX_AUTOSCALE = os.getenv("SANDBOX_AUTOSCALE", "0") == "1"
SANDBOX_MAX_POOLS = int(os.getenv("SANDBOX_MAX_POOLS", "4"))
SANDBOX_SCALE_OUT_AT = float(os.getenv("SANDBOX_SCALE_OUT_AT", "0.75"))
SANDBOX_SCALE_IN_AT = float(os.getenv("SANDBOX_SCALE_IN_AT", "0.25"))
SANDBOX_ASSUMED_START_SECONDS = float(os.getenv("SANDBOX_ASSUMED_START_SECONDS", "1.0"))
SANDBOX_COOLDOWN_SECONDS = int(os.getenv("SANDBOX_COOLDOWN_SECONDS", "300"))
SANDBOX_MAX_LIFETIME_SECONDS = int(os.getenv("SANDBOX_MAX_LIFETIME_SECONDS", "3600"))
# setup phase: runs once at container start WITH network, then egress is revoked for life
SANDBOX_SETUP_CMD = os.getenv("SANDBOX_SETUP_CMD", "")
SANDBOX_SETUP_NETWORK = os.getenv("SANDBOX_SETUP_NETWORK", "bridge")

EPISODE_TTL_SECONDS = int(os.getenv("EPISODE_TTL_SECONDS", "86400"))
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "20"))
MCP_URL = os.getenv("MCP_URL", "")
# Step budget for one turn. A chat reply needs a handful; a multi-step brief needs tens.
JOURNEY_REQUEST_LIMIT = int(os.getenv("JOURNEY_REQUEST_LIMIT", "30"))
JOURNEY_TOOL_CALLS_LIMIT = int(os.getenv("JOURNEY_TOOL_CALLS_LIMIT", "60"))
MODEL_TIMEOUT_SECONDS = float(os.getenv("MODEL_TIMEOUT_SECONDS", "60"))
# demo switch: drive the whole loop with pydantic-ai's TestModel, no API key, no cost
FAKE_MODEL = os.getenv("FAKE_MODEL", "0") == "1"
FAKE_MODEL_TOOLS = [t for t in os.getenv("FAKE_MODEL_TOOLS", "recall,run_python").split(",") if t]
