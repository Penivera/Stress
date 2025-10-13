from typing import Optional

from pydantic import BaseModel, Field


class TokenAccount(BaseModel):
    pubkey: str
    mint: str
    owner: str
    raw_balance: int
    balance: float
    lamports_for_rent: int
    decimals: Optional[int] = None
    name: Optional[str] = None
    symbol: Optional[str] = None
    icon: Optional[str] = None
    tags: Optional[list[str]] = None
    usd_price: Optional[float] = None


class WalletTokensResponse(BaseModel):
    owner: str
    token_accounts: list[TokenAccount]
    message: Optional[str] = None


class SwapTransactionResponse(BaseModel):
    swapTransaction: str


class TokenMetadata(BaseModel):
    address: str
    name: Optional[str] = None
    symbol: Optional[str] = None
    decimals: Optional[int] = None
    logoURI: Optional[str] = None
    tags: Optional[list[str]] = None

    class Config:
        extra = "allow"


class SwapRequest(BaseModel):
    user_public_key: str = Field(
        ..., description="User's base58-encoded Solana public key."
    )
    input_mint: str = Field(..., description="Mint address of token to swap from.")
    output_mint: str = Field(..., description="Mint address of token to swap to.")
    amount: int = Field(
        ..., description="Amount in raw token units (e.g., 1 USDC = 1_000_000)."
    )
    slippage_bps: int = Field(
        50, description="Slippage in basis points (default 0.5%)."
    )
