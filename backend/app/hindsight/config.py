import os

class MemoryConfig:
    SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.25"))
    MAX_TOP_K_RESULTS = int(os.getenv("MAX_TOP_K_RESULTS", "5"))
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "tfidf-cosine")
