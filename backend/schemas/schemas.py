from pydantic import BaseModel, Field

class UserBase(BaseModel):
    id: int
    username: str
    hashed_password: str
    createdat: str

    class Config:
        orm_mode = True
class UserCreate(BaseModel):
    username: str
    password: str
    createdat: str = Field(..., example="2024-06-01T12:00:00Z")
class UserOut(BaseModel):
    id: int
    username: str
    createdat: str

    class Config:
        orm_mode = True
