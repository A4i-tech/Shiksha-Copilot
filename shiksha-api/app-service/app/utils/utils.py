import hashlib

from lark import Lark, UnexpectedInput
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


_TEX = Lark(r"""
    start: (inline | display | CHAR | ESCAPED | BLANK)*

    inline:  INLINE_OPEN math* INLINE_CLOSE
    display: DISPLAY_OPEN math* DISPLAY_CLOSE

    ?math: CHAR | ESCAPED

    INLINE_OPEN.3:  "\\("
    INLINE_CLOSE.3: "\\)"
    DISPLAY_OPEN.3: "\\["
    DISPLAY_CLOSE.3: "\\]"

    BLANK.2: /_{2,}/
    ESCAPED.1: "\\" /./s
    CHAR: /./s
""", parser="lalr", lexer="basic")

def validate_tex(text: str) -> str | None:
    try:
        _TEX.parse(text)
    except UnexpectedInput as e:
        return f"{e}\nContext:\n{e.get_context(text, span=80)}"
    return None