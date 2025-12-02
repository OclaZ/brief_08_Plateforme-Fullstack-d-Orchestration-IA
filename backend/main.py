from fastapi import FastAPI
from models.users import  Base
from core.database import engine
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine
from routes.register import router as register_router



app = FastAPI()
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")

@app.on_event("startup")
async def startup_event():
    print("\nChecking database connection...")

    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            print("Database connection successful!")
        await init_db()
    except Exception as e:
        print("Database connection failed!")
        print(e)

@app.get("/")
async def read_root():
    return {"Hello": "World"}


app.include_router(register_router)

