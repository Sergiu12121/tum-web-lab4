import os
import hashlib

class Cache:
    def __init__(self, cache_dir=".cache"):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)

    def _get_cache_path(self, key):
        hashed_key = hashlib.sha256(key.encode()).hexdigest()
        return os.path.join(self.cache_dir, hashed_key)

    def get(self, key):
        path = self._get_cache_path(key)
        if os.path.exists(path):
            with open(path, "r") as f:
                return f.read()
        return None

    def set(self, key, value):
        path = self._get_cache_path(key)
        with open(path, "w") as f:
            f.write(value)