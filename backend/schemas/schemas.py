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
    createdat: str | None = None
class UserOut(BaseModel):
    id: int
    username: str
    createdat: str | None = None
    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    username: str = Field(..., description="Nom d'utilisateur")
    password: str = Field(..., description="Mot de passe")
    

    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin",
                "password": "admin  "
            }
        }


class LoginResponse(BaseModel):
    access_token: str = Field(..., description="Token JWT d'accès")
    token_type: str = Field(default="bearer", description="Type de token")

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }

class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Message d'erreur")

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Nom d'utilisateur ou mot de passe incorrect"
            }
        }

class Token(BaseModel):
    access_token: str
    token_type: str

class AnalyzeRequest(BaseModel):
    text: str

    class Config:
        json_schema_extra = {
            "example": {
                "text": "Le marché boursier a chuté de 2% suite aux annonces de la banque centrale."
            }
        }
class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Message d'erreur")

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Nom d'utilisateur ou mot de passe incorrect"
            }
        }


class AnalyzeResponse(BaseModel):
    category: str
    confidence_score: float
    summary: str
    sentiment: str