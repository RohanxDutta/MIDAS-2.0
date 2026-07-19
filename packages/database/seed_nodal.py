import os
import sys
import requests
from pathlib import Path

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

def seed_nodal_user():
    load_env()
    
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not service_role_key:
        print("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in your .env file.")
        sys.exit(1)
        
    admin_users_url = f"{supabase_url}/auth/v1/admin/users"
    headers = {
        "apikey": service_role_key,
        "Authorization": f"Bearer {service_role_key}",
        "Content-Type": "application/json"
    }
    
    # We want to create the nodal user
    user_payload = {
        "email": "nodal@gmail.com",
        "password": "test123",
        "email_confirm": True, # Bypasses email validation link confirmation
        "app_metadata": {
            "role": "nodal" # Server-only app_metadata — tamper-proof, not writable by client
        }
    }
    
    print(f"Checking if user 'nodal@gmail.com' already exists...")
    
    # First, list users to see if it exists
    # The Admin API supports listing users
    try:
        response = requests.get(admin_users_url, headers=headers)
        if response.status_code == 200:
            users_list = response.json()
            # If it's a list or a dict containing 'users'
            users = users_list.get("users", []) if isinstance(users_list, dict) else users_list
            for user in users:
                if user.get("email") == "nodal@gmail.com":
                    print("User 'nodal@gmail.com' already exists. Ensuring metadata role is 'nodal'...")
                    user_id = user.get("id")
                    update_url = f"{admin_users_url}/{user_id}"
                    update_payload = {
                        "app_metadata": {
                            "role": "nodal"
                        }
                    }
                    update_resp = requests.put(update_url, json=update_payload, headers=headers)
                    if update_resp.status_code == 200:
                        print("Success: Metadata role updated to 'nodal'.")
                    else:
                        print(f"Warning: Failed to update metadata role: {update_resp.text}")
                    return
        elif response.status_code == 404:
            # Listing might not be supported or restricted, we will proceed directly to create and catch conflict
            pass
        else:
            print(f"Warning: Failed to list users ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"Warning: Error listing users: {e}")

    print(f"Creating user 'nodal@gmail.com' with admin API...")
    response = requests.post(admin_users_url, json=user_payload, headers=headers)
    
    if response.status_code in [200, 201]:
        print("Success: Nodal Team user (nodal@gmail.com) created and confirmed.")
    elif response.status_code == 400 and "already exists" in response.text.lower():
        print("User 'nodal@gmail.com' already exists. Skipping creation.")
    else:
        print(f"Error creating user ({response.status_code}): {response.text}")
        sys.exit(1)

if __name__ == "__main__":
    seed_nodal_user()
