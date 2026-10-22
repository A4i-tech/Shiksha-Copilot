import pytest

from app.models.question_paper import Content


class TestContentTexValidation:
    """Tests for Content's TeX validation on construction."""

    def test_balanced_tex_constructs(self):
        Content.text(r"Area is \(A = \pi r^2\) and \[x = 1\].")

    def test_unbalanced_tex_raises(self):
        with pytest.raises(ValueError):
            Content.text(r"Area is \(A = \pi r^2 square units.")

    def test_non_utf8_content_skips_tex_check(self):
        """Non-decodable bytes are not text, so no TeX check applies and construction succeeds."""
        content = Content(content_type="text/plain", content=b"\x80\x81")
        assert content.content == b"\x80\x81"
