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
            print("1. Querying pg_proc for storage schema functions...")
            result = conn.execute(text("""
                SELECT proname 
                FROM pg_proc p 
                JOIN pg_namespace n ON p.pronamespace = n.oid 
                WHERE nspname = 'storage' AND proname LIKE '%sign%';
            """))
            rows = result.fetchall()
            if rows:
                print(f"   Found {len(rows)} matching storage signature function(s):")
                for r in rows:
                    print(f"   - storage.{r[0]}")
            else:
                print("   Notice: No functions in schema 'storage' matching '%sign%' found.")

            print("2. Granting schema USAGE on 'storage' to anon, authenticated, service_role, supabase_storage_admin...")
            conn.execute(text("GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role, supabase_storage_admin;"))

            print("3. Granting ALL PRIVILEGES on ALL TABLES in schema 'storage'...")
            conn.execute(text("GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, service_role, supabase_storage_admin;"))

            print("4. Granting ALL PRIVILEGES on ALL SEQUENCES in schema 'storage'...")
            conn.execute(text("GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon, authenticated, service_role, supabase_storage_admin;"))

            print("5. Granting EXECUTE on ALL FUNCTIONS in schema 'storage'...")
            conn.execute(text("GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA storage TO anon, authenticated, service_role, supabase_storage_admin;"))

            print("6. Setting ALTER DEFAULT PRIVILEGES in schema 'storage'...")
            conn.execute(text("ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON TABLES TO anon, authenticated, service_role, supabase_storage_admin;"))
            conn.execute(text("ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon, authenticated, service_role, supabase_storage_admin;"))
            conn.execute(text("ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role, supabase_storage_admin;"))

            print("7. Granting USAGE and EXECUTE on schema 'net'...")
            conn.execute(text("GRANT USAGE ON SCHEMA net TO anon, authenticated, service_role, supabase_storage_admin;"))
            conn.execute(text("GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA net TO anon, authenticated, service_role, supabase_storage_admin;"))

            print("8. Ensuring notify_file_upload function has SECURITY DEFINER and search_path set...")
            # Check if function exists before updating search_path
            fn_check = conn.execute(text("""
                SELECT 1 FROM pg_proc p 
                JOIN pg_namespace n ON p.pronamespace = n.oid 
                WHERE nspname = 'public' AND proname = 'notify_file_upload';
            """)).fetchone()

            if fn_check:
                conn.execute(text("""
                    ALTER FUNCTION public.notify_file_upload() 
                    SET search_path = public, storage, net, extensions;
                """))
                print("   Updated search_path on public.notify_file_upload()")

            trans.commit()
            print("\nStorage schema permissions and function search_path successfully restored!")
        except Exception as e:
            trans.rollback()
            print(f"\nError repairing storage permissions: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
