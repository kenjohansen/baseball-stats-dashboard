"""
Tests for the AI integration module.

This module contains tests for the OpenAI integration used to generate player descriptions.

Copyright (c) 2025 Ken Johansen. All rights reserved.
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from app.api.routes.players import generate_player_description
from app.models.player import Player


@pytest.mark.asyncio
async def test_generate_player_description():
    """
    Test the generate_player_description function.
    
    This test verifies that the function correctly formats player data and calls the OpenAI API.
    """
    # Create a test player
    player = Player(
        id=1,
        Player="Mike Trout",
        AgeThatYear="29",
        Hits=147,
        Year=2021,
        Bats="319",
        Rank="15"
    )
    
    # Convert to dictionary for the API function
    player_dict = player.model_dump()
    
    # Mock the OpenAI API response
    mock_completion = MagicMock()
    mock_completion.choices = [MagicMock()]
    mock_completion.choices[0].text = "Mike Trout is one of the best players in baseball, combining power, speed, and defensive prowess."
    
    # Create a mock OpenAI client
    mock_client = MagicMock()
    mock_client.completions.create = AsyncMock(return_value=mock_completion)
    
    # Patch the OpenAI API call
    with patch("app.api.routes.players.openai_client", mock_client):
        # Call the function
        description = await generate_player_description(player_dict)
        
        # Verify the result
        assert "Mike Trout" in description
        assert len(description) > 0


@pytest.mark.asyncio
async def test_generate_player_description_error_handling():
    """
    Test error handling in the generate_player_description function.
    
    This test verifies that the function handles API errors gracefully.
    """
    # Create a test player
    player = Player(
        id=1,
        Player="Mike Trout",
        AgeThatYear="29",
        Hits=147,
        Year=2021,
        Bats="319",
        Rank="15"
    )
    
    # Convert to dictionary for the API function
    player_dict = player.model_dump()
    
    # Create a mock OpenAI client that raises an exception
    mock_client = MagicMock()
    mock_client.completions.create = AsyncMock(side_effect=Exception("API Error"))
    
    # Patch the OpenAI API call
    with patch("app.api.routes.players.openai_client", mock_client):
        # Call the function
        description = await generate_player_description(player_dict)
        
        # Verify the result contains a default description
        assert "No AI-generated description available" in description
        assert player_dict["Player"] in description
        assert str(player_dict["Hits"]) in description
        assert player_dict["AgeThatYear"] in description
