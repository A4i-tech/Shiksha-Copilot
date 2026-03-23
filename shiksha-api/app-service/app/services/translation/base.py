from abc import ABC, abstractmethod
from typing import List


class TranslatorBase(ABC):
    """
    Abstract base class defining the async interface for all text translators.
    """

    @abstractmethod
    async def translate_async(
        self, text: str, src_lang: str, tgt_lang: str
    ) -> str:
        """
        Translate a single string from the source language to the target language.
        """
        ...

    @abstractmethod
    async def translate_batch_async(
        self, texts: List[str], src_lang: str, tgt_lang: str
    ) -> List[str]:
        """
        Translate a list of strings from the source language to the target language.
        """
        ...

