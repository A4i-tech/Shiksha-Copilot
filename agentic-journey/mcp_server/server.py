"""A small MCP server standing in for a platform capability the agent must call out to.

Domain is deliberately concrete — a school timetable service — so a task can chain
"fetch real data -> write code -> run it -> produce an artifact".

Run: python -m mcp_server.server   (serves streamable HTTP on :9100/mcp)
"""
import os

from fastmcp import FastMCP

mcp = FastMCP("shiksha-timetable")

# ponytail: fixtures, not a database. The point is the call crossing a server boundary.
_ROSTER = {
    ("7", "A"): [
        {"name": "Aarav", "attendance": 0.92, "score": 78},
        {"name": "Diya", "attendance": 0.98, "score": 91},
        {"name": "Ishaan", "attendance": 0.71, "score": 55},
        {"name": "Meera", "attendance": 0.85, "score": 83},
        {"name": "Rohan", "attendance": 0.64, "score": 48},
        {"name": "Sara", "attendance": 0.95, "score": 88},
    ],
    ("7", "B"): [
        {"name": "Kabir", "attendance": 0.88, "score": 72},
        {"name": "Nisha", "attendance": 0.59, "score": 41},
        {"name": "Vivaan", "attendance": 0.97, "score": 95},
        {"name": "Zoya", "attendance": 0.79, "score": 67},
    ],
}

_TOPICS = {
    ("7", "science"): [
        "Nutrition in plants", "Heat", "Acids, bases and salts",
        "Physical and chemical changes", "Respiration in organisms",
    ],
    ("7", "maths"): [
        "Integers", "Fractions and decimals", "Data handling",
        "Simple equations", "Lines and angles",
    ],
    ("8", "science"): ["Crop production", "Microorganisms", "Force and pressure", "Sound"],
}


@mcp.tool
def class_roster(grade: str, section: str) -> list[dict]:
    """Students in one class, with attendance (0-1) and their last test score."""
    key = (str(grade), section.upper())
    if key not in _ROSTER:
        raise ValueError(
            f"No roster for grade {grade} section {section}. "
            f"Available: {sorted(f'{g}-{s}' for g, s in _ROSTER)}"
        )
    return _ROSTER[key]


@mcp.tool
def curriculum_topics(grade: str, subject: str) -> list[str]:
    """The syllabus topics for a grade and subject."""
    key = (str(grade), subject.lower())
    if key not in _TOPICS:
        raise ValueError(
            f"No syllabus for grade {grade} {subject}. "
            f"Available: {sorted(f'{g} {s}' for g, s in _TOPICS)}"
        )
    return _TOPICS[key]


@mcp.tool
def term_dates(term: str) -> dict:
    """Start date, end date and teaching weeks for a term."""
    table = {
        "T1": {"start": "2026-06-01", "end": "2026-09-15", "weeks": 15},
        "T2": {"start": "2026-10-01", "end": "2026-12-20", "weeks": 12},
        "T3": {"start": "2027-01-05", "end": "2027-04-10", "weeks": 14},
    }
    key = term.upper()
    if key not in table:
        raise ValueError(f"Unknown term {term!r}. Known terms: {', '.join(table)}.")
    return table[key]


if __name__ == "__main__":
    mcp.run(
        transport="http",
        host="0.0.0.0",
        port=int(os.getenv("MCP_PORT", "9100")),
        path="/mcp",
    )
