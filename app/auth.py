import time
import hashlib
from typing import Optional
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(user_id: str, email: str) -> str:
    timestamp = int(time.time())
    raw = f"{user_id}:{email}:{timestamp}:secret_key"
    token = hashlib.sha256(raw.encode()).hexdigest()
    return f"token_{user_id}_{token[:16]}"

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)):
    if not credentials:
        return {"id": "guest-user", "email": "guest@agenthub.ai"}
    token = credentials.credentials
    if not token.startswith("token_"):
        raise HTTPException(status_code=401, detail="Invalid token format")
    parts = token.split("_")
    user_id = parts[1] if len(parts) > 1 else "user"
    return {"id": user_id, "email": f"{user_id}@agenthub.ai"}
