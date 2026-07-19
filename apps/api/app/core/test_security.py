import os
import sys
import requests
import uuid

# Base URL for FastAPI local server
base_url = "http://localhost:8000/api/v1"

# Dynamically load config values
sys.path.append(r"c:\Users\medha\OneDrive\Desktop\MIDAS-2.0\apps\api")
from app.core.config import settings

supabase_url = settings.NEXT_PUBLIC_SUPABASE_URL

# Read the root .env directly to find NEXT_PUBLIC_SUPABASE_ANON_KEY
anon_key = ""
with open(r"c:\Users\medha\OneDrive\Desktop\MIDAS-2.0\.env", "r") as f:
    for line in f:
        if "NEXT_PUBLIC_SUPABASE_ANON_KEY=" in line:
            anon_key = line.split("=", 1)[1].strip().strip('"').strip("'")

# 0. Log in programmatically to get a valid JWT
print("0. Authenticating with Supabase...")
login_url = f"{supabase_url}/auth/v1/token?grant_type=password"
headers = {
    "apikey": anon_key,
    "Content-Type": "application/json"
}
payload = {
    "email": "user@gmail.com",
    "password": "test123"
}
resp = requests.post(login_url, json=payload, headers=headers)
if resp.status_code != 200:
    print(f"Failed to log in: {resp.text}")
    sys.exit(1)

access_token = resp.json().get("access_token")
user_id = resp.json().get("user", {}).get("id")
print(f"Logged in successfully. User ID: {user_id}\n")

auth_headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# 1. Test Pydantic score validation (Vulnerability B)
print("1. Testing score boundaries validation (expecting 422)...")
payload_invalid_score = {
    "dataset_title": "Test Title",
    "version_doi_handle": "10.1000/xyz123",
    "submitting_pi_custodian": "PI Name",
    "date_of_assessment": "2026-07-18",
    "assessor_name_affiliation": "Affiliation",
    "answers": [
        {"domain_id": 1, "score": 99, "factual_description": "invalid score"}
    ],
    "domain_11_na": False,
    "identification_risk": 5,
    "sensitivity_multiplier": 1.0,
    "dataset_type": "unstructured",
    "dataset_link": "http://example.com"
}
response = requests.post(f"{base_url}/submit", json=payload_invalid_score, headers=auth_headers)
print(f"Response status: {response.status_code}")
print(f"Response body: {response.text}\n")

# 2. Test filename path traversal sanitization (Vulnerability C)
print("2. Testing filename path traversal sanitization...")
payload_traversal = {
    "file_name": "../../../../malicious_file.csv",
    "file_size": 1024
}
response = requests.post(f"{base_url}/upload-url", json=payload_traversal, headers=auth_headers)
print(f"Response status: {response.status_code}")
res_json = response.json()
upload_url = res_json.get("upload_url")
print(f"Returned upload_url: {upload_url}")

if upload_url:
    print("Testing HTTP PUT upload to returned upload_url...")
    upload_res = requests.put(upload_url, data=b"column1,column2\nval1,val2", headers={"Content-Type": "text/csv"})
    print(f"PUT Upload status: {upload_res.status_code}")
    print(f"PUT Upload response: {upload_res.text[:150]}\n")

# 3. Test IDOR File Ownership / Non-existent File Linking check (Vulnerability A)
print("3. Testing file linking ownership / IDOR check (expecting 400)...")
random_file_uuid = str(uuid.uuid4())
payload_submit_with_unowned_file = {
    "dataset_title": "Test Title",
    "version_doi_handle": "10.1000/xyz123",
    "submitting_pi_custodian": "PI Name",
    "date_of_assessment": "2026-07-18",
    "assessor_name_affiliation": "Affiliation",
    "answers": [
        {"domain_id": i, "score": 2, "factual_description": "valid score"} for i in range(1, 16)
    ],
    "domain_11_na": False,
    "identification_risk": 15,
    "sensitivity_multiplier": 1.5,
    "dataset_type": "structured",
    "uploaded_file_ids": [random_file_uuid]
}
response = requests.post(f"{base_url}/submit", json=payload_submit_with_unowned_file, headers=auth_headers)
print(f"Response status: {response.status_code}")
print(f"Response body: {response.text}\n")
