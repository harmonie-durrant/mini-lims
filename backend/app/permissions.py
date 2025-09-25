from sqlalchemy.orm import Session
from . import models

def has_permission(db: Session, roles: str, permission: str) -> bool:
    role_list = roles.split(",") if roles else []
    for role_name in role_list:
        role = db.query(models.Role).filter(models.Role.name == role_name).first()
        if role and role.permissions:
            permissions = role.permissions.replace(" ", "")
            print("Role Permissions for ", role_name, ": ", permissions)
            if permissions == '*':
                return True
            permissions = permissions.split(",")
            if permission in permissions:
                return True
    return False

def user_has_higher_role(db: Session, current_user: models.User, target_user: models.User) -> bool:
    current_user_roles = current_user.roles.split(",") if current_user.roles else []
    target_user_roles = target_user.roles.split(",") if target_user.roles else []

    current_user_highest_position = max(
        [db.query(models.Role).filter(models.Role.name == role_name).first().position 
         for role_name in current_user_roles 
         if db.query(models.Role).filter(models.Role.name == role_name).first() is not None] or [0]
    )

    target_user_highest_position = max(
        [db.query(models.Role).filter(models.Role.name == role_name).first().position 
         for role_name in target_user_roles 
         if db.query(models.Role).filter(models.Role.name == role_name).first() is not None] or [0]
    )

    return current_user_highest_position < target_user_highest_position # Lower is better
