"""
Unit tests for PromptTemplate (prompt_template.py).

Tests cover:
- YAML file loading
- Prompt retrieval
- Variable substitution
- Error handling
"""

import pytest
import tempfile
import os
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "app"))

from app.utils.prompt_template import PromptTemplate


class TestPromptTemplateLoading:
    """Test PromptTemplate YAML file loading."""

    def test_load_valid_yaml_file(self):
        """Test loading valid YAML file."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            f.write("""
general_chat: "You are a helpful educational assistant."
lesson_chat: "You are teaching {SUBJECT} for {GRADE}."
            """)
            f.flush()
            temp_file = f.name

        try:
            template = PromptTemplate(temp_file)
            assert template.get_prompt("general_chat") == "You are a helpful educational assistant."
        finally:
            os.unlink(temp_file)

    def test_load_nonexistent_file_raises_error(self):
        """Test loading nonexistent file raises error."""
        with pytest.raises(FileNotFoundError):
            PromptTemplate("/nonexistent/path/prompts.yaml")

    def test_load_invalid_yaml_raises_error(self):
        """Test loading invalid YAML raises error."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            f.write("invalid: yaml: content:")
            f.flush()
            temp_file = f.name

        try:
            with pytest.raises(Exception):
                PromptTemplate(temp_file)
        finally:
            os.unlink(temp_file)


class TestPromptTemplateRetrieval:
    """Test prompt retrieval methods."""

    @pytest.fixture
    def template_file(self):
        """Create a temporary template file."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            f.write("""
general_chat: "You are a helpful assistant."
lesson_chat: "Teaching {SUBJECT} to {GRADE} students."
question_gen: "Generate {NUM} questions on {TOPIC}."
            """)
            f.flush()
            temp_file = f.name

        yield temp_file
        os.unlink(temp_file)

    def test_get_prompt_returns_correct_value(self, template_file):
        """Test get_prompt returns correct prompt."""
        template = PromptTemplate(template_file)

        assert template.get_prompt("general_chat") == "You are a helpful assistant."
        assert template.get_prompt("lesson_chat") == "Teaching {SUBJECT} to {GRADE} students."

    def test_get_prompt_returns_none_for_missing_key(self, template_file):
        """Test get_prompt returns None for missing key."""
        template = PromptTemplate(template_file)

        assert template.get_prompt("nonexistent_key") is None

    def test_get_prompt_with_variables_substitutes_correctly(self, template_file):
        """Test get_prompt_with_variables substitutes variables."""
        template = PromptTemplate(template_file)

        result = template.get_prompt_with_variables(
            "lesson_chat",
            SUBJECT="Science",
            GRADE="10"
        )

        assert result == "Teaching Science to 10 students."

    def test_get_prompt_with_variables_multiple_substitutions(self, template_file):
        """Test multiple variable substitutions."""
        template = PromptTemplate(template_file)

        result = template.get_prompt_with_variables(
            "question_gen",
            NUM="5",
            TOPIC="Photosynthesis"
        )

        assert result == "Generate 5 questions on Photosynthesis."

    def test_get_prompt_with_variables_missing_variable_raises_error(self, template_file):
        """Test missing variables raise KeyError."""
        template = PromptTemplate(template_file)

        # PromptTemplate raises KeyError for missing variables
        with pytest.raises(KeyError):
            result = template.get_prompt_with_variables(
                "lesson_chat",
                SUBJECT="Science"
                # GRADE is missing - should raise KeyError
            )

    def test_get_prompt_with_variables_returns_none_for_missing_prompt(self, template_file):
        """Test get_prompt_with_variables returns None for missing prompt."""
        template = PromptTemplate(template_file)

        result = template.get_prompt_with_variables(
            "nonexistent_prompt",
            VAR="value"
        )

        assert result is None


class TestPromptTemplateEdgeCases:
    """Test edge cases for PromptTemplate."""

    def test_empty_yaml_file(self):
        """Test handling empty YAML file."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            f.write("")
            f.flush()
            temp_file = f.name

        try:
            template = PromptTemplate(temp_file)
            assert template.get_prompt("any_key") is None
        finally:
            os.unlink(temp_file)

    def test_nested_yaml_structure(self):
        """Test handling nested YAML structure."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            f.write("""
prompts:
  general: "General prompt"
  lesson:
    basic: "Basic lesson prompt"
    advanced: "Advanced lesson prompt"
            """)
            f.flush()
            temp_file = f.name

        try:
            template = PromptTemplate(temp_file)
            # Should handle nested structure
            assert template.get_prompt("prompts") is not None
        finally:
            os.unlink(temp_file)

    def test_special_characters_in_prompt(self):
        """Test prompts with special characters."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            f.write("""
special_prompt: "Use quotes: \\"test\\", newlines:\\nand tabs:\\t"
            """)
            f.flush()
            temp_file = f.name

        try:
            template = PromptTemplate(temp_file)
            prompt = template.get_prompt("special_prompt")
            assert prompt is not None
            assert '\\"' in prompt or '"' in prompt
        finally:
            os.unlink(temp_file)
