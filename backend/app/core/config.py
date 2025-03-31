"""
Configuration settings for the Baseball Stats Dashboard API.

This module defines the application settings using Pydantic's BaseSettings class,
which allows for environment variable loading and validation.

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
import os
from typing import List
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Baseball Stats Dashboard API"
    PROJECT_DESCRIPTION: str = "API for managing baseball player statistics with AI-generated descriptions"
    PROJECT_VERSION: str = "1.0.0"
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # MongoDB settings
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "Baseball")
    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME", "Players")
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # External API settings
    BASEBALL_API_URL: str = os.getenv("BASEBALL_API_URL", "https://api.hirefraction.com/api/test/baseball")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()
