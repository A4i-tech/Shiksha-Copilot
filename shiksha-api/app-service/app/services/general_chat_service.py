from typing import List
from pathlib import Path
import logging
import traceback

from openai import AsyncAzureOpenAI

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

        # Check configuration
        if not settings.azure_openai_api_key:
            raise ValueError("AZURE_OPENAI_API_KEY environment variable is required")
        if not settings.azure_openai_endpoint:
            raise ValueError("AZURE_OPENAI_ENDPOINT environment variable is required")
        if not settings.azure_openai_api_version:
            raise ValueError("AZURE_OPENAI_API_VERSION environment variable is required")
        
        # Determine deployment name with fallback
        self.deployment_name = settings.azure_chat_deployment_name
        if not self.deployment_name:
            if settings.azure_openai_deployment_name:
                logger.warning("AZURE_CHAT_DEPLOYMENT_NAME not set, using AZURE_OPENAI_DEPLOYMENT_NAME as fallback.")
                self.deployment_name = settings.azure_openai_deployment_name
            else:
                raise ValueError("AZURE_CHAT_DEPLOYMENT_NAME or AZURE_OPENAI_DEPLOYMENT_NAME is required")

        self.client = AsyncAzureOpenAI(
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

            response = await self.client.chat.completions.create(
                model=self.deployment_name,
                messages=formatted_messages,
                temperature=0.7
            )

            # Extract and return the AI-generated response
            if response.choices and response.choices[0].message.content:
                return response.choices[0].message.content.strip()
            
            return "I'm sorry, but I couldn't find an appropriate response."

        except Exception as e:
            logger.error(f"Error in Azure OpenAI chat: {e}")
            traceback.print_exc()
            raise

    async def cleanup(self):
        """
        Cleanup method for the service.
        """
        try:
            # Native client doesn't need explicit cleanup in this context,
            # but we keep the method for interface consistency with lifespan.
            logger.info("General Chat Service cleanup completed")
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")


# Global instance
GENERAL_CHAT_SERVICE_INSTANCE = GeneralChatService()
