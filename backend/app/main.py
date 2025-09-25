from datetime import timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import models
from .database import get_db
from .jwt import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from .form_vaidation import verify_email_format

app = FastAPI()

@app.get("/")
def index():
    return {"ok": True}

@app.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "email": user.email}

@app.get("/protected_test")
def protected_test(current_user: models.User = Depends(get_current_user)):
    return {
        "ok": True, 
        "message": "You are authorized to access this endpoint.",
        "user_id": current_user.id,
        "email": current_user.email,
        "roles": current_user.roles
    }

#TODO: Protect this endpoint so only admin users can access it
@app.post("/users")
def create_user(email: str, password: str, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    is_valid, message = verify_email_format(email)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)
    
    password_hash = get_password_hash(password)
    user = models.User(email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "email": user.email, "created_at": user.created_at}

