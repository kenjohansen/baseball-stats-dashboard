"""
Pytest fixtures for the Baseball Stats Dashboard backend.

This module provides fixtures for testing the FastAPI application, including
mocking MongoDB connections and other dependencies.

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
import os
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock

# Set testing environment variable
os.environ["TESTING"] = "true"

from app.main import app
from app.db.mongodb import get_collection


@pytest.fixture
def test_client():
    """
    Create a test client for the FastAPI application.
    
    Returns:
        TestClient: A test client for the FastAPI application.
    """
    with TestClient(app) as client:
        yield client


@pytest.fixture
def mock_collection():
    """
    Create a mock MongoDB collection.
    
    This fixture mocks the MongoDB collection to avoid actual database connections during tests.
    
    Returns:
        AsyncMock: A mock MongoDB collection.
    """
    # Create an AsyncMock for the collection
    mock = AsyncMock()
    
    # Configure find_one to be an AsyncMock that can be awaited
    mock.find_one = AsyncMock()
    
    # Configure find to return a cursor with to_list method
    mock_cursor = AsyncMock()
    mock_cursor.to_list = AsyncMock()
    mock.find = MagicMock(return_value=mock_cursor)
    
    # Configure other async methods
    mock.insert_one = AsyncMock()
    mock.update_one = AsyncMock()
    mock.replace_one = AsyncMock()
    mock.delete_one = AsyncMock()
    mock.count_documents = AsyncMock()
    
    # Apply the patch to the get_collection function
    with patch("app.db.mongodb.get_collection", return_value=mock):
        with patch("app.api.routes.players.get_collection", return_value=mock):
            yield mock


@pytest.fixture(autouse=True)
def mock_mongodb_connection():
    """
    Mock MongoDB connection to prevent actual connection attempts during tests.
    
    This fixture is automatically used in all tests to prevent any actual MongoDB
    connection attempts, which would fail if MongoDB is not running.
    """
    # Mock the MongoDB client
    mock_client = AsyncMock()
    mock_db = AsyncMock()
    
    # Configure the mocks
    mock_client.__getitem__ = MagicMock(return_value=mock_db)
    mock_db.__getitem__ = MagicMock(return_value=AsyncMock())
    
    # Mock the admin command to avoid actual MongoDB connection
    mock_admin = AsyncMock()
    mock_client.admin = mock_admin
    mock_admin.command = AsyncMock()
    
    # Apply the patches
    with patch('motor.motor_asyncio.AsyncIOMotorClient', return_value=mock_client):
        with patch('app.db.mongodb.client', mock_client):
            with patch('app.db.mongodb.db', mock_db):
                yield
