# Shiksha API Test Suite

Comprehensive unit and integration tests for the Shiksha API (FastAPI app-service).

## Architecture-Based Testing

This test suite is designed based on the comprehensive architecture analysis of the Shiksha API. It covers all major layers:

1. **Service Layer** - Business logic and orchestration
2. **Data Access Layer** - RAG adapters and external service integrations
3. **API Layer** - FastAPI routers and endpoints
4. **Models Layer** - Pydantic data models
5. **Utilities Layer** - Helper functions and utilities

## Test Organization

```
tests/
├── conftest.py                      # Shared fixtures and configuration
├── __init__.py
├── unit/                            # Unit tests
│   ├── services/
│   │   ├── test_rag_adapters.py     # RAG adapter factory & implementations
│   │   ├── test_general_chat_service.py
│   │   ├── test_lesson_chat_service.py
│   │   └── test_question_paper_service.py
│   ├── routers/
│   │   ├── test_chat_router.py
│   │   └── test_question_paper_router.py
│   ├── models/
│   │   ├── test_chat_models.py
│   │   └── test_question_paper_models.py
│   └── utils/
│       ├── test_blob_store.py
│       └── test_prompt_template.py
└── integration/                     # Integration tests
    ├── test_chat_endpoints.py       # End-to-end API tests
    └── test_question_paper_endpoints.py
```

## Running Tests

### Install Dependencies

```bash
cd shiksha-api/app-service
poetry install --with dev
```

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=app --cov-report=html --cov-report=term
```

### Run Specific Test Categories

**Unit tests only:**
```bash
pytest tests/unit/ -v
```

**Integration tests only:**
```bash
pytest tests/integration/ -v
```

**Tests by marker:**
```bash
# Run only fast unit tests
pytest -m unit

# Run integration tests
pytest -m integration

# Skip slow tests
pytest -m "not slow"

# Run tests requiring Azure services
pytest -m requires_azure

# Run tests requiring Qdrant
pytest -m requires_qdrant
```

### Run Specific Test Files

```bash
# Test RAG adapters
pytest tests/unit/services/test_rag_adapters.py -v

# Test general chat service
pytest tests/unit/services/test_general_chat_service.py -v

# Test lesson chat service
pytest tests/unit/services/test_lesson_chat_service.py -v

# Test chat models
pytest tests/unit/models/test_chat_models.py -v

# Test integration endpoints
pytest tests/integration/test_chat_endpoints.py -v
```

### Run Specific Test Classes or Methods

```bash
# Run specific test class
pytest tests/unit/services/test_rag_adapters.py::TestInMemRagOpsAdapter -v

# Run specific test method
pytest tests/unit/services/test_rag_adapters.py::TestInMemRagOpsAdapter::test_initialization -v
```

## Test Coverage

The test suite aims for >80% code coverage across all modules.

**View coverage report:**
```bash
# Generate HTML coverage report
pytest --cov=app --cov-report=html

# Open in browser (Windows)
start htmlcov/index.html

# Open in browser (Linux/Mac)
open htmlcov/index.html
```

**Check coverage for specific modules:**
```bash
pytest --cov=app.services --cov-report=term-missing
pytest --cov=app.routers --cov-report=term-missing
pytest --cov=app.models --cov-report=term-missing
```

## Test Markers

Tests are organized using pytest markers:

- `@pytest.mark.unit` - Unit tests for individual components
- `@pytest.mark.integration` - Integration tests for end-to-end flows
- `@pytest.mark.slow` - Slow-running tests
- `@pytest.mark.requires_azure` - Tests requiring Azure services
- `@pytest.mark.requires_qdrant` - Tests requiring Qdrant database

## Fixtures

Shared fixtures are defined in `conftest.py`:

### Configuration Fixtures
- `mock_settings` - Mock application settings
- `mock_completion_llm` - Mock LLM for completions
- `mock_embedding_llm` - Mock LLM for embeddings
- `mock_azure_openai_client` - Mock Azure OpenAI client

### Data Fixtures
- `sample_chat_messages` - Sample conversation messages
- `sample_chapter_id` - Sample chapter ID string
- `sample_lesson_chat_request` - Sample lesson chat request
- `sample_question_bank_request` - Sample question generation request

### Service Fixtures
- `mock_rag_ops` - Mock RAG operations
- `mock_rag_adapter` - Mock RAG adapter
- `mock_rag_adapter_cache` - Mock RAG adapter cache
- `mock_blob_store` - Mock Azure Blob Storage
- `mock_prompt_template` - Mock prompt template

## Writing New Tests

### Unit Test Template

```python
"""
Unit tests for [ComponentName].

Tests cover:
- Functionality 1
- Functionality 2
- Error handling
"""

import pytest
from unittest.mock import Mock, AsyncMock, patch
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "app"))

from app.module import ComponentToTest


class TestComponentInitialization:
    """Test initialization."""

    def test_valid_initialization(self):
        """Test valid initialization."""
        component = ComponentToTest()
        assert component is not None


class TestComponentMethods:
    """Test component methods."""

    @pytest.mark.asyncio
    async def test_async_method(self):
        """Test async method."""
        component = ComponentToTest()
        result = await component.async_method()
        assert result is not None


class TestComponentErrorHandling:
    """Test error handling."""

    def test_handles_invalid_input(self):
        """Test handles invalid input."""
        component = ComponentToTest()
        with pytest.raises(ValueError):
            component.method_with_validation(invalid_input)
```

### Integration Test Template

```python
"""
Integration tests for [EndpointName].

Tests verify end-to-end functionality.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

@pytest.mark.integration
class TestEndpoint:
    """Integration tests for endpoint."""

    def test_valid_request(self, test_client):
        """Test endpoint with valid request."""
        response = test_client.post("/endpoint", json={...})
        assert response.status_code == 200

    def test_invalid_request(self, test_client):
        """Test endpoint rejects invalid request."""
        response = test_client.post("/endpoint", json={...})
        assert response.status_code == 422
```

## Mocking Best Practices

### 1. Mock External Services

Always mock external service calls (Azure OpenAI, Qdrant, Blob Storage):

```python
with patch("app.services.service.AzureOpenAI") as MockAzureOpenAI:
    mock_client = Mock()
    MockAzureOpenAI.return_value = mock_client
    # ... test code
```

### 2. Use AsyncMock for Async Methods

```python
mock_service = AsyncMock()
mock_service.async_method = AsyncMock(return_value="result")
```

### 3. Verify Method Calls

```python
mock_service.method.assert_called_once()
mock_service.method.assert_called_with(expected_arg)
```

### 4. Mock Settings

```python
mock_settings = Mock()
mock_settings.azure_openai_api_key = "test-key"

with patch("app.module.settings", mock_settings):
    # ... test code
```

## Continuous Integration

### GitHub Actions

Add to `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'

    - name: Install Poetry
      run: |
        curl -sSL https://install.python-poetry.org | python3 -

    - name: Install dependencies
      run: |
        cd shiksha-api/app-service
        poetry install --with dev

    - name: Run tests
      run: |
        cd shiksha-api/app-service
        poetry run pytest --cov=app --cov-report=xml

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./shiksha-api/app-service/coverage.xml
```

## Test Environment Variables

For tests requiring real Azure services, set environment variables:

```bash
export AZURE_OPENAI_API_KEY="your-key"
export AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com"
export AZURE_OPENAI_API_VERSION="2024-02-15-preview"
export AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4"
export AZURE_OPENAI_EMBED_MODEL="text-embedding-ada-002"
export QDRANT_URL="http://localhost:6333"
export QDRANT_API_KEY="your-qdrant-key"
export BLOB_STORE_CONNECTION_STRING="your-connection-string"
```

Or use a `.env.test` file:

```bash
# Copy environment template
cp .env.example .env.test

# Edit with test values
nano .env.test

# Run tests with test environment
pytest --envfile=.env.test
```

## Troubleshooting

### Import Errors

If you encounter import errors, ensure the app directory is in Python path:

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "app"))
```

### Async Test Failures

Ensure `pytest-asyncio` is installed and use `@pytest.mark.asyncio`:

```bash
poetry add pytest-asyncio --group dev
```

```python
@pytest.mark.asyncio
async def test_async_function():
    result = await async_function()
    assert result is not None
```

### Mock Not Working

Ensure the mock path matches the import path in the module under test:

```python
# If module does: from app.config import settings
# Then mock should be:
with patch("app.module_being_tested.settings", mock_settings):
```

### Coverage Not Showing

Ensure pytest.ini is configured correctly and run from project root:

```bash
cd shiksha-api/app-service
pytest --cov=app
```

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure >80% coverage for new code
3. Run full test suite before committing
4. Add integration tests for new endpoints
5. Update this README if adding new test categories

## Test Metrics

Track these metrics:

- **Coverage**: >80% for all modules
- **Test Count**: Comprehensive tests for all public methods
- **Performance**: Unit tests < 100ms, Integration tests < 5s
- **Reliability**: All tests should pass consistently

## Resources

- [pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [pytest-asyncio](https://pytest-asyncio.readthedocs.io/)
- [unittest.mock](https://docs.python.org/3/library/unittest.mock.html)
- [Architecture Analysis](../ARCHITECTURE_ANALYSIS.md)
