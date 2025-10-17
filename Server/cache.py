import json
import aiohttp
from datetime import timedelta
from redis.asyncio import Redis
from config import settings


async def fetch_jupiter_tokens() -> list[dict]:
    """Fetch verified token list from Jupiter API."""
    async with aiohttp.ClientSession() as session:
        async with session.get(settings.JUPITER_TOKENS_URL) as resp:
            if resp.status != 200:
                raise Exception(f"Failed to fetch Jupiter tokens: {resp.status}")
            return await resp.json()


async def refresh_token_cache(redis: Redis):
    """Fetch tokens and refresh cache in Redis."""
    tokens = await fetch_jupiter_tokens()
    await redis.set(settings.REDIS_KEY, json.dumps(tokens), ex=int(settings.CACHE_TTL.total_seconds()))
    return tokens


async def get_cached_tokens(redis: Redis) -> list[dict]:
    """Return cached token list; refresh if missing or expired."""
    data = await redis.get(settings.REDIS_KEY)
    if data:
        return json.loads(data)

    # If not cached, fetch fresh
    return await refresh_token_cache(redis)


async def get_token_metadata(redis: Redis, mint: str) -> dict | None:
    """Return metadata for a single token mint."""
    tokens = await get_cached_tokens(redis)
    # The new API uses 'id' instead of 'address' for the mint.
    return next((t for t in tokens if t.get("id") == mint), None)