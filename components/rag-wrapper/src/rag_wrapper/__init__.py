"""
RAG Wrapper - A simple RAG wrapper for easy-to-use APIs to create, update or query indexes using llama index library.

This package provides implementations for different vector stores and RAG operations:
- InMemRagOps: In-memory vector store implementation
- QdrantRagOps: Qdrant vector store implementation
"""

from .base.base_vector_index_rag_ops import BaseVectorIndexRagOps
from .base.base_graph_index_rag_ops import BaseGraphIndexRagOps
from .base.base_rag_ops import BaseRagOps
from .rag_ops.in_mem_rag_ops import InMemRagOps
from .rag_ops.in_mem_graph_rag_ops import InMemGraphRagOps
from .rag_ops.qdrant_rag_ops import QdrantRagOps

__version__ = "1.0.0"
__all__ = [
    "BaseVectorIndexRagOps",
    "BaseGraphIndexRagOps",
    "BaseRagOps",
    "InMemRagOps",
    "InMemGraphRagOps",
    "QdrantRagOps"
]
