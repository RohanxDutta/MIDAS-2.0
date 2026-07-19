import os
import sys
from pathlib import Path
from sqlmodel import create_engine, text

db_pkg_dir = Path(__file__).parent.resolve()
project_root = db_pkg_dir.parent.parent.resolve()

def load_env():
    env_path = project_root / ".env"
    if not env_path.exists():
        print(f"Error: .env file not found at {env_path}")
        sys.exit(1)
        
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            val = val.strip().strip('"').strip("'")
            os.environ[key.strip()] = val

def main():
    load_env()
    
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL not set in .env")
        sys.exit(1)
        
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    engine = create_engine(db_url)
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("1. Fetching expired unlinked draft files (assessment_id IS NULL AND uploaded_at < NOW() - 24h)...")
            expired_records = conn.execute(text("""
                SELECT id, storage_path 
                FROM assessment_files 
                WHERE assessment_id IS NULL 
                AND uploaded_at < NOW() - INTERVAL '24 hours';
            """)).fetchall()

            if not expired_records:
                print("   No expired unlinked draft files found.")
                trans.commit()
                return

            print(f"   Found {len(expired_records)} expired draft file(s):")
            paths = []
            for r in expired_records:
                print(f"   - File ID: {r[0]} | Path: {r[1]}")
                paths.append(r[1])

            print("2. Purging expired DB records from assessment_files...")
            conn.execute(text("""
                DELETE FROM assessment_files 
                WHERE assessment_id IS NULL 
                AND uploaded_at < NOW() - INTERVAL '24 hours';
            """))

            print("3. Purging physical objects from storage.objects...")
            conn.execute(text("SET LOCAL storage.allow_delete_query = 'true';"))
            conn.execute(
                text("DELETE FROM storage.objects WHERE bucket_id = 'private' AND name = ANY(:paths);"),
                {"paths": paths}
            )

            trans.commit()
            print(f"\nSuccessfully purged {len(paths)} expired draft file(s) from database and storage.objects!")
        except Exception as e:
            trans.rollback()
            print(f"\nError cleaning up expired files: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
