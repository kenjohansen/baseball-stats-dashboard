Architecture
============

This section describes the architecture of the Baseball Stats Dashboard application, including the backend API, frontend, and deployment infrastructure.

System Overview
--------------

The Baseball Stats Dashboard is a modern, cloud-native application built using a microservices architecture. The system consists of the following components:

.. image:: _static/architecture_diagram.png
   :alt: Architecture Diagram
   :align: center

1. **React Frontend**: A responsive web application built with React, TypeScript, and Material UI
2. **FastAPI Backend**: A RESTful API built with FastAPI and Python
3. **MongoDB Database**: A NoSQL database for storing player data
4. **OpenAI Integration**: Integration with OpenAI's GPT models for generating player descriptions
5. **Kubernetes Infrastructure**: Containerized deployment using Kubernetes and Helm

Backend Architecture
------------------

The backend follows a layered architecture with clear separation of concerns:

.. code-block:: text

    app/
    ├── api/              # API endpoints
    │   ├── __init__.py
    │   └── players.py    # Player endpoints
    ├── core/             # Core application code
    │   ├── __init__.py
    │   └── config.py     # Configuration settings
    ├── db/               # Database access
    │   ├── __init__.py
    │   └── mongodb.py    # MongoDB connection and operations
    ├── models/           # Data models
    │   ├── __init__.py
    │   └── player.py     # Player model
    ├── services/         # Business logic
    │   ├── __init__.py
    │   └── ai_service.py # AI integration service
    ├── __init__.py
    └── main.py           # Application entry point

Key Design Patterns
------------------

The application implements several design patterns to ensure maintainability, scalability, and testability:

1. **Repository Pattern**: Database access is abstracted through repository functions
2. **Dependency Injection**: Dependencies are injected into API endpoints for better testability
3. **Data Transfer Objects (DTOs)**: Pydantic models define the data structures for API requests and responses
4. **Service Layer**: Business logic is encapsulated in service modules
5. **Configuration Management**: Environment variables are used for configuration

API Design
---------

The API follows RESTful principles:

- Resources are identified by URLs (e.g., `/api/players`)
- HTTP methods define the operations (GET, POST, PUT, DELETE)
- JSON is used for data exchange
- HTTP status codes indicate the result of operations
- HATEOAS principles are followed where appropriate

The API is documented using OpenAPI (Swagger) and is available at the `/docs` endpoint.

Frontend Architecture
-------------------

The frontend is built with React and follows a component-based architecture:

.. code-block:: text

    src/
    ├── components/       # UI components
    │   ├── PlayerDashboard.tsx
    │   ├── PlayerViewDialog.tsx
    │   └── PlayerEditDialog.tsx
    ├── services/         # API client services
    │   └── api.ts
    ├── models/           # TypeScript interfaces
    │   └── player.ts
    ├── hooks/            # Custom React hooks
    │   └── usePlayerData.ts
    ├── utils/            # Utility functions
    │   └── formatters.ts
    ├── App.tsx           # Main application component
    └── index.tsx         # Application entry point

The frontend uses:

- **TypeScript** for type safety
- **Material UI** for responsive design
- **React Query** for data fetching and caching
- **Axios** for HTTP requests
- **React Router** for navigation

Database Design
-------------

The application uses MongoDB, a NoSQL document database, with the following collection:

**Players Collection**:

.. code-block:: json

    {
        "_id": "ObjectId",
        "name": "String",
        "team": "String",
        "position": "String",
        "batting_average": "Number",
        "home_runs": "Number",
        "rbi": "Number",
        "stolen_bases": "Number",
        "war": "Number",
        "description": "String (optional)"
    }

Indexes are created on frequently queried fields such as `name` and `team` to improve query performance.

Deployment Architecture
---------------------

The application is deployed using Kubernetes with a Helm chart that defines:

1. **Deployments** for the frontend and backend
2. **Services** to expose the deployments
3. **Ingress** for routing external traffic
4. **ConfigMaps** and **Secrets** for configuration
5. **Horizontal Pod Autoscalers** for automatic scaling

The Helm chart allows for easy deployment to different environments (development, staging, production) with environment-specific configurations.

Security Considerations
---------------------

The application implements several security measures:

1. **HTTPS**: All traffic is encrypted using TLS
2. **API Key Security**: OpenAI API keys are stored as Kubernetes secrets
3. **Input Validation**: All API inputs are validated using Pydantic models
4. **CORS**: Cross-Origin Resource Sharing is configured to allow only trusted origins
5. **Rate Limiting**: API endpoints are rate-limited to prevent abuse

Performance Optimizations
-----------------------

The application includes several performance optimizations:

1. **Database Indexing**: Indexes on frequently queried fields
2. **Caching**: React Query for frontend caching
3. **Pagination**: API endpoints support pagination for large datasets
4. **Asynchronous Processing**: FastAPI's async support for non-blocking I/O
5. **Horizontal Scaling**: Kubernetes HPA for automatic scaling based on load
