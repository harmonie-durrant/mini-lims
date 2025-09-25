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