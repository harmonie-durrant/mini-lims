from datetime import timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
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
from .permissions import (
    has_permission,
    user_has_higher_role
)

app = FastAPI()

# Import sample and user endpoints (this registers the routes)
# Note: These imports must come after app creation to avoid circular imports
from . import sample
from . import user

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:4173", "https://mini-lims.harmoniedurrant.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/register")
def register_user(email: str, password: str, roles: str = "lab_tech", db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if (has_permission(db, current_user.roles, 'create_users') is False):
        raise HTTPException(status_code=403, detail="You do not have permission to create users")
    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    is_valid, message = verify_email_format(email)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)

    password_hash = get_password_hash(password)
    user = models.User(email=email, password_hash=password_hash, roles=roles)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "email": user.email, "created_at": user.created_at}

@app.get("/protected_test")
def protected_test(current_user: models.User = Depends(get_current_user)):
    return {
        "ok": True, 
        "message": "You are authorized to access this endpoint.",
        "user_id": current_user.id,
        "email": current_user.email,
        "roles": current_user.roles
    }

@app.post("/users")
def create_user(email: str, password: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if (has_permission(db, current_user.roles, 'create_users') is False):
        raise HTTPException(status_code=403, detail="You do not have permission to create users")

    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        if (has_permission(db, current_user.roles, 'update_users') is False or user_has_higher_role(db, current_user, existing_user) is False):
            raise HTTPException(status_code=403, detail="You do not have permission to update users")
        existing_user.password_hash = get_password_hash(password)
        db.commit()
        db.refresh(existing_user)
        return {"id": existing_user.id, "email": existing_user.email, "created_at": existing_user.created_at}

    is_valid, message = verify_email_format(email)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)

    password_hash = get_password_hash(password)
    user = models.User(email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "email": user.email, "created_at": user.created_at}

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID - for testing purposes"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "email": user.email, "created_at": user.created_at, "roles": user.roles}
