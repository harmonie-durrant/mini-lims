from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models
from .database import get_db

def verify_email_format(email: str) -> tuple[bool, str]:
    email_parts = email.split("@")
    email_domain = email_parts[-1]
    email_local_part = email_parts[0]
    if len(email_parts) != 2 or not email_local_part or not email_domain:
        return (False, "Invalid email format")
    if len(email_local_part) < 3:
        return (False, "Email local part too short")
    if len(email_domain) < 3 or "." not in email_domain:
        return (False, "Email domain too short or missing '.'")
    return (True, email)

app = FastAPI()

@app.get("/")
def index():
    return {"ok": True}

@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users")
def create_user(email: str, db: Session = Depends(get_db)):
    is_valid, message = verify_email_format(email)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)
    user = models.User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
