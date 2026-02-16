from typing import List
from pathlib import Path
import logging
import traceback

from openai import AsyncAzureOpenAI
import json
import asyncio
from openai.types.responses import ResponseOutputMessage, ResponseOutputText
from openai.types.responses.response import Response
from openai.types.responses.response_output_text import AnnotationURLCitation

from app.models.chat import ConversationMessage
from app.config import settings
from app.utils.prompt_template import PromptTemplate

logger = logging.getLogger(__name__)


class GeneralChatService:
    """Service for handling chat interactions using Azure OpenAI client."""

    def __init__(self):
        # Initialize prompt template with the chat prompts file
        prompts_file_path = (
            Path(__file__).parent.parent.parent / "prompts" / "chat_prompts.yaml"
        )
        self.prompt_template = PromptTemplate(str(prompts_file_path))

        # Initialize Azure OpenAI client
        if not settings.azure_openai_api_key:
            raise ValueError("AZURE_OPENAI_API_KEY environment variable is required")
        if not settings.azure_openai_endpoint:
            raise ValueError("AZURE_OPENAI_ENDPOINT environment variable is required")
        if not settings.azure_openai_api_version:
            raise ValueError("AZURE_OPENAI_API_VERSION environment variable is required")
        if not settings.azure_openai_deployment_name:
            raise ValueError("AZURE_OPENAI_DEPLOYMENT_NAME environment variable is required")
        if not settings.azure_chat_deployment_name:
            raise ValueError("AZURE_CHAT_DEPLOYMENT_NAME environment variable is required")

        self.client = AsyncAzureOpenAI(
                api_key=settings.azure_openai_api_key,
                api_version=settings.azure_openai_api_version,
                azure_endpoint=settings.azure_openai_endpoint,
            )


    async def __call__(
        self,
        messages: List[ConversationMessage],
    ) -> dict:
        """
        Core chat logic using Azure AI Project client with agents.

        Args:
            messages: List of conversation messages

        Returns:
            dict with 'response' (str) and 'references' (list of dicts with title/url)
        """
        try:
            # Load system prompt
            system_prompt = self.prompt_template.get_prompt("general_chat")
            if not system_prompt:
                raise ValueError("General chat prompt not found in chat_prompts.yaml")

            yield json.dumps({"type": "status", "message": "Thinking..."}) + "\n"

            # Prepare messages with robust formatting
            try:
                formatted_messages = [{"role": "system", "content": system_prompt}]
                for m in messages:
                    if isinstance(m, dict):
                        role = m.get("role", "user")
                        content = m.get("message", "")
                    else:
                        role = getattr(m.role, "value", m.role) if hasattr(m, "role") else "user"
                        content = getattr(m, "message", "") if hasattr(m, "message") else ""
                    
                    formatted_messages.append({"role": role, "content": content})
            except Exception as e:
                raise Exception(f"Error formatting messages: {e}")

            response = self.client.chat.completions.create(
                model=settings.azure_chat_deployment_name,
                messages=formatted_messages,
                stream=True
            )
            
            if asyncio.iscoroutine(response):
                stream = await response
            else:
                stream = response
            
            full_response = ""
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield json.dumps({"type": "content", "delta": content}) + "\n"
        except Exception as e:
            logger.error(f"Error in Azure OpenAI chat: {e}", exc_info=True)
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"

    def _extract_url_citations(self, response: Response) -> list:
        """
        Extract URL citations from Azure OpenAI Responses API output annotations.

        The Responses API returns output items that may contain 'url_citation'
        annotations within message content blocks.

        Returns:
            List of dicts with 'title' and 'url' keys
        """
        references = []
        seen_urls = set()

        if not response.output:
            return references

        for item in response.output:
            if not isinstance(item, ResponseOutputMessage):
                continue
            
            for content_block in item.content:
                if not isinstance(content_block, ResponseOutputText):
                    continue
                
                # Check for annotations
                if not content_block.annotations:
                    continue

                for annotation in content_block.annotations:
                    if isinstance(annotation, AnnotationURLCitation):
                        url = annotation.url
                        title = annotation.title or url
                        if url and url not in seen_urls:
                            seen_urls.add(url)
                            references.append({"title": title, "url": url})

        return references

    async def _create_agent(self, assistant_system_prompt: str):
        """Create an Azure AI agent with the specified system prompt."""
        try:
            if not settings.azure_openai_deployment_name:
                raise ValueError(
                    "AZURE_OPENAI_DEPLOYMENT_NAME environment variable is required"
                )

            agent = await self.project_client.agents.create_agent(
                model=settings.azure_openai_deployment_name,
                name="shiksha-copilot-general-chat-agent",
                instructions=assistant_system_prompt,
                tools=self.tools,
            )
            self.agent_id = agent.id
            logger.info(f"Created agent, ID: {agent.id}")

        except Exception as e:
            logger.error(f"Error creating agent: {e}")
            traceback.print_exc()
            raise

    def _format_conversation_messages(self, messages: List[ConversationMessage]) -> str:
        """Format conversation messages into a single string for the agent."""
        if len(messages) > 1:
            # Include all previous messages as context
            chat_context = "\n".join(
                [
                    f"Role: {msg.role.value}\nMessage: {msg.message}"
                    for msg in messages[:-1]
                ]
            )
            current_message = messages[-1].message
            return (
                f"Chat History:\n{chat_context}\n\nCurrent Message: {current_message}"
            )
        else:
            # Single message, no context needed
            return messages[0].message

    async def cleanup(self):
        """
        Cleanup method to properly close the project client connection.
        Should be called when the service is being shut down.
        """
        try:
            if hasattr(self.client, "close"):
                await self.client.close()
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")


# Global instance
GENERAL_CHAT_SERVICE_INSTANCE = GeneralChatService()
