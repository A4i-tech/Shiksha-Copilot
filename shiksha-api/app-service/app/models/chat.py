from pydantic import BaseModel, Field, StringConstraints
from typing import Annotated, List, Optional, Dict, Any
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ConversationMessage(BaseModel):
    role: MessageRole = Field(..., description="Role of the message sender")
    message: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)] = Field(..., description="Content of the message")


################# Request and Response Models #################


class ChatRequest(BaseModel):
    user_id: str = Field(..., description="User identifier")
    messages: List[ConversationMessage] = Field(..., min_length=1, description="List of conversation messages")


class Reference(BaseModel):
    title: str = Field(..., description="Title or label for the reference")
    url: Optional[str] = Field(None, description="URL of the reference source (for web citations)")
    text: Optional[str] = Field(None, description="Snippet of source text (for RAG references)")


class ChatResponse(BaseModel):
    user_id: str = Field(..., description="User identifier")
    response: str = Field(..., description="AI-generated response")
    references: Optional[List[Reference]] = Field(default_factory=list, description="List of references/citations used in the response")


class LessonChatRequest(BaseModel):
    user_id: str = Field(..., description="User identifier")
    chapter_id: str = Field(..., description="Chapter identifier with board, medium, grade, subject, number and title")
    index_path: str = Field(..., description="Path to the chapter index for retrieval")
    messages: List[ConversationMessage] = Field(..., min_length=1, description="List of conversation messages")


class LessonChatResponse(BaseModel):
    user_id: str = Field(..., description="User identifier")
    response: str = Field(..., description="AI-generated response")
    references: List[Reference] = Field(default_factory=list, description="List of references/citations used in the response")
