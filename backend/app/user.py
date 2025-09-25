from .main import app
from . import models
from .jwt import get_current_user
from fastapi import Depends

@app.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    roles = current_user.roles.split(",") if current_user.roles else []
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "roles": roles
    }