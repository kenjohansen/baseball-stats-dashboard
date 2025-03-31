"""
MongoDB database connection module for the Baseball Stats Dashboard.

This module provides functions for connecting to MongoDB, closing connections,
and retrieving the database collection for player data.

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

# MongoDB client instance
client = None
db = None
collection = None

async def connect_to_mongo():
    """
    Connect to MongoDB and initialize database and collection
    """
    global client, db, collection
    
    # Skip actual connection in testing environment
    if os.environ.get("TESTING") == "true":
        print("Running in test mode, skipping actual MongoDB connection")
        return
    
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client[settings.DATABASE_NAME]
        collection = db[settings.COLLECTION_NAME]
        
        # Verify connection
        await client.admin.command('ping')
        print("Connected to MongoDB successfully")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """
    Close MongoDB connection
    """
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_collection():
    """
    Get the MongoDB collection
    """
    return collection
