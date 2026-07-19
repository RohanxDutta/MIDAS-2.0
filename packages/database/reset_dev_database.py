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
            print("1. Deleting test assessments ('Test Title') and associated answers...")
            conn.execute(text("""
                DELETE FROM assessment_answers
                WHERE assessment_id IN (
                    SELECT id FROM assessments WHERE dataset_title = 'Test Title'
                );
            """))
            conn.execute(text("DELETE FROM assessments WHERE dataset_title = 'Test Title';"))

            print("2. Deleting single test assessment ('adbac4ca-18a0-4aa4-9fc1-deb1fd49e476')...")
            conn.execute(text("""
                DELETE FROM assessment_answers
                WHERE assessment_id = 'adbac4ca-18a0-4aa4-9fc1-deb1fd49e476';
            """))
            conn.execute(text("DELETE FROM assessments WHERE id = 'adbac4ca-18a0-4aa4-9fc1-deb1fd49e476';"))

            print("3. Deleting stuck pending files...")
            conn.execute(text("DELETE FROM assessment_files WHERE status = 'pending';"))

            print("4. Deleting orphaned success files (assessment_id IS NULL)...")
            conn.execute(text("DELETE FROM assessment_files WHERE assessment_id IS NULL AND status = 'success';"))

            print("5. Enabling storage object deletion and purging unreferenced storage objects...")
            conn.execute(text("SET LOCAL storage.allow_delete_query = 'true';"))
            conn.execute(text("""
                DELETE FROM storage.objects
                WHERE bucket_id = 'private'
                AND name NOT IN (SELECT storage_path FROM assessment_files);
            """))

            print("6. Deleting stray test file objects...")
            conn.execute(text("SET LOCAL storage.allow_delete_query = 'true';"))
            conn.execute(text("""
                DELETE FROM storage.objects
                WHERE bucket_id = 'private'
                AND name LIKE 'evidence/test/%';
            """))

            trans.commit()
            print("\nDatabase & storage cleanup committed successfully!\n")

            print("=== Verification Counts ===")
            results = conn.execute(text("""
                SELECT 'assessments' as table_name, COUNT(*) as count FROM assessments
                UNION ALL
                SELECT 'files', COUNT(*) FROM assessment_files
                UNION ALL
                SELECT 'unlinked_files', COUNT(*) FROM assessment_files WHERE assessment_id IS NULL
                UNION ALL
                SELECT 'storage_objects', COUNT(*) FROM storage.objects WHERE bucket_id = 'private';
            """)).fetchall()

            for r in results:
                print(f" - {r[0]}: {r[1]}")

        except Exception as e:
            trans.rollback()
            print(f"\nError resetting database: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
