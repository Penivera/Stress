## Server Overview

This FastAPI service powers wallet operations and exposes token metadata cached from Jupiter and other Dexes.


## Requirements

- Python 3.12+
- Redis instance (defaults to `localhost:6379`)
- `poetry` or `pip` to install dependencies (`pip install -r requirements.txt` if available)

## Key Components

- `main.py` – FastAPI app factory, lifespan hook, and token metadata endpoint.
- `solana.py` – `/wallet` router for wallet balances and swap preparation.
- `cache.py` – Async helpers to fetch and cache Jupiter token lists in Redis.
- `scheduler.py` – APScheduler setup that refreshes the cache daily at midnight.
- `schemas.py` – Pydantic models shared by the API.

## Environment

Set the following variables or edit `config.py`:

- `RPC_URL` – Solana RPC endpoint.
- `JUPITER_API_BASE_URL` – Jupiter aggregator API root.
- `REDIS_URL` – Redis connection string (optional if using defaults).

## Running Locally

```bash
cd Server
uvicorn main:app --reload
```

The lifespan hook will launch the cron scheduler; ensure Redis is running before you start the server.

## Core Routes

- `GET /wallet/wallet-tokens/{public_key}` → Returns SPL token accounts enriched with cached metadata.
- `POST /wallet/swap-transaction` → Builds a Jupiter swap transaction for the provided quote request.
- `GET /token/{mint}` → Looks up cached metadata for a specific token mint.

## Testing Tips

- Hit `/docs` for interactive OpenAPI exploration.
- Clear `jupiter:verified_tokens` in Redis to force a fresh Jupiter sync.

- Hit `/docs` for interactive OpenAPI exploration.
- Clear `jupiter:verified_tokens` in Redis to force a fresh Jupiter sync.
