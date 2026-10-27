from pydantic import BaseModel


class JobMessage(BaseModel):
    type: str
    job_id: str
    attempt: int = 0
    trace_id: str | None = None
