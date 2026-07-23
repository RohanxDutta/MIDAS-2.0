import os
import sys
import uuid

import pytest
import requests

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..")
)
sys.path.insert(0, os.path.join(PROJECT_ROOT, "apps", "api"))

from app.core.config import settings

BASE_URL = "http://localhost:8000/api/v1"


def _load_anon_key() -> str:
    env_path = os.path.join(PROJECT_ROOT, ".env")
    with open(env_path, "r") as f:
        for line in f:
            if line.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


@pytest.fixture(scope="session")
def auth_headers():
    supabase_url = settings.NEXT_PUBLIC_SUPABASE_URL
    anon_key = _load_anon_key()
    login_url = f"{supabase_url}/auth/v1/token?grant_type=password"
    headers = {"apikey": anon_key, "Content-Type": "application/json"}
    payload = {"email": "user@gmail.com", "password": "test123"}
    resp = requests.post(login_url, json=payload, headers=headers)
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def test_score_boundary_returns_422(auth_headers):
    payload = {
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
        "dataset_link": "http://example.com",
    }
    resp = requests.post(f"{BASE_URL}/submit", json=payload, headers=auth_headers)
    assert resp.status_code == 422, (
        f"Expected 422 for invalid score, got {resp.status_code}: {resp.text}"
    )


def test_filename_path_traversal_sanitized(auth_headers):
    payload = {"file_name": "../../../../malicious_file.csv", "file_size": 1024}
    resp = requests.post(f"{BASE_URL}/upload-url", json=payload, headers=auth_headers)
    assert resp.status_code == 200, f"upload-url endpoint failed: {resp.text}"
    data = resp.json()
    upload_url = data.get("upload_url", "")
    assert ".." not in upload_url, (
        f"Path traversal escape detected in upload_url: {upload_url}"
    )


def test_idor_unowned_file_id_returns_400(auth_headers):
    random_file_uuid = str(uuid.uuid4())
    payload = {
        "dataset_title": "Test Title",
        "version_doi_handle": "10.1000/xyz123",
        "submitting_pi_custodian": "PI Name",
        "date_of_assessment": "2026-07-18",
        "assessor_name_affiliation": "Affiliation",
        "answers": [
            {"domain_id": i, "score": 2, "factual_description": "valid"}
            for i in range(1, 16)
        ],
        "domain_11_na": False,
        "identification_risk": 15,
        "sensitivity_multiplier": 1.5,
        "dataset_type": "structured",
        "uploaded_file_ids": [random_file_uuid],
    }
    resp = requests.post(f"{BASE_URL}/submit", json=payload, headers=auth_headers)
    assert resp.status_code == 400, (
        f"Expected 400 for unowned file ID, got {resp.status_code}: {resp.text}"
    )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
