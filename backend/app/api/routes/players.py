"""
Player API endpoints for the Baseball Stats Dashboard.

This module provides API endpoints for managing baseball player data, including:
- Retrieving all players
- Retrieving a specific player
- Adding new players
- Updating existing players
- Deleting players
- Generating AI-enhanced descriptions for players
- Loading sample player data

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
import httpx
from openai import OpenAI

from app.models.player import Player, PlayerWithDescription
from app.db.mongodb import get_collection
from app.core.config import settings

router = APIRouter(prefix="/players", tags=["Players"])

# Initialize OpenAI client
openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)


async def generate_player_description(player: Dict[str, Any]) -> str:
    """
    Generate an AI-enhanced description for a baseball player using OpenAI.
    
    Args:
        player: A dictionary containing player information.
        
    Returns:
        str: An AI-generated description of the player.
        
    Raises:
        Exception: If there's an error communicating with the OpenAI API.
    """
    try:
        response = openai_client.completions.create(
            model="gpt-3.5-turbo-instruct",
            prompt=f"Write a detailed description for the baseball player: {player['Player']}. Include information about their {player['Year']} season when they had {player['Hits']} hits at age {player['AgeThatYear']}.",
            max_tokens=250
        )
        return response.choices[0].text.strip()
    except Exception as e:
        # Return a default description in case of API failure
        return f"No AI-generated description available for {player['Player']} at this time. During the {player['Year']} season, they recorded {player['Hits']} hits at age {player['AgeThatYear']}."


@router.get("/", response_model=List[Player])
async def get_players():
    """
    Retrieve all baseball players from the database.
    
    Returns:
        List[Player]: A list of all baseball players.
        
    Example:
        ```
        GET /api/players/
        ```
    """
    collection = get_collection()
    players = await collection.find().to_list(1000)
    return players


@router.get("/{id}", response_model=Player)
async def get_player(id: int):
    """
    Retrieve a specific baseball player by ID.
    
    Args:
        id: The unique identifier of the player.
        
    Returns:
        Player: The requested player information.
        
    Raises:
        HTTPException: If the player with the specified ID is not found.
        
    Example:
        ```
        GET /api/players/1
        ```
    """
    collection = get_collection()
    player = await collection.find_one({"id": id})
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with ID {id} not found"
        )
    return player


@router.get("/description/{id}", response_model=PlayerWithDescription)
async def describe_player(id: int):
    """
    Retrieve a player with an AI-generated description.
    
    This endpoint fetches a player by ID and enhances it with an AI-generated
    description using OpenAI's GPT model.
    
    Args:
        id: The unique identifier of the player.
        
    Returns:
        PlayerWithDescription: The player information with an AI-generated description.
        
    Raises:
        HTTPException: If the player is not found or if there's an error generating the description.
        
    Example:
        ```
        GET /api/players/description/1
        ```
    """
    collection = get_collection()
    player = await collection.find_one({"id": id})
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with ID {id} not found"
        )
    
    # Generate description using OpenAI
    try:
        description = await generate_player_description(player)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating description: {str(e)}"
        )
    
    player_with_description = PlayerWithDescription(**player, description=description)
    return player_with_description


@router.post("/{id}", status_code=status.HTTP_201_CREATED)
async def add_player(id: int, player: Player):
    """
    Add a new baseball player to the database.
    
    Args:
        id: The unique identifier for the new player.
        player: The player information to add.
        
    Returns:
        dict: A message confirming the player was added successfully.
        
    Raises:
        HTTPException: If a player with the specified ID already exists or if there's an error adding the player.
        
    Example:
        ```
        POST /api/players/3
        {
            "Player": "Juan Soto",
            "Year": 2022,
            "AgeThatYear": 23,
            "Hits": 156,
            "Rank": "12"
        }
        ```
    """
    collection = get_collection()
    
    # Check if player with this ID already exists
    existing_player = await collection.find_one({"id": id})
    if existing_player:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Player with ID {id} already exists"
        )
    
    # Insert new player
    result = await collection.insert_one(player.model_dump())
    if not result.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add player"
        )
    
    return {"message": "Player added successfully", "player_id": id}


@router.put("/{id}", response_model=Player)
async def update_player(id: int, player: Player):
    """
    Update an existing baseball player.
    
    Args:
        id: The unique identifier of the player to update.
        player: The updated player information.
        
    Returns:
        Player: The updated player information.
        
    Raises:
        HTTPException: If the player is not found or if there's an error updating the player.
        
    Example:
        ```
        PUT /api/players/2
        {
            "Player": "Mookie Betts",
            "Year": 2022,
            "AgeThatYear": 29,
            "Hits": 178,
            "Rank": "5"
        }
        ```
    """
    collection = get_collection()
    
    # Check if player exists
    existing_player = await collection.find_one({"id": id})
    if not existing_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with ID {id} not found"
        )
    
    # Update player
    result = await collection.replace_one({"id": id}, player.model_dump())
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update player"
        )
    
    return player


@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_player(id: int):
    """
    Delete a baseball player from the database.
    
    Args:
        id: The unique identifier of the player to delete.
        
    Returns:
        dict: A message confirming the player was deleted successfully.
        
    Raises:
        HTTPException: If the player is not found.
        
    Example:
        ```
        DELETE /api/players/3
        ```
    """
    collection = get_collection()
    
    # Delete player
    result = await collection.delete_one({"id": id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player with ID {id} not found"
        )
    
    return {"message": f"Player with ID {id} deleted successfully"}


@router.get("/load", status_code=status.HTTP_200_OK)
async def load_players():
    """
    Load sample baseball player data from an external API.
    
    This endpoint fetches baseball player data from an external API and populates
    the database with the retrieved data. It only loads data if the collection is empty.
    
    Returns:
        dict: A message indicating the number of players loaded or that the collection already contains data.
        
    Raises:
        HTTPException: If there's an error fetching data from the external API or inserting it into the database.
        
    Example:
        ```
        GET /api/players/load
        ```
    """
    collection = get_collection()
    
    # Check if collection is empty
    count = await collection.count_documents({})
    if count > 0:
        return {"message": f"Collection already contains {count} players"}
    
    # Fetch players from external API
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(settings.BASEBALL_API_URL)
            response.raise_for_status()
            players_data = response.json()
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching data: {str(e)}"
        )
    
    # Insert players into database
    if isinstance(players_data, list) and len(players_data) > 0:
        # Calculate missing ranks if needed
        for player in players_data:
            if not player.get("Rank"):
                # Simple ranking based on hits (higher hits = better rank)
                player["Rank"] = str(player.get("Hits", 0))
        
        # Insert players
        result = await collection.insert_many(players_data)
        if not result.acknowledged:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to insert players"
            )
        
        return {"message": f"Successfully loaded {len(players_data)} players"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid data format received from API"
        )
