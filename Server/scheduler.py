import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from cache import refresh_token_cache


async def refresh_jupiter_tokens(redis):
    """Refresh Jupiter token cache - called by cron job."""
    try:
        await refresh_token_cache(redis)
        print("✅ Refreshed Jupiter tokens cache")
    except Exception as e:
        print(f"⚠️ Failed to refresh Jupiter tokens: {e}")


async def setup_jupiter_refresh_scheduler(redis):
    """Setup cron job to refresh Jupiter token cache daily at midnight."""
    scheduler = AsyncIOScheduler()

    # Schedule to run daily at midnight (00:00)
    trigger = CronTrigger(hour=0, minute=0)

    scheduler.add_job(
        refresh_jupiter_tokens,
        trigger=trigger,
        args=[redis],
        id="jupiter_token_refresh",
        name="Refresh Jupiter Token Cache",
        replace_existing=True,
    )

    return scheduler
