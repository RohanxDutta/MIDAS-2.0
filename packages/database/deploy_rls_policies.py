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
        
    engine = create_engine(db_url)
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("Enabling Row Level Security (RLS) on tables...")
            conn.execute(text("ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;"))
            conn.execute(text("ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;"))
            conn.execute(text("ALTER TABLE assessment_files ENABLE ROW LEVEL SECURITY;"))
            
            # --- ASSESSMENTS POLICIES ---
            print("Creating RLS policies for 'assessments' table...")
            conn.execute(text("DROP POLICY IF EXISTS assessments_select_policy ON assessments;"))
            conn.execute(text("""
                CREATE POLICY assessments_select_policy ON assessments
                FOR SELECT
                USING (
                    auth.uid() = user_id OR 
                    auth.jwt() ->> 'email' = 'nodal@gmail.com'
                );
            """))
            
            conn.execute(text("DROP POLICY IF EXISTS assessments_insert_policy ON assessments;"))
            conn.execute(text("""
                CREATE POLICY assessments_insert_policy ON assessments
                FOR INSERT
                WITH CHECK (
                    auth.uid() = user_id
                );
            """))
            
            conn.execute(text("DROP POLICY IF EXISTS assessments_update_policy ON assessments;"))
            conn.execute(text("""
                CREATE POLICY assessments_update_policy ON assessments
                FOR UPDATE
                USING (
                    auth.uid() = user_id
                )
                WITH CHECK (
                    auth.uid() = user_id
                );
            """))
            
            conn.execute(text("DROP POLICY IF EXISTS assessments_delete_policy ON assessments;"))
            conn.execute(text("""
                CREATE POLICY assessments_delete_policy ON assessments
                FOR DELETE
                USING (
                    auth.uid() = user_id
                );
            """))
            
            # --- ASSESSMENT_ANSWERS POLICIES ---
            print("Creating RLS policies for 'assessment_answers' table...")
            conn.execute(text("DROP POLICY IF EXISTS answers_all_policy ON assessment_answers;"))
            conn.execute(text("""
                CREATE POLICY answers_all_policy ON assessment_answers
                FOR ALL
                USING (
                    auth.jwt() ->> 'email' = 'nodal@gmail.com' OR
                    EXISTS (
                        SELECT 1 FROM assessments 
                        WHERE assessments.id = assessment_answers.assessment_id 
                        AND assessments.user_id = auth.uid()
                    )
                );
            """))
            
            # --- ASSESSMENT_FILES POLICIES ---
            print("Creating RLS policies for 'assessment_files' table...")
            conn.execute(text("DROP POLICY IF EXISTS files_all_policy ON assessment_files;"))
            conn.execute(text("""
                CREATE POLICY files_all_policy ON assessment_files
                FOR ALL
                USING (
                    auth.jwt() ->> 'email' = 'nodal@gmail.com' OR
                    (assessment_id = '00000000-0000-0000-0000-000000000000'::uuid AND split_part(storage_path, '/', 2)::uuid = auth.uid()) OR
                    EXISTS (
                        SELECT 1 FROM assessments 
                        WHERE assessments.id = assessment_files.assessment_id 
                        AND assessments.user_id = auth.uid()
                    )
                );
            """))
            
            trans.commit()
            print("Row Level Security (RLS) policies successfully configured!")
        except Exception as e:
            trans.rollback()
            print(f"Error executing database RLS configuration: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
