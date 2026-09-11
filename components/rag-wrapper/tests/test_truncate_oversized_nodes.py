from llama_index.core.schema import NodeWithScore, TextNode
from llama_index.core.utils import get_tokenizer

from rag_wrapper.base.base_vector_index_rag_ops import TruncateOversizedNodes


def _tokens(text: str) -> int:
    return len(get_tokenizer()(text))


def test_oversized_node_is_truncated_to_the_budget():
    # a markdown table has no sentence punctuation, so ingestion can emit it as one huge chunk
    table = "\n".join(f"| row {i} | value {i} | note {i} |" for i in range(500))
    nodes = [NodeWithScore(node=TextNode(text=table))]

    TruncateOversizedNodes(max_tokens=100)._postprocess_nodes(nodes)

    assert _tokens(nodes[0].node.get_content()) <= 100


def test_normal_node_is_left_alone():
    nodes = [NodeWithScore(node=TextNode(text="Photosynthesis happens in the chloroplast."))]

    TruncateOversizedNodes(max_tokens=100)._postprocess_nodes(nodes)

    assert nodes[0].node.get_content() == "Photosynthesis happens in the chloroplast."
