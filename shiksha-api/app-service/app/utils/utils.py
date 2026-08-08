import hashlib
from pathlib import Path

from pydantic import JsonValue, TypeAdapter
import yaml


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


def load_yaml_kv(path: Path) -> dict[str, str]:
    with path.open("r", encoding="utf-8") as file:
        data = yaml.safe_load(file)
    return TypeAdapter(dict[str, str]).validate_python(data)


def load_yaml_prompts(path: str | Path) -> dict[str, str]:
    return load_yaml_kv(Path(__file__).parent.parent.parent / "prompts" / path)