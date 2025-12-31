from typing import List
from pathlib import Path
import logging
import traceback

from openai import AzureOpenAI

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

        self.client = AzureOpenAI(
                api_key=settings.azure_openai_api_key,
                api_version=settings.azure_openai_api_version,
                azure_endpoint=settings.azure_openai_endpoint,
            )


    async def __call__(
        self,
        messages: List[ConversationMessage],
    ) -> str:
        """
        Core chat logic using Azure AI Project client with agents.

        Args:
            messages: List of conversation messages

        Returns:
            AI-generated response
        """
        try:
            # Get the system prompt from template
            system_prompt = self.prompt_template.get_prompt("general_chat")
            if system_prompt is None:
                raise ValueError("General chat prompt not found in chat_prompts.yaml")

            # Format messages for AzureOpenAI client
            formatted_messages = [{"role": "system", "content": system_prompt}]
            for message in messages:
                formatted_messages.append({"role": message.role.value, "content": message.message})

            # Combine conversation into a single input string including system prompt.
            input_text = self._format_conversation_messages(messages)
            input_text = f"System: {system_prompt}\n\n{input_text}"


            response = self.client.responses.create(
                model=settings.azure_chat_deployment_name,
                tools=[{"type": "web_search"}],
                input=input_text
            )

            # Extract and return the AI-generated response
            # Responses API provides `output_text` as a convenience aggregated string.
            output_text = getattr(response, "output_text", None)
            if output_text:
                return output_text.strip()
            # Fallback: try to extract text from response.output
            if hasattr(response, "output") and response.output:
                try:
                    # output is a list of messages/objects; join text parts
                    parts = []
                    for item in response.output:
                        if isinstance(item, dict) and "content" in item:
                            for c in item["content"]:
                                if c.get("type") == "output_text":
                                    parts.append(c.get("text", ""))
                    if parts:
                        return "".join(parts).strip()
                except Exception:
                    pass
            return "I'm sorry, but I couldn't find an appropriate response."

        except Exception as e:
            logger.error(f"Error in Azure OpenAI chat: {e}")
            traceback.print_exc()
            raise

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
            # Delete the agent if it exists
            if self.agent_id:
                await self.project_client.agents.delete_agent(self.agent_id)
                logger.info(f"Deleted agent: {self.agent_id}")

            # Close the project client
            await self.project_client.close()
            logger.info("Project client connection closed successfully")
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")


# Global instance
GENERAL_CHAT_SERVICE_INSTANCE = GeneralChatService()
