import os
import pytest
from unittest.mock import patch, MagicMock


class TestInitLangfuse:
    def test_returns_langfuse_instance_when_keys_set(self):
        with patch.dict(os.environ, {
            "LANGFUSE_SECRET_KEY": "sk-lf-test",
            "LANGFUSE_PUBLIC_KEY": "pk-lf-test",
            "APP_ENV": "test",
        }):
            with patch("langfuse.Langfuse") as mock_langfuse_class:
                mock_instance = MagicMock()
                mock_langfuse_class.return_value = mock_instance

                from app.observability.langfuse_setup import init_langfuse
                result = init_langfuse(app_env="test")

                call_kwargs = mock_langfuse_class.call_args[1]
                assert call_kwargs.get("secret_key") == "sk-lf-test"
                assert call_kwargs.get("public_key") == "pk-lf-test"
                assert call_kwargs.get("environment") == "test"
                assert result is mock_instance

    def test_returns_none_when_keys_absent(self):
        env = {k: v for k, v in os.environ.items()
               if k not in ("LANGFUSE_SECRET_KEY", "LANGFUSE_PUBLIC_KEY")}
        with patch.dict(os.environ, env, clear=True):
            from importlib import reload
            import app.observability.langfuse_setup as mod
            reload(mod)
            result = mod.init_langfuse(app_env="local")
            assert result is None

    def test_langfuse_host_passed_when_set(self):
        with patch.dict(os.environ, {
            "LANGFUSE_SECRET_KEY": "sk-lf-test",
            "LANGFUSE_PUBLIC_KEY": "pk-lf-test",
            "LANGFUSE_HOST": "https://my-langfuse.example.com",
            "APP_ENV": "staging",
        }):
            with patch("langfuse.Langfuse") as mock_langfuse_class:
                mock_langfuse_class.return_value = MagicMock()
                from importlib import reload
                import app.observability.langfuse_setup as mod
                reload(mod)
                mod.init_langfuse(app_env="staging")
                call_kwargs = mock_langfuse_class.call_args[1]
                assert call_kwargs.get("host") == "https://my-langfuse.example.com"
                assert call_kwargs.get("secret_key") == "sk-lf-test"
                assert call_kwargs.get("public_key") == "pk-lf-test"

    def test_returns_none_when_langfuse_init_raises(self):
        with patch.dict(os.environ, {
            "LANGFUSE_SECRET_KEY": "sk-lf-test",
            "LANGFUSE_PUBLIC_KEY": "pk-lf-test",
        }):
            with patch("langfuse.Langfuse") as mock_langfuse_class:
                mock_langfuse_class.side_effect = Exception("connection refused")
                from importlib import reload
                import app.observability.langfuse_setup as mod
                reload(mod)
                result = mod.init_langfuse(app_env="test")
                assert result is None
