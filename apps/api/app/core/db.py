from sqlmodel import create_engine, Session
from .config import settings

# Adjust PostgreSQL URL if it has a postgres:// prefix (standard for Supabase)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Configure SQLModel database engine
engine = create_engine(
    db_url,
    pool_pre_ping=True, # Verifies connection health
    echo=False          # Set to True for verbose SQL logs during debugging
)

def get_session():
    """Dependency generator providing localized transactional database sessions.
    Automatically closes the session after request processing completes.
    """
    with Session(engine) as session:
        yield session
