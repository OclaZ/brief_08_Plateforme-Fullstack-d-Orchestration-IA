from fastapi import APIRouter , Depends , HTTPException, status
from sqlalchemy.orm import Session
from core.security import create_access_token
from routes.register import verify_password
from schemas.schemas import LoginRequest
from sqlalchemy import select
from passlib.context import CryptContext
from core.database import get_db
from models.users import User

router = APIRouter(tags=["Login"])

@router.post("/login")
async def login(credentials:LoginRequest,db:Session=Depends(get_db)):
    result = await db.execute(select(User).filter(User.username == credentials.username))
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect"
        )
    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}