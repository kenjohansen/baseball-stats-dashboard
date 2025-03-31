Testing
=======

This section describes the testing approach for the Baseball Stats Dashboard API, including unit tests, integration tests, and code quality tools.

Test Strategy
------------

The Baseball Stats Dashboard API follows a comprehensive testing strategy:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test the interaction between components
3. **API Tests**: Test the API endpoints
4. **Code Quality**: Ensure code meets quality standards using linters and type checkers

Running Tests
------------

To run the tests, use the following commands:

.. code-block:: bash

    # Run all tests
    pytest

    # Run tests with coverage report
    pytest --cov=app

    # Run tests and generate HTML coverage report
    pytest --cov=app --cov-report=html

Test Structure
-------------

The tests are organized in the ``tests`` directory with the following structure:

.. code-block:: text

    tests/
    ├── __init__.py
    ├── conftest.py           # Test configuration and fixtures
    ├── test_player_api.py    # Tests for player API endpoints
    ├── test_ai_integration.py # Tests for AI integration
    └── test_db.py            # Tests for database operations

Test Fixtures
------------

Common test fixtures are defined in ``conftest.py``:

- ``test_client``: A FastAPI TestClient for making API requests
- ``mock_mongo``: A mock MongoDB collection for testing database operations
- ``event_loop``: An event loop for testing async code

Example Test
-----------

Here's an example of a test for the GET /api/players endpoint:

.. code-block:: python

    @pytest.mark.asyncio
    async def test_get_players(test_client, mock_mongo):
        """
        Test the GET /api/players endpoint.
        
        Args:
            test_client: A test client for the FastAPI application.
            mock_mongo: A mock MongoDB collection.
        """
        # Setup mock data
        mock_players = [
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
        
        # Configure the mock to return the test data
        mock_mongo.find.return_value.to_list.return_value = mock_players
        
        # Make the request
        response = test_client.get("/api/players")
        
        # Verify the response
        assert response.status_code == 200
        assert len(response.json()) == 2
        assert response.json()[0]["name"] == "Mike Trout"
        assert response.json()[1]["name"] == "Mookie Betts"

Mocking
-------

The tests use the ``unittest.mock`` module to mock external dependencies:

- MongoDB: Mock the database operations to avoid requiring a real database
- OpenAI: Mock the API calls to avoid making real API requests

Code Quality Tools
-----------------

The following tools are used to ensure code quality:

- **Black**: Code formatter
- **isort**: Import sorter
- **Flake8**: Linter
- **mypy**: Type checker

To run the code quality tools:

.. code-block:: bash

    # Format code
    black app tests

    # Sort imports
    isort app tests

    # Lint code
    flake8 app tests

    # Type check
    mypy app

Continuous Integration
--------------------

The tests are automatically run in a CI/CD pipeline on every push to the repository. The pipeline includes:

1. Running all tests
2. Generating a coverage report
3. Running code quality checks
4. Building and testing the Docker image

The CI/CD pipeline ensures that all code changes maintain the quality standards and do not introduce regressions.
