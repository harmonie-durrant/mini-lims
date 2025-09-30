from .main import app 
from . import models
from .jwt import get_current_user
from fastapi import Depends
from sqlalchemy.orm import Session
from .database import get_db
from .permissions import has_permission

@app.post("/sample")
def create_sample(name: str, description: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user:
        return {"error": "Not authenticated"}
    if (has_permission(db, current_user.roles, "create_samples") is False):
        return {"error": "You do not have permission to create samples"}
    db_sample = models.Sample(
        name=name,
        description=description,
        created_by=current_user.id
    )
    db.add(db_sample)
    db.commit()
    db.refresh(db_sample)
    return db_sample

@app.get("/sample")
def read_samples(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if (has_permission(db, current_user.roles, "read_samples") is False):
        return {"error": "You do not have permission to view samples"}
    db_samples = db.query(models.Sample).all()
    return db_samples

@app.get("/sample/{sample_id}")
def read_sample(sample_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if (has_permission(db, current_user.roles, "read_samples") is False):
        return {"error": "You do not have permission to view samples"}
    db_sample = db.query(models.Sample).filter(models.Sample.id == sample_id).first()
    if db_sample is None:
        return {"error": "Sample not found"}
    return db_sample