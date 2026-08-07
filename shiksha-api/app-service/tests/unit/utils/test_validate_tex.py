import pytest

from app.utils.utils import validate_tex


class TestValidateTex:
    """Tests for validate_tex."""

    def test_balanced_inline_and_display(self):
        validate_tex(r"Area is \(A = \pi r^2\) and \[x = 1\].")

    def test_no_math_is_balanced(self):
        validate_tex("No math here at all.")

    def test_unbalanced_inline_raises(self):
        with pytest.raises(ValueError):
            validate_tex(r"Area is \(A = \pi r^2 square units.")

    def test_unbalanced_display_raises(self):
        with pytest.raises(ValueError):
            validate_tex(r"\[x = \frac{1}{2}")

    def test_mismatched_delimiters_raises(self):
        with pytest.raises(ValueError):
            validate_tex(r"\(x = 1\]")

    def test_nested_delimiters_raises(self):
        with pytest.raises(ValueError):
            validate_tex(r"\(\(x = 1\)\)")

    def test_closer_before_opener_raises(self):
        with pytest.raises(ValueError):
            validate_tex(r"\)x = 1\(")
