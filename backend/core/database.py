import os
import re
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Neon requires sslmode=require → asyncpg supports it automatically
ASYNC_DB_URL = re.sub(r"^postgresql:", "postgresql+asyncpg:", DATABASE_URL)

engine = create_async_engine(
    ASYNC_DB_URL,
    echo=True,
    pool_pre_ping=True,
)

async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

# Dependency for FastAPI
async def get_db():
    async with async_session() as session:
        yield session
