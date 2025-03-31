"""
Tests for the player API endpoints.

This module tests the player API endpoints to ensure they respond correctly
to various requests.

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi import status

from app.models.player import Player, PlayerWithDescription


@pytest.mark.asyncio
async def test_get_players(test_client, mock_collection):
    """
    Test the GET /api/players/ endpoint.

    Args:
        test_client: A test client for the FastAPI application.
        mock_collection: A mock MongoDB collection.
    """
    # Setup test data
    mock_players = [
        {
            "id": 1,
            "Player": "Mike Trout",
            "AgeThatYear": "29",
            "Hits": 147,
            "Year": 2021,
            "Bats": "333",
            "Rank": "1"
        },
        {
            "id": 2,
            "Player": "Mookie Betts",
            "AgeThatYear": "28",
            "Hits": 142,
            "Year": 2021,
            "Bats": "301",
            "Rank": "2"
        }
    ]

    # Configure the mock
    mock_collection.find().to_list.return_value = mock_players

    # Make the request
    response = test_client.get("/api/players/")

    # Verify the response
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["Player"] == "Mike Trout"
    assert response.json()[1]["Player"] == "Mookie Betts"


@pytest.mark.asyncio
async def test_get_player(test_client, mock_collection):
    """
    Test the GET /api/players/{player_id} endpoint.

    Args:
        test_client: A test client for the FastAPI application.
        mock_collection: A mock MongoDB collection.
    """
    # Setup test data
    player_id = 1
    mock_player = {
        "id": player_id,
        "Player": "Mike Trout",
        "AgeThatYear": "29",
        "Hits": 147,
        "Year": 2021,
        "Bats": "333",
        "Rank": "1"
    }

    # Configure the mock
    mock_collection.find_one.return_value = mock_player

    # Make the request
    response = test_client.get(f"/api/players/{player_id}")

    # Verify the response
    assert response.status_code == 200
    assert response.json()["id"] == player_id
    assert response.json()["Player"] == "Mike Trout"


@pytest.mark.asyncio
async def test_get_player_not_found(test_client, mock_collection):
    """
    Test the GET /api/players/{player_id} endpoint when the player is not found.

    Args:
        test_client: A test client for the FastAPI application.
        mock_collection: A mock MongoDB collection.
    """
    # Configure the mock
    mock_collection.find_one.return_value = None

    # Make the request
    response = test_client.get("/api/players/999")

    # Verify the response
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


@pytest.mark.asyncio
async def test_create_player(test_client, mock_collection):
    """
    Test the POST /api/players/{id} endpoint.

    Args:
        test_client: A test client for the FastAPI application.
        mock_collection: A mock MongoDB collection.
    """
    # Setup test data
    player_id = 3
    new_player = {
        "id": player_id,
        "Player": "Juan Soto",
        "AgeThatYear": "22",
        "Hits": 157,
        "Year": 2021,
        "Bats": "313",
        "Rank": "10"
    }

    # Mock the insert_one result
    insert_result = AsyncMock()
    insert_result.acknowledged = True
    insert_result.inserted_id = player_id
    mock_collection.insert_one.return_value = insert_result

    # Mock find_one to return None (player doesn't exist yet) and then the created player
    mock_collection.find_one.side_effect = [None, new_player]

    # Make the request
    response = test_client.post(f"/api/players/{player_id}", json=new_player)

    # Verify the response
    assert response.status_code == 201
    assert response.json()["player_id"] == player_id
    assert "added successfully" in response.json()["message"]


@pytest.mark.asyncio
async def test_update_player(test_client, mock_collection):
    """
    Test the PUT /api/players/{player_id} endpoint.

    Args:
        test_client: A test client for the FastAPI application.
        mock_collection: A mock MongoDB collection.
    """
    # Setup test data
    player_id = 2
    updated_player = {
        "id": player_id,
        "Player": "Mookie Betts",
        "AgeThatYear": "28",
        "Hits": 160,  # Updated value
        "Year": 2021,
        "Bats": "305",  # Updated value
        "Rank": "10"   # Updated value
    }

    # Configure the mocks
    # First, mock find_one to return a player (player exists)
    mock_collection.find_one.side_effect = [{"id": player_id}, updated_player]
    
    # Mock the update result
    update_result = AsyncMock()
    update_result.modified_count = 1
    mock_collection.replace_one.return_value = update_result

    # Make the request
    response = test_client.put(f"/api/players/{player_id}", json=updated_player)

    # Verify the response
    assert response.status_code == 200
    assert response.json()["id"] == player_id
    assert response.json()["Hits"] == 160
    assert response.json()["Bats"] == "305"
    assert response.json()["Rank"] == "10"


@pytest.mark.asyncio
async def test_delete_player(test_client, mock_collection):
    """
    Test the DELETE /api/players/{player_id} endpoint.

    Args:
        test_client: A test client for the FastAPI application.
        mock_collection: A mock MongoDB collection.
    """
    # Configure the mock
    delete_result = AsyncMock()
    delete_result.deleted_count = 1
    mock_collection.delete_one.return_value = delete_result

    # Make the request
    response = test_client.delete("/api/players/2")

    # Verify the response
    assert response.status_code == 200
    assert "deleted" in response.json()["message"]


@pytest.mark.asyncio
async def test_generate_description(test_client, mock_collection):
    """
    Test the GET /api/players/description/{player_id} endpoint.

    Args:
        test_client: A test client for the FastAPI application.
        mock_collection: A mock MongoDB collection.
    """
    # Setup test data
    player_id = 1
    mock_player = {
        "id": player_id,
        "Player": "Mike Trout",
        "AgeThatYear": "29",
        "Hits": 147,
        "Year": 2021,
        "Bats": "333",
        "Rank": "1"
    }

    # Configure the mock
    mock_collection.find_one.return_value = mock_player

    # Mock the AI integration
    with patch("app.api.routes.players.generate_player_description") as mock_generate:
        mock_generate.return_value = "Mike Trout is an exceptional player..."
        
        # Make the request
        response = test_client.get(f"/api/players/description/{player_id}")
        
        # Verify the response
        assert response.status_code == 200
        assert response.json()["id"] == player_id
        assert response.json()["Player"] == "Mike Trout"
        assert response.json()["description"] == "Mike Trout is an exceptional player..."
