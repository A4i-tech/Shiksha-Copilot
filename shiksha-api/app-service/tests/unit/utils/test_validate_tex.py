from app.utils.utils import validate_tex


def test_balanced_inline_and_display():
    assert validate_tex(r"Area is \(A = \pi r^2\) and \[x = 1\].") is None
    assert validate_tex(r"The formula \( a_{n} = a + (n-1)d \)") is None
    assert validate_tex(r"The general term is \( a_{n} = 11 + (n - 1) \times 2 \). The first term is _____ .") is None

def test_no_math_is_balanced():
    assert validate_tex("No math here at all.") is None

def test_unbalanced_inline_errors():
    assert validate_tex(r"Area is \(A = \pi r^2 square units.") is not None

def test_unbalanced_display_errors():
    assert validate_tex(r"\[x = \frac{1}{2}") is not None

def test_mismatched_delimiters_errors():
    assert validate_tex(r"\(x = 1\]") is not None

def test_nested_delimiters_errors():
    assert validate_tex(r"\(\(x = 1\)\)") is not None

def test_closer_before_opener_errors():
    assert validate_tex(r"\)x = 1\(") is not None

def test_blank_placeholder_inside_math_span_errors():
    assert validate_tex(
        r"The number \(\alpha\ is a solution of the quadratic equation "
        r"\(x^2 + 5x + 6 = 0\) if \(x = __\)"
    ) is not None

def test_blank_placeholder_outside_math_span_is_fine():
    assert validate_tex(r"Fill in the blank: \(x^2 + 5x + 6 = 0\) if x = __") is None
