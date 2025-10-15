from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field,computed_field
from redis.asyncio import Redis
from datetime import timedelta

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    SOLANA_RPC_URL: str = Field(default="https://api.mainnet-beta.solana.com", description="Solana RPC URL")
    
    REDIS_URL:str = Field(default="redis://localhost:6379", description="Redis connection URL")

    JUPITER_API_BASE_URL: str = Field(default="https://quote-api.jup.ag/v6", description="Base URL for Jupiter API")
    JUPITER_TOKENS_URL: str = Field(default="https://lite-api.jup.ag/tokens/v2/tag?query=verified", description="URL to fetch verified tokens from Jupiter")
    
    JUPITER_ORDER_URL: str = Field(default="https://lite-api.jup.ag/ultra/v1/order", description="URL to fetch swap quotes from Jupiter")
    REDIS_KEY: str = Field(default="jupiter:verified_tokens", description="Redis key for cached Jupiter tokens")
    
    @property
    def CACHE_TTL(self) -> timedelta:
        return timedelta(days=1)  # refresh every 24 hours
        

settings = Settings()
redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis() -> Redis:
    return redis