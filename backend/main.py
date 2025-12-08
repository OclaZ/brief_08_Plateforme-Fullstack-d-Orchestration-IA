from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
# Adjust these imports based on your actual folder structure
from core.database import engine, get_db
from models.users import Base  # Ensure this file exists and has your models
from routes.register import router as register_router
from routes.login import router as login_router
from routes.analyze import router as analyze_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Initialization ---
async def init_db():
    """Creates tables if they don't exist."""
    async with engine.begin() as conn:
        # This creates the tables based on your SQLModel/SQLAlchemy models
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables check/creation completed.")

@app.on_event("startup")
async def startup_event():
    print("\n🔄 Checking database connection...")
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
    except Exception as e:
        import traceback
        print("❌ Database connection failed!")
        traceback.print_exc()

# --- Routes ---
@app.get("/")
async def read_root():
    return {"message": "API is running", "database": "Neon Postgres"}

app.include_router(register_router)
app.include_router(login_router)
app.include_router(analyze_router)  