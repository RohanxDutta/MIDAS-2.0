import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.resolve()))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints import router

app = FastAPI(
    title="MIDAS 2.0 Backend Services",
    description="Python API Engine managing database logic, Redis draft caching, and CSV file checks for the self-assessment form.",
    version="1.0.0"
)

# Configure CORS Middleware
# Next.js will proxy requests via next.config.js to avoid CORS, but this is a helpful fallback
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Next.js domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register main routing routes
app.include_router(router)

@app.get("/healthz")
def health_check():
    """Health check endpoint for Docker container deployment scripts."""
    return {"status": "healthy", "service": "MIDAS FastAPI Backend"}
