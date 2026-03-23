from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


class TestRootEndpoints:
    """Tests for root and health endpoints."""

    def test_health_check_endpoint(self):
        """Test the health check endpoint."""
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "service" in data
        assert data["status"] == "healthy"


class TestMCPConfiguration:
    """Tests for MCP configuration."""

    def test_mcp_instance_created(self):
        """Test MCP instance is created."""
        from app.main import mcp

        # MCP should be initialized
        assert mcp is not None
        assert hasattr(mcp, "name")

    def test_mcp_app_created(self):
        """Test MCP HTTP app is created."""
        from app.main import mcp_app

        assert mcp_app is not None


class TestAppConfiguration:
    """Tests for FastAPI app configuration."""

    def test_app_has_cors_middleware(self):
        """Test that CORS middleware is configured."""
        from app.main import app

        # Check middleware is present
        assert len(app.user_middleware) > 0

    def test_app_includes_chat_router(self):
        """Test that chat router is included."""
        from app.main import app

        # Check routes are registered
        routes = [route.path for route in app.routes]
        assert any("/chat" in route for route in routes)

    def test_app_includes_question_paper_router(self):
        """Test that question paper router is included."""
        from app.main import app

        routes = [route.path for route in app.routes]
        assert any("/question-paper" in route for route in routes)

    def test_app_title_and_version(self):
        """Test app has correct title and version."""
        from app.main import app

        assert app.title is not None
        assert app.version is not None

    def test_app_has_mcp_state(self):
        """Test that app has MCP app in state."""
        from app.main import app

        assert hasattr(app.state, "MCP_APP")
        assert app.state.MCP_APP is not None
