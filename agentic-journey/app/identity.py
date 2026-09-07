"""Identity resolution. The server derives scope here; a caller never supplies it.

The scope chain is tenant / region / school / actor. Four levels, narrowest last, so a fact
can be personal, or shared with a school, a region, or a whole tenant — and retrieval walks
up the chain the actor actually belongs to, never sideways.
"""
from dataclasses import dataclass

from fastapi import Header, HTTPException

LEVELS = ("tenant", "region", "school", "actor")


@dataclass(frozen=True)
class Identity:
    actor_id: str
    scope_path: list[str]  # root -> leaf, e.g. ["a4i", "south", "school-12", "t-priya"]

    def scope_at(self, level: str) -> list[str]:
        """The prefix of this actor's own chain at the named level. Cannot name anyone else's."""
        if level not in LEVELS:
            raise ValueError(f"Unknown scope level {level!r}. Known levels: {', '.join(LEVELS)}.")
        return self.scope_path[: LEVELS.index(level) + 1]


# ponytail: a dict stands in for the identity provider. Swap for Entra ID / JWT verify.
_TOKENS = {
    # two teachers in the SAME school: what one shares, the other inherits
    "priya": Identity("t-priya", ["a4i", "south", "school-12", "t-priya"]),
    "arjun": Identity("t-arjun", ["a4i", "south", "school-12", "t-arjun"]),
    # same region, different school: sees region and tenant facts, not school-12's
    "fatima": Identity("t-fatima", ["a4i", "south", "school-07", "t-fatima"]),
    # same tenant, different region: sees tenant facts only
    "neha": Identity("t-neha", ["a4i", "north", "school-21", "t-neha"]),
    # different tenant: shares nothing with any of the above
    "omar": Identity("t-omar", ["nova", "west", "school-31", "t-omar"]),
    # fixtures used by the test suite
    "demo": Identity("actor-demo", ["a4i", "south", "school-12", "actor-demo"]),
    "other": Identity("actor-other", ["a4i", "north", "school-04", "actor-other"]),
    "system": Identity("actor-system", ["a4i"]),
}


def resolve(token: str) -> Identity:
    ident = _TOKENS.get(token)
    if ident is None:
        raise HTTPException(
            401,
            "Unknown bearer token. Send 'Authorization: Bearer demo' to use the demo actor, "
            f"or one of: {', '.join(sorted(_TOKENS))}. Add your own in app/identity.py:_TOKENS.",
        )
    return ident


async def current_identity(authorization: str = Header(default="")) -> Identity:
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(
            401,
            "Missing Authorization header. Send 'Authorization: Bearer demo' to use the demo actor.",
        )
    return resolve(token)
