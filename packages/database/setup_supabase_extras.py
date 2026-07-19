import os
import sys
from pathlib import Path
from sqlmodel import create_engine, text

# Add project root to path
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
        
    # Read the webhook target URL (for local dev, usually ngrok URL)
    webhook_url = os.getenv("WEBHOOK_TARGET_URL")
    if not webhook_url:
        print("\n[WARNING] WEBHOOK_TARGET_URL is not set in your .env file.")
        print("For cloud Supabase triggers to reach your local FastAPI server, you will need a public proxy URL.")
        print("Example: Set WEBHOOK_TARGET_URL=https://your-subdomain.ngrok-free.app/api/v1/webhooks/storage")
        print("Using placeholder URL: http://localhost:8000/api/v1/webhooks/storage\n")
        webhook_url = "http://localhost:8000/api/v1/webhooks/storage"
    else:
        print(f"Deploying storage trigger webhook pointing to: {webhook_url}")

    # Read WEBHOOK_SECRET
    webhook_secret = os.getenv("WEBHOOK_SECRET")
    if not webhook_secret:
        print("Error: WEBHOOK_SECRET not set in .env")
        sys.exit(1)

    engine = create_engine(db_url)
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # 1. Enable pg_net extension
            print("1. Enabling pg_net extension in Supabase...")
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_net;"))
            
            # 2. Create the private bucket in storage.buckets table
            print("2. Ensuring 'private' storage bucket exists...")
            # Supabase stores bucket configurations in storage.buckets table
            conn.execute(text("""
                INSERT INTO storage.buckets (id, name, public) 
                VALUES ('private', 'private', false) 
                ON CONFLICT (id) DO NOTHING;
            """))

            # 3. Create/Update Trigger Function to POST to FastAPI
            print("3. Creating notify_file_upload trigger function...")
            # In Supabase, pg_net provides net.http_post under the 'net' schema
            conn.execute(text(f"""
                CREATE OR REPLACE FUNCTION public.notify_file_upload()
                RETURNS TRIGGER
                SECURITY DEFINER
                SET search_path = public, storage, net, extensions
                AS $$
                DECLARE
                    payload jsonb;
                BEGIN
                    payload := jsonb_build_object(
                        'record', jsonb_build_object(
                            'bucket_id', NEW.bucket_id,
                            'name', NEW.name,
                            'metadata', NEW.metadata
                        )
                    );

                    PERFORM net.http_post(
                        url := '{webhook_url}',
                        body := payload,
                        headers := '{{"Content-Type": "application/json", "x-webhook-secret": "{webhook_secret}"}}'::jsonb,
                        params := '{{}}'::jsonb,
                        timeout_milliseconds := 10000
                    );
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            """))

            # 4. Bind trigger to storage.objects table
            print("4. Binding trg_after_file_upload trigger on storage.objects...")
            conn.execute(text("DROP TRIGGER IF EXISTS trg_after_file_upload ON storage.objects;"))
            conn.execute(text("""
                CREATE TRIGGER trg_after_file_upload
                AFTER INSERT ON storage.objects
                FOR EACH ROW
                WHEN (NEW.bucket_id = 'private' AND NEW.name LIKE 'evidence/%')
                EXECUTE FUNCTION public.notify_file_upload();
            """))

            # 5. Enable Realtime Replication on assessment_files
            print("5. Enabling Supabase Realtime replication on assessment_files...")
            # Checks if publication table relation already exists to prevent duplicate key errors
            conn.execute(text("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_publication_rel pr 
                        JOIN pg_class c ON pr.prrelid = c.oid 
                        JOIN pg_publication p ON pr.prpubid = p.oid 
                        WHERE p.pubname = 'supabase_realtime' AND c.relname = 'assessment_files'
                    ) THEN
                        ALTER PUBLICATION supabase_realtime ADD TABLE assessment_files;
                    END IF;
                END
                $$;
            """))

            # 6. Configure Storage Policies on storage.objects
            print("6. Configuring Storage Row-Level Security policies on storage.objects...")
            
            conn.execute(text("DROP POLICY IF EXISTS storage_private_select_policy ON storage.objects;"))
            conn.execute(text("""
                CREATE POLICY storage_private_select_policy ON storage.objects
                FOR SELECT
                TO authenticated
                USING (
                    bucket_id = 'private' AND (
                        name LIKE 'evidence/' || auth.uid()::text || '/%' OR
                        auth.jwt() -> 'app_metadata' ->> 'role' = 'nodal'
                    )
                );
            """))

            conn.execute(text("DROP POLICY IF EXISTS storage_private_insert_policy ON storage.objects;"))
            conn.execute(text("""
                CREATE POLICY storage_private_insert_policy ON storage.objects
                FOR INSERT
                TO authenticated
                WITH CHECK (
                    bucket_id = 'private' AND
                    name LIKE 'evidence/' || auth.uid()::text || '/%'
                );
            """))

            conn.execute(text("DROP POLICY IF EXISTS storage_private_update_policy ON storage.objects;"))
            conn.execute(text("""
                CREATE POLICY storage_private_update_policy ON storage.objects
                FOR UPDATE
                TO authenticated
                USING (
                    bucket_id = 'private' AND
                    name LIKE 'evidence/' || auth.uid()::text || '/%'
                )
                WITH CHECK (
                    bucket_id = 'private' AND
                    name LIKE 'evidence/' || auth.uid()::text || '/%'
                );
            """))

            conn.execute(text("DROP POLICY IF EXISTS storage_private_delete_policy ON storage.objects;"))
            conn.execute(text("""
                CREATE POLICY storage_private_delete_policy ON storage.objects
                FOR DELETE
                TO authenticated
                USING (
                    bucket_id = 'private' AND
                    name LIKE 'evidence/' || auth.uid()::text || '/%'
                );
            """))

            # 7. Restore Storage Schema Permissions and Default Grants
            print("7. Restoring schema, table, sequence, and function privileges on storage schema...")
            conn.execute(text("GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;"))
            conn.execute(text("GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, service_role;"))
            conn.execute(text("GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon, authenticated, service_role;"))
            conn.execute(text("GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA storage TO anon, authenticated, service_role;"))

            conn.execute(text("ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON TABLES TO anon, authenticated, service_role;"))
            conn.execute(text("ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;"))
            conn.execute(text("ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;"))

            trans.commit()
            print("\nSupabase storage bucket, webhooks, realtime settings, storage RLS, and schema permissions configured successfully!")
        except Exception as e:
            trans.rollback()
            print(f"\nError: Database configuration failed: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
