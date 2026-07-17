import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "your-supabase-jwt-secret")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-supabase-service-role-key")
    NEXT_PUBLIC_SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://your-project-ref.supabase.co")
    
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
    WEBHOOK_SECRET: str = os.getenv("WEBHOOK_SECRET", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
