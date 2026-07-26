import sys
sys.path.insert(0, '.')
import asyncio
from backend.rag.retriever import Retriever
from backend.rag.vector_store import VectorStore
from backend.rag.embedding_service import EmbeddingService

async def main():
    embeddings = EmbeddingService()
    store = VectorStore(collection_name='retriever_test', embedding_dimension=embeddings.dimension)
    await store.reset_collection()

    chunks = [
        {
            'document_id': 'docA',
            'chunk_id': 'c1',
            'content': 'This document explains AI and machine learning.',
            'metadata': {'source': 'test', 'title': 'AI Guide'},
        },
        {
            'document_id': 'docA',
            'chunk_id': 'c2',
            'content': 'AI systems can answer questions and generate text.',
            'metadata': {'source': 'test', 'title': 'AI Guide'},
        },
        {
            'document_id': 'docA',
            'chunk_id': 'c3',
            'content': 'AI systems can answer questions and generate text.',
            'metadata': {'source': 'test', 'title': 'AI Guide'},
        },
        {
            'document_id': 'docB',
            'chunk_id': 'c1',
            'content': 'Python programming tutorials and examples.',
            'metadata': {'source': 'test', 'title': 'Python Guide'},
        },
    ]

    embed_texts = [chunk['content'] for chunk in chunks]
    embeddings_list = await embeddings.embed_batch(embed_texts)
    for chunk, embedding in zip(chunks, embeddings_list):
        chunk['embedding'] = embedding

    await store.add_documents(chunks)

    retriever = Retriever(vector_store=store, embedding_service=embeddings)
    results = await retriever.retrieve('What is AI?', top_k=3, filters={'source': 'test', 'title': 'AI Guide'})
    print('results len', len(results))
    for result in results:
        print(result)

    results_empty = await retriever.retrieve('No data', top_k=3, filters={'source': 'none'})
    print('results_empty', results_empty)

    await store.reset_collection()

asyncio.run(main())
