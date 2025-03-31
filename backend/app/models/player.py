"""
Player models for the Baseball Stats Dashboard.

This module defines the Pydantic models used for data validation and serialization
of baseball player data throughout the application.

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
from pydantic import BaseModel, Field
from typing import Optional

class Player(BaseModel):
    """
    Player model representing a baseball player's statistics
    """
    id: int
    Player: str
    AgeThatYear: str
    Hits: int
    Year: int
    Bats: str
    Rank: str
    
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "Player": "Ichiro Suzuki",
                "AgeThatYear": "30",
                "Hits": 262,
                "Year": 2004,
                "Bats": "318",
                "Rank": "1"
            }
        }

class PlayerWithDescription(Player):
    """
    Extended Player model that includes an AI-generated description
    """
    description: str
    
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "Player": "Ichiro Suzuki",
                "AgeThatYear": "30",
                "Hits": 262,
                "Year": 2004,
                "Bats": "318",
                "Rank": "1",
                "description": "Ichiro Suzuki is a legendary Japanese baseball player known for his exceptional hitting ability and defensive skills. In 2004, at the age of 30, he set the MLB single-season hit record with 262 hits, demonstrating his remarkable consistency and bat control."
            }
        }

class PlayerCreate(BaseModel):
    """
    Model for creating a new player
    """
    Player: str
    AgeThatYear: str
    Hits: int
    Year: int
    Bats: str
    Rank: str
    
    class Config:
        schema_extra = {
            "example": {
                "Player": "Mike Trout",
                "AgeThatYear": "28",
                "Hits": 185,
                "Year": 2019,
                "Bats": "291",
                "Rank": "25"
            }
        }

class PlayerUpdate(BaseModel):
    """
    Model for updating an existing player
    """
    Player: Optional[str] = None
    AgeThatYear: Optional[str] = None
    Hits: Optional[int] = None
    Year: Optional[int] = None
    Bats: Optional[str] = None
    Rank: Optional[str] = None
