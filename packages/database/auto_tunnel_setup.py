import os
import sys
import json
import time
import subprocess
import urllib.request
from pathlib import Path

# Add project root to path
db_pkg_dir = Path(__file__).parent.resolve()
project_root = db_pkg_dir.parent.parent.resolve()

def update_env_file(key: str, value: str):
    env_path = project_root / ".env"
    if not env_path.exists():
        print(f"Error: .env file not found at {env_path}")
        return

    lines = env_path.read_text().splitlines()
    key_found = False
    new_lines = []

    for line in lines:
        if line.strip().startswith(f"{key}="):
            new_lines.append(f'{key}="{value}"')
            key_found = True
        else:
            new_lines.append(line)

    if not key_found:
        new_lines.append(f'{key}="{value}"')

    env_path.write_text("\n".join(new_lines) + "\n")
    print(f"Updated .env: {key}=\"{value}\"")

def get_ngrok_tunnel_url():
    """Queries ngrok's local API (http://127.0.0.1:4040/api/tunnels) for an active public HTTPS URL."""
    try:
        req = urllib.request.Request("http://127.0.0.1:4040/api/tunnels")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            tunnels = data.get("tunnels", [])
            for t in tunnels:
                public_url = t.get("public_url", "")
                if public_url.startswith("https://"):
                    return public_url
                if public_url.startswith("http://"):
                    return public_url.replace("http://", "https://")
    except Exception:
        return None

def main():
    print("==================================================")
    print("       MIDAS 2.0 AUTOMATED TUNNEL & WEBHOOK SETUP ")
    print("==================================================")

    url = get_ngrok_tunnel_url()
    
    if not url:
        print("\n[INFO] Ngrok is not running on port 4040. Attempting to start ngrok tunnel on port 8000...")
        try:
            # Launch ngrok as background process
            subprocess.Popen(["ngrok", "http", "8000"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print("Waiting 3 seconds for ngrok tunnel initialization...")
            time.sleep(3)
            url = get_ngrok_tunnel_url()
        except Exception as e:
            print(f"[ERROR] Could not start ngrok automatically: {e}")

    if not url:
        print("\n[ERROR] Unable to detect active Ngrok tunnel.")
        print("Please run 'npm run tunnel' in a separate terminal and rerun this script.")
        sys.exit(1)

    webhook_target_url = f"{url.rstrip('/')}/api/v1/webhooks/storage"
    print(f"\n[SUCCESS] Detected active Ngrok Tunnel: {url}")
    print(f"Target Webhook URL: {webhook_target_url}")

    # 1. Automatically update .env with new target URL
    update_env_file("WEBHOOK_TARGET_URL", webhook_target_url)

    # 2. Automatically execute setup_supabase_extras.py to update Supabase Cloud DB trigger
    print("\nExecuting Supabase Cloud DB trigger update...")
    from setup_supabase_extras import main as run_setup_extras
    run_setup_extras()

    print("\n==================================================")
    print("🎉 AUTOMATED SETUP COMPLETE! Your local environment")
    print("   is now in live sync with Supabase Cloud webhooks.")
    print("==================================================")

if __name__ == "__main__":
    main()
