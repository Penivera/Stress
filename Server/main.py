from fastapi import FastAPI, Depends, HTTPException
from redis.asyncio import Redis
from scheduler import setup_jupiter_refresh_scheduler
from cache import get_token_metadata
from contextlib import asynccontextmanager
from routers.solana import router as solana_wallet_router

from config import get_redis
from schemas import TokenMetadata
@asynccontextmanager
async def lifespan(app: FastAPI):
    redis = get_redis()
    # Kick off background refresh loop
    import asyncio
    asyncio.create_task(setup_jupiter_refresh_scheduler(redis)) # type: ignore
    try:
        yield
    finally:
        await redis.close()
    
app = FastAPI(lifespan=lifespan)
app.include_router(solana_wallet_router)





@app.get("/token/{mint}", response_model=TokenMetadata)
async def get_token(mint: str, redis: Redis = Depends(get_redis)) -> TokenMetadata:
    data = await get_token_metadata(redis, mint)
    if not data:
        raise HTTPException(status_code=404, detail="Token not found or not verified")
    return TokenMetadata(**data)
