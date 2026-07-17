from fastapi import Header, HTTPException, status
from jose import jwt, JWTError
from .config import settings

def get_current_user_id(authorization: str = Header(None)) -> str:
    """Decodes and validates the Supabase Auth JWT token from the Authorization Header.
    Returns the user's UUID string if valid.
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
            
        return user_id

    except (ValueError, JWTError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired credentials: {str(e)}",
        )
