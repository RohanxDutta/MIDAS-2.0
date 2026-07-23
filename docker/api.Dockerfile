FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy packages and dependencies from root context
COPY packages/database /app/packages/database
COPY apps/api/requirements.txt /app/apps/api/requirements.txt

# Install shared database package and backend requirements
RUN pip install --no-cache-dir -e /app/packages/database
RUN pip install --no-cache-dir -r /app/apps/api/requirements.txt

# Copy application source
COPY apps/api /app/apps/api

WORKDIR /app/apps/api

# Expose port 8000 for FastAPI
EXPOSE 8000

# Start FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
