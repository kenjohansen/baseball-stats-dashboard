# Baseball Stats Dashboard - Backend

This directory contains the Python FastAPI backend for the Baseball Stats Dashboard application.

## Structure

- `app/` - Main application package
  - `main.py` - Application entry point
  - `api/` - API endpoints
  - `models/` - Database models
  - `schemas/` - Pydantic schemas for validation
  - `services/` - Business logic and external services
  - `db/` - Database configuration and session management
  - `core/` - Core application configuration
  - `utils/` - Utility functions
- `tests/` - Test suite
- `alembic/` - Database migrations

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload

# Run tests
pytest
```

## Key Features

- RESTful API for baseball player statistics
- Integration with external baseball data API
- OpenAI integration for player descriptions
- Data correction for missing ranking information
- PostgreSQL database for data persistence
- Comprehensive API documentation with Swagger/OpenAPI

## Technologies

- Python 3.10+
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL
- OpenAI API
- pytest
```
