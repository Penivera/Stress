from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient
from solana.rpc.types import TokenAccountOpts
from spl.token.constants import TOKEN_PROGRAM_ID
import uvicorn
import aiohttp
import struct
from cache import get_token_metadata  # Import the function to get token metadata
from config import get_redis, settings  # Import the Redis dependency
from schemas import (
    SwapRequest,
    SwapTransactionResponse,
    TokenAccount,
    WalletTokensResponse,
)
from redis.asyncio import Redis


# --- FastAPI App ---
router = APIRouter(tags=["Wallet"], prefix="/wallet")


# --- Endpoints ---
@router.get(
    "/wallet-tokens/{public_key}",
    summary="Get SPL token accounts by owner",
    tags=["Wallet"],
    response_model=WalletTokensResponse,
)
async def get_wallet_tokens(
    public_key: str = Path(
        ...,
        description="Base58 encoded Solana public key.",
        example="4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF",
    ),
    redis: Redis = Depends(get_redis),  # Use the Redis dependency
) -> WalletTokensResponse:
    """
    Gets all SPL token accounts owned by the provided wallet address.
    """
    try:
        owner = Pubkey.from_string(public_key)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid public key format.")

    try:
        async with AsyncClient(settings.SOLANA_RPC_URL) as rpc:
            response = await rpc.get_token_accounts_by_owner(
                owner, TokenAccountOpts(program_id=TOKEN_PROGRAM_ID)
            )

        if not response.value:
            return WalletTokensResponse(
                owner=public_key,
                token_accounts=[],
                message="No token accounts found.",
            )

        tokens: list[TokenAccount] = []
        for account_info in response.value:
            acc = account_info.account

            # --- Correctly Parse Token Information ---
            # Parse the mint address (first 32 bytes of the account data)
            mint_pubkey = Pubkey(acc.data[0:32])
            mint_address = str(mint_pubkey)

            # Parse the raw token amount (at offset 64)
            (raw_token_amount,) = struct.unpack("<Q", acc.data[64:72])

            # Get token metadata for display information
            token_metadata = await get_token_metadata(redis, mint_address)

            decimals = None
            name = symbol = icon = None
            tags = None
            usd_price = None

            if token_metadata:
                if (decimals_value := token_metadata.get("decimals")) is not None:
                    try:
                        decimals = int(decimals_value)
                    except (TypeError, ValueError):
                        decimals = None
                name = token_metadata.get("name")
                symbol = token_metadata.get("symbol")
                icon = token_metadata.get("icon") or token_metadata.get("logoURI")
                tags = token_metadata.get("tags")
                usd_price_value = token_metadata.get("usdPrice")
                if usd_price_value is not None:
                    try:
                        usd_price = float(usd_price_value)
                    except (TypeError, ValueError):
                        usd_price = None

            if decimals is not None:
                decimal_balance = raw_token_amount / (10**decimals)
            else:
                decimal_balance = float(raw_token_amount)

            tokens.append(
                TokenAccount(
                    pubkey=str(account_info.pubkey),
                    mint=mint_address,
                    owner=str(acc.owner),
                    raw_balance=raw_token_amount,
                    balance=decimal_balance,
                    lamports_for_rent=acc.lamports,
                    decimals=decimals,
                    name=name,
                    symbol=symbol,
                    icon=icon,
                    tags=tags,
                    usd_price=usd_price,
                )
            )

        return WalletTokensResponse(owner=public_key, token_accounts=tokens)

    except Exception as e:
        print(f"Error fetching token accounts: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error fetching token accounts: {e}"
        )


@router.post(
    "/swap-transaction",
    summary="Prepare a Jupiter swap transaction",
    tags=["Swap"],
    response_model=SwapTransactionResponse,
)
async def prepare_swap_transaction(
    swap_request: SwapRequest,
) -> SwapTransactionResponse:
    """
    Fetches a quote from Jupiter and prepares a transaction
    for the user to sign on the frontend.
    """
    quote_url = (
        f"{settings.JUPITER_API_BASE_URL}/quote?"
        f"inputMint={swap_request.input_mint}&"
        f"outputMint={swap_request.output_mint}&"
        f"amount={swap_request.amount}&"
        f"slippageBps={swap_request.slippage_bps}"
    )

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(quote_url) as quote_response:
                quote_response.raise_for_status()
                quote_data = await quote_response.json()
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=502, detail=f"Failed to get quote from Jupiter API: {e}"
            )

        try:
            swap_payload = {
                "quoteResponse": quote_data,
                "userPublicKey": swap_request.user_public_key,
                "wrapAndUnwrapSol": True,
            }
            async with session.post(
                f"{settings.JUPITER_API_BASE_URL}/swap", json=swap_payload
            ) as swap_response:
                swap_response.raise_for_status()
                swap_data = await swap_response.json()

            swap_tx = swap_data.get("swapTransaction")
            if not swap_tx:
                raise HTTPException(
                    status_code=502,
                    detail="Swap transaction missing in Jupiter response",
                )

            return SwapTransactionResponse(swapTransaction=swap_tx)
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=502, detail=f"Failed to get swap transaction: {e}"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
