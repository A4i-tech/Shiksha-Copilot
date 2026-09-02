import hashlib
import re

from pydantic import JsonValue


def local_unique_id(counter: int) -> str:
    # key really does not matter here, wee aren't aiming for crypto-secure but rather 'random-enough'. determinism
    # does not matter either - we just need to generate a sufficiently non-sequential stream of values. for instance,
    # a stream such as ['xxea', 'xxeb', 'xxec'] is sequential (bad) - one char off and the llm has 'guessed' some
    # other mapping. the solution below works well for up to 65,536 generations, far more than the amount an agent
    # would ever request during its runtime.
    return hashlib.blake2s(counter.to_bytes(2, "big"), key=b"shiksha-copilot", digest_size=4).hexdigest()


def get_json_value_type(data: JsonValue) -> type[JsonValue]:
    if isinstance(data, list): return list[JsonValue]
    if isinstance(data, dict): return dict[str, JsonValue]
    if data is None: return type(None)  # maps to Optional field - pydantic handles NoneType correctly via `| None`
    return type(data)


_TEX_DELIMITER_PATTERN = re.compile(r"\\\(|\\\)|\\\[|\\\]")
_TEX_DELIMITER_OPENERS = {"\\(": "\\)", "\\[": "\\]"}
# a leaked "__" fill-in-the-blank marker is not valid standalone LaTeX and
# makes KaTeX fail to render the whole span. a single "_" is a legitimate
# subscript (e.g. "H_2") and must not be flagged.
_TEX_LEAKED_BLANK = re.compile(r"(?<!\\)__")


def validate_tex(text: str) -> None:
    """Raise ValueError if TeX inline/display delimiters in `text` are
    unbalanced, out of order, mismatched, or nested, or if a math span
    contains a leaked "__" fill-in-the-blank placeholder that KaTeX
    cannot render.

    Best-effort signal for observability, not a full TeX parser.
    """
    expected_close = None
    span_start = None
    for match in _TEX_DELIMITER_PATTERN.finditer(text):
        token = match.group()
        if expected_close is None:
            if token not in _TEX_DELIMITER_OPENERS:
                raise ValueError(f"TeX closer {token!r} has no matching opener in: {text[:200]!r}")
            expected_close = _TEX_DELIMITER_OPENERS[token]
            span_start = match.end()
        else:
            if token in _TEX_DELIMITER_OPENERS:
                raise ValueError(f"Nested TeX opener {token!r} before previous delimiter closed in: {text[:200]!r}")
            if token != expected_close:
                raise ValueError(f"Mismatched TeX closer {token!r}, expected {expected_close!r} in: {text[:200]!r}")
            span = text[span_start:match.start()]
            if _TEX_LEAKED_BLANK.search(span):
                raise ValueError(f"Leaked '__' blank placeholder inside TeX span {span!r} in: {text[:200]!r}")
            expected_close = None
    if expected_close is not None:
        raise ValueError(f"Unclosed TeX delimiter {expected_close!r} in: {text[:200]!r}")