API Reference
=============

This section provides detailed information about the Baseball Stats Dashboard API endpoints.

Player Endpoints
--------------

GET /api/players
~~~~~~~~~~~~~~~

Retrieve a list of all baseball players.

**Parameters:**

* ``skip`` (optional): Number of records to skip (default: 0)
* ``limit`` (optional): Maximum number of records to return (default: 100)
* ``sort_by`` (optional): Field to sort by (default: "name")
* ``order`` (optional): Sort order, either "asc" or "desc" (default: "asc")

**Response:**

.. code-block:: json

    [
        {
            "id": "1",
            "name": "Mike Trout",
            "team": "Los Angeles Angels",
            "position": "CF",
            "batting_average": 0.305,
            "home_runs": 45,
            "rbi": 104,
            "stolen_bases": 11,
            "war": 8.3
        },
        {
            "id": "2",
            "name": "Mookie Betts",
            "team": "Los Angeles Dodgers",
            "position": "RF",
            "batting_average": 0.295,
            "home_runs": 35,
            "rbi": 98,
            "stolen_bases": 14,
            "war": 7.8
        }
    ]

GET /api/players/{player_id}
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Retrieve a specific player by ID.

**Parameters:**

* ``player_id`` (required): The unique identifier of the player

**Response:**

.. code-block:: json

    {
        "id": "1",
        "name": "Mike Trout",
        "team": "Los Angeles Angels",
        "position": "CF",
        "batting_average": 0.305,
        "home_runs": 45,
        "rbi": 104,
        "stolen_bases": 11,
        "war": 8.3
    }

POST /api/players
~~~~~~~~~~~~~~~~

Create a new player.

**Request Body:**

.. code-block:: json

    {
        "name": "Juan Soto",
        "team": "San Diego Padres",
        "position": "RF",
        "batting_average": 0.275,
        "home_runs": 32,
        "rbi": 89,
        "stolen_bases": 5,
        "war": 6.9
    }

**Response:**

.. code-block:: json

    {
        "id": "3",
        "name": "Juan Soto",
        "team": "San Diego Padres",
        "position": "RF",
        "batting_average": 0.275,
        "home_runs": 32,
        "rbi": 89,
        "stolen_bases": 5,
        "war": 6.9
    }

PUT /api/players/{player_id}
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Update an existing player.

**Parameters:**

* ``player_id`` (required): The unique identifier of the player

**Request Body:**

.. code-block:: json

    {
        "name": "Mookie Betts",
        "team": "Los Angeles Dodgers",
        "position": "RF",
        "batting_average": 0.300,
        "home_runs": 36,
        "rbi": 99,
        "stolen_bases": 15,
        "war": 8.0
    }

**Response:**

.. code-block:: json

    {
        "id": "2",
        "name": "Mookie Betts",
        "team": "Los Angeles Dodgers",
        "position": "RF",
        "batting_average": 0.300,
        "home_runs": 36,
        "rbi": 99,
        "stolen_bases": 15,
        "war": 8.0
    }

DELETE /api/players/{player_id}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Delete a player.

**Parameters:**

* ``player_id`` (required): The unique identifier of the player

**Response:**

* Status code 204 (No Content) on success

GET /api/players/{player_id}/description
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Generate an AI-enhanced description for a player.

**Parameters:**

* ``player_id`` (required): The unique identifier of the player

**Response:**

.. code-block:: json

    {
        "id": "1",
        "name": "Mike Trout",
        "team": "Los Angeles Angels",
        "position": "CF",
        "batting_average": 0.305,
        "home_runs": 45,
        "rbi": 104,
        "stolen_bases": 11,
        "war": 8.3,
        "description": "Mike Trout is one of the best players in baseball, combining power, speed, and defensive prowess. His consistent performance has earned him multiple MVP awards and established him as the face of the Los Angeles Angels franchise."
    }

Health Check Endpoint
-------------------

GET /health
~~~~~~~~~~

Check the health status of the API.

**Response:**

.. code-block:: json

    {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": "2025-03-30T15:33:01-07:00"
    }

Error Responses
-------------

The API uses standard HTTP status codes to indicate the success or failure of requests:

* 200 OK: The request was successful
* 201 Created: A new resource was successfully created
* 204 No Content: The request was successful but there is no content to return
* 400 Bad Request: The request was invalid or cannot be served
* 404 Not Found: The requested resource does not exist
* 500 Internal Server Error: An error occurred on the server

Error Response Format:

.. code-block:: json

    {
        "detail": "Error message describing what went wrong"
    }
