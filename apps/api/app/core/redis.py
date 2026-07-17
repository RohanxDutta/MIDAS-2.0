import json
import logging
from typing import Optional, Dict, Any
import redis
from .config import settings

logger = logging.getLogger(__name__)

class RedisDraftCache:
    def __init__(self):
        # Initialize Redis connection client
        self.client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD or None,
            decode_responses=True # Returns string instead of bytes
        )
        # Default Time-To-Live for drafts (14 days in seconds)
        self.ttl = 14 * 24 * 60 * 60

    def save_draft(self, user_id: str, draft_data: Dict[str, Any]) -> bool:
        try:
            key = f"draft:{user_id}"
            serialized = json.dumps(draft_data)
            self.client.setex(key, self.ttl, serialized)
            return True
        except Exception as e:
            logger.error(f"Error saving draft to Redis for user {user_id}: {e}")
            return False

    def get_draft(self, user_id: str) -> Optional[Dict[str, Any]]:
        try:
            key = f"draft:{user_id}"
            serialized = self.client.get(key)
            if serialized:
                return json.loads(serialized)
            return None
        except Exception as e:
            logger.error(f"Error reading draft from Redis for user {user_id}: {e}")
            return None

    def clear_draft(self, user_id: str) -> bool:
        try:
            key = f"draft:{user_id}"
            deleted = self.client.delete(key)
            return deleted > 0
        except Exception as e:
            logger.error(f"Error deleting draft from Redis for user {user_id}: {e}")
            return False

# Export instantiated draft cache client
redis_drafts = RedisDraftCache()
