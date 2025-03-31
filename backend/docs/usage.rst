Usage
=====

This section provides guidance on how to use the Baseball Stats Dashboard API for common operations.

API Overview
-----------

The Baseball Stats Dashboard API provides RESTful endpoints for managing baseball player data and generating AI-enhanced player descriptions. The API is built with FastAPI and follows modern API design principles.

Authentication
-------------

Currently, the API does not require authentication for local development and demonstration purposes. In a production environment, you would want to implement authentication using JWT tokens, API keys, or OAuth2.

Base URL
--------

When running locally, the API is available at:

.. code-block:: text

    http://localhost:8000

When deployed to Kubernetes, the API is available at:

.. code-block:: text

    https://baseball-stats.kenjohansen.dev/api

Common Operations
---------------

Retrieving All Players
~~~~~~~~~~~~~~~~~~~~

To retrieve a list of all players:

.. code-block:: bash

    curl -X GET http://localhost:8000/api/players

You can also use query parameters for pagination and sorting:

.. code-block:: bash

    curl -X GET "http://localhost:8000/api/players?skip=0&limit=10&sort_by=batting_average&order=desc"

Retrieving a Specific Player
~~~~~~~~~~~~~~~~~~~~~~~~~~

To retrieve a specific player by ID:

.. code-block:: bash

    curl -X GET http://localhost:8000/api/players/1

Creating a New Player
~~~~~~~~~~~~~~~~~~~

To create a new player:

.. code-block:: bash

    curl -X POST http://localhost:8000/api/players \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Juan Soto",
        "team": "San Diego Padres",
        "position": "RF",
        "batting_average": 0.275,
        "home_runs": 32,
        "rbi": 89,
        "stolen_bases": 5,
        "war": 6.9
      }'

Updating a Player
~~~~~~~~~~~~~~~

To update an existing player:

.. code-block:: bash

    curl -X PUT http://localhost:8000/api/players/3 \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Juan Soto",
        "team": "San Diego Padres",
        "position": "RF",
        "batting_average": 0.280,
        "home_runs": 35,
        "rbi": 95,
        "stolen_bases": 7,
        "war": 7.2
      }'

Deleting a Player
~~~~~~~~~~~~~~~

To delete a player:

.. code-block:: bash

    curl -X DELETE http://localhost:8000/api/players/3

Generating an AI Description
~~~~~~~~~~~~~~~~~~~~~~~~~~

To generate an AI-enhanced description for a player:

.. code-block:: bash

    curl -X GET http://localhost:8000/api/players/1/description

Python Client Example
-------------------

Here's an example of how to use the API with Python and the `requests` library:

.. code-block:: python

    import requests
    import json

    BASE_URL = "http://localhost:8000/api"

    # Get all players
    def get_all_players():
        response = requests.get(f"{BASE_URL}/players")
        return response.json()

    # Get a specific player
    def get_player(player_id):
        response = requests.get(f"{BASE_URL}/players/{player_id}")
        if response.status_code == 404:
            return None
        return response.json()

    # Create a new player
    def create_player(player_data):
        response = requests.post(
            f"{BASE_URL}/players",
            headers={"Content-Type": "application/json"},
            data=json.dumps(player_data)
        )
        return response.json()

    # Update a player
    def update_player(player_id, player_data):
        response = requests.put(
            f"{BASE_URL}/players/{player_id}",
            headers={"Content-Type": "application/json"},
            data=json.dumps(player_data)
        )
        if response.status_code == 404:
            return None
        return response.json()

    # Delete a player
    def delete_player(player_id):
        response = requests.delete(f"{BASE_URL}/players/{player_id}")
        return response.status_code == 204

    # Generate an AI description for a player
    def generate_description(player_id):
        response = requests.get(f"{BASE_URL}/players/{player_id}/description")
        if response.status_code == 404:
            return None
        return response.json()

    # Example usage
    if __name__ == "__main__":
        # Get all players
        players = get_all_players()
        print(f"Found {len(players)} players")

        # Create a new player
        new_player = {
            "name": "Juan Soto",
            "team": "San Diego Padres",
            "position": "RF",
            "batting_average": 0.275,
            "home_runs": 32,
            "rbi": 89,
            "stolen_bases": 5,
            "war": 6.9
        }
        created_player = create_player(new_player)
        print(f"Created player with ID: {created_player['id']}")

        # Generate a description
        player_with_description = generate_description(created_player['id'])
        print(f"Description: {player_with_description['description']}")

JavaScript Client Example
-----------------------

Here's an example of how to use the API with JavaScript and the `fetch` API:

.. code-block:: javascript

    const BASE_URL = 'http://localhost:8000/api';

    // Get all players
    async function getAllPlayers() {
      const response = await fetch(`${BASE_URL}/players`);
      return await response.json();
    }

    // Get a specific player
    async function getPlayer(playerId) {
      const response = await fetch(`${BASE_URL}/players/${playerId}`);
      if (response.status === 404) {
        return null;
      }
      return await response.json();
    }

    // Create a new player
    async function createPlayer(playerData) {
      const response = await fetch(`${BASE_URL}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
      });
      return await response.json();
    }

    // Update a player
    async function updatePlayer(playerId, playerData) {
      const response = await fetch(`${BASE_URL}/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
      });
      if (response.status === 404) {
        return null;
      }
      return await response.json();
    }

    // Delete a player
    async function deletePlayer(playerId) {
      const response = await fetch(`${BASE_URL}/players/${playerId}`, {
        method: 'DELETE',
      });
      return response.status === 204;
    }

    // Generate an AI description for a player
    async function generateDescription(playerId) {
      const response = await fetch(`${BASE_URL}/players/${playerId}/description`);
      if (response.status === 404) {
        return null;
      }
      return await response.json();
    }

    // Example usage
    async function main() {
      try {
        // Get all players
        const players = await getAllPlayers();
        console.log(`Found ${players.length} players`);

        // Create a new player
        const newPlayer = {
          name: 'Juan Soto',
          team: 'San Diego Padres',
          position: 'RF',
          batting_average: 0.275,
          home_runs: 32,
          rbi: 89,
          stolen_bases: 5,
          war: 6.9,
        };
        const createdPlayer = await createPlayer(newPlayer);
        console.log(`Created player with ID: ${createdPlayer.id}`);

        // Generate a description
        const playerWithDescription = await generateDescription(createdPlayer.id);
        console.log(`Description: ${playerWithDescription.description}`);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    main();
