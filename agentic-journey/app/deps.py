from dataclasses import dataclass

from .identity import Identity


@dataclass
class Deps:
    identity: Identity
    session_id: str
    run_id: str = ""
    verifier_failed: str = ""
    first_answer: str | None = None
    unverified_reason: str = ""
