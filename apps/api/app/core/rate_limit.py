import time
import logging
import redis
from fastapi import Request, HTTPException, status, Depends
from core.redis import redis_drafts
from core.security import get_current_user_id

logger = logging.getLogger(__name__)

# Lua script for atomic bucket refills and consumption checks
LUA_TOKEN_BUCKET = """
local key = KEYS[1]
local max_capacity = tonumber(ARGV[1])
local fill_rate = tonumber(ARGV[2])
local cost = tonumber(ARGV[3])
local now = tonumber(ARGV[4])

local data = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(data[1])
local last_refill = tonumber(data[2])

if not tokens then
    tokens = max_capacity
    last_refill = now
else
    local delta = now - last_refill
    if delta > 0 then
        tokens = math.min(max_capacity, tokens + delta * fill_rate)
        last_refill = now
    end
end

if tokens >= cost then
    tokens = tokens - cost
    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', last_refill)
    redis.call('EXPIRE', key, math.ceil(max_capacity / fill_rate))
    return 1
else
    return 0
end
"""

class TokenBucketRateLimiter:
    def __init__(self, capacity: int, fill_rate: float, cost: int = 1):
        self.capacity = capacity
        self.fill_rate = fill_rate
        self.cost = cost

    def __call__(self, request: Request, user_id: str = Depends(get_current_user_id)):
        # Shared rate limit bucket per user ID across all protected endpoints
        key = f"rate_limit:{user_id}"
        now = time.time()
        
        try:
            allowed = redis_drafts.client.eval(
                LUA_TOKEN_BUCKET,
                1,
                key,
                self.capacity,
                self.fill_rate,
                self.cost,
                now
            )
            if not allowed:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Too many requests."
                )
        except redis.exceptions.ConnectionError as e:
            logger.error(f"Redis connection failed in rate limiter: {e}")
            if self.cost >= 10:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Service temporarily unavailable. Please try again later."
                )
            return
