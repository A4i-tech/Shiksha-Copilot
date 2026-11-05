import uuid

from pydantic import BaseModel


class JobMessage(BaseModel):
    type: str
    job_id: uuid.UUID
    attempt: int = 0
