from datetime import date, datetime
from unittest import result
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db, engine
from sqlalchemy import select
from models.users import User, Base
from passlib.context import CryptContext
from schemas.schemas import UserCreate, UserOut

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


router = APIRouter(tags=["Register"])


@router.post("/register", response_model=UserOut)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):

    # Check username
    
    result = await db.execute(select(User).filter(User.username == user.username))
    db_user = result.scalar_one_or_none()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    safe_password = user.password[:72]

    hashed_password = pwd_context.hash(safe_password)
    createdate =datetime.now().__str__()
    print(createdate)
    print(type(createdate))
    

    new_user = User(
        username=user.username,
        hashed_password=hashed_password,
        createdat=createdate
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


@router.get("/users/{user_id}")
async def get_user_debug(user_id: int, db: Session = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "hashed_password": user.hashed_password,
        "createdat": user.createdat
    }
