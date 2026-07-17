from fastapi import Header, HTTPException, status, Depends
from jose import jwt, JWTError
from pydantic import BaseModel
from .config import settings

class CurrentUser(BaseModel):
    id: str
    role: str

def get_current_user(authorization: str = Header(None)) -> CurrentUser:
    """Decodes and validates the Supabase Auth JWT token from the Authorization Header.
    Returns the user's CurrentUser session details (ID and Role) if valid.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header",
        )

    try:
        # Check token scheme (Bearer token)
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
            )
        
        # Decode the JWT token signed by Supabase Auth using HS256
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False} # Supabase audits can vary locally vs cloud
        )
        
        # Extract the user's ID (sub claim)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload: missing sub claim",
            )
            
        # Extract the user's role from user_metadata (defaults to 'user')
        user_metadata = payload.get("user_metadata", {})
        role = user_metadata.get("role", "user")
            
        return CurrentUser(id=user_id, role=role)

    except (ValueError, JWTError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired credentials: {str(e)}",
        )

def get_current_user_id(current_user: CurrentUser = Depends(get_current_user)) -> str:
    """Convenience dependency that returns just the user's UUID string.
    Ensures backward compatibility with all existing endpoints.
    """
    return current_user.id

def require_nodal(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    """Authorization dependency that restricts access to Nodal user role only."""
    if current_user.role != "nodal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: This action requires a Nodal user role.",
        )
    return current_user
