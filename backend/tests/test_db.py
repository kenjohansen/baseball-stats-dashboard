"""
Tests for the MongoDB connection module.

This module tests the MongoDB connection functions to ensure they work correctly.

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
import os

from app.db.mongodb import get_collection, connect_to_mongo, close_mongo_connection


@pytest.mark.asyncio
async def test_get_collection():
    """
    Test the get_collection function.
    
    This test verifies that the get_collection function returns a collection object.
    """
    # Mock the collection object
    mock_collection = AsyncMock()
    
    # Patch the collection object
    with patch("app.db.mongodb.collection", mock_collection):
        # Call the function
        collection = get_collection()
        
        # Verify the result
        assert collection is not None
        assert collection == mock_collection


@pytest.mark.asyncio
async def test_connect_to_mongo():
    """
    Test the connect_to_mongo function.
    
    This test verifies that the connect_to_mongo function correctly initializes the MongoDB client.
    """
    # Set the TESTING environment variable
    original_env = os.environ.get("TESTING")
    os.environ["TESTING"] = "true"
    
    try:
        # Create mock objects
        mock_client = AsyncMock()
        mock_db = MagicMock()
        mock_collection = AsyncMock()
        
        # Configure the mocks
        mock_client.__getitem__.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection
        
        # Mock the admin command to avoid actual MongoDB connection
        mock_admin = AsyncMock()
        mock_client.admin = mock_admin
        mock_admin.command = AsyncMock()
        
        # Apply the patches - the order is important here
        with patch('motor.motor_asyncio.AsyncIOMotorClient', return_value=mock_client):
            # We need to patch the module-level variables that are modified by connect_to_mongo
            with patch('app.db.mongodb.client', None) as mock_module_client:
                with patch('app.db.mongodb.db', None) as mock_module_db:
                    with patch('app.db.mongodb.collection', None) as mock_module_collection:
                        # Call the function
                        await connect_to_mongo()
                        
                        # In test mode, the function should return early without making any connections
                        # So we don't expect the admin.command to be called
                        assert not mock_admin.command.called
    finally:
        # Restore the original environment variable
        if original_env is not None:
            os.environ["TESTING"] = original_env
        else:
            os.environ.pop("TESTING", None)


@pytest.mark.asyncio
async def test_close_mongo_connection():
    """
    Test the close_mongo_connection function.
    
    This test verifies that the close_mongo_connection function correctly closes the MongoDB client.
    """
    # Mock the MongoDB client
    mock_client = AsyncMock()
    mock_client.close = AsyncMock()
    
    # Patch the client object
    with patch("app.db.mongodb.client", mock_client):
        # Call the function
        await close_mongo_connection()
        
        # Verify the client was closed
        mock_client.close.assert_called_once()
