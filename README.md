# Baseball Stats Dashboard

A full-stack application that displays baseball player statistics with AI-enhanced player descriptions, built with React, Python FastAPI, and MongoDB.

## 🚀 Features

- **Interactive Player Statistics**: View and sort baseball players by various performance metrics
- **AI-Generated Player Descriptions**: LLM-powered descriptions provide unique insights for each player
- **Editable Player Data**: Update player information through an intuitive interface
- **Data Correction**: Automatically calculates and corrects missing ranking data for hits per season
- **Responsive Design**: Optimized for both desktop and mobile viewing

## 🛠️ Technology Stack

### Frontend
- React with Hooks
- TypeScript for type safety
- Material UI components
- Chart.js for data visualization
- Axios for API communication

### Backend
- Python FastAPI for high-performance API
- MongoDB for data persistence
- Motor for asynchronous MongoDB operations
- Pydantic for data validation
- OpenAI integration for player descriptions

### DevOps
- Docker containers
- Kubernetes deployment
- GitHub Actions for CI/CD
- Prometheus & Grafana for monitoring

## 📋 Project Context

This project was originally developed as a technical challenge with a 24-hour time constraint. It has since been enhanced with additional features, improved architecture, and professional documentation to serve as a portfolio piece demonstrating full-stack development capabilities.

## 🏗️ Architecture

For detailed architecture diagrams, see [Architecture Diagrams](docs/architecture-diagram.md).

The application follows a clean architecture pattern with clear separation of concerns:

1. **Frontend Layer**: React components and state management
2. **API Layer**: FastAPI endpoints with OpenAPI documentation
3. **Service Layer**: Business logic and external integrations
4. **Data Layer**: Database models and repositories

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker and Docker Compose
- Kubernetes cluster (for production deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/kenjohansen/baseball-stats-dashboard.git
cd baseball-stats-dashboard
```

2. Start the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. Start the frontend:
```bash
cd frontend
npm install
npm start
```

4. Open your browser to `http://localhost:3000`

### Docker Deployment

```bash
docker-compose up -d
```

### Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## 📊 API Documentation

The Baseball Stats Dashboard backend provides a RESTful API built with FastAPI, which automatically generates comprehensive OpenAPI documentation.

### Accessing API Documentation

When the backend server is running, interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Available Endpoints

The API provides the following key endpoints:

#### Player Management
- `GET /api/players/` - Retrieve all baseball players
- `GET /api/players/{id}` - Retrieve a specific player by ID
- `POST /api/players/{id}` - Add a new player
- `PUT /api/players/{id}` - Update an existing player
- `DELETE /api/players/{id}` - Delete a player

#### AI-Enhanced Features
- `GET /api/players/description/{id}` - Get a player with AI-generated description
- `GET /api/players/load` - Load sample player data from external source

### OpenAPI Specification

The API is fully documented using OpenAPI 3.0 specification, which provides:
- Detailed request/response schemas
- Example values and payloads
- Authentication requirements
- Response codes and error handling

The complete OpenAPI JSON specification is available at `/api/v1/openapi.json` when the server is running.

### Example API Usage

```python
# Python example using requests
import requests

# Get all players
response = requests.get("http://localhost:8000/api/players/")
players = response.json()

# Get player with AI description
player_id = 1
response = requests.get(f"http://localhost:8000/api/players/description/{player_id}")
player_with_description = response.json()
```

```javascript
// JavaScript example using fetch
// Get all players
fetch('http://localhost:8000/api/players/')
  .then(response => response.json())
  .then(players => console.log(players));

// Add new player
const newPlayer = {
  Player: "Juan Soto",
  Year: 2022,
  AgeThatYear: 23,
  Hits: 156,
  Bats: "L",
  Rank: "12"
};

fetch('http://localhost:8000/api/players/3', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newPlayer)
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🧪 Testing

The Baseball Stats Dashboard includes comprehensive test suites for both frontend and backend components to ensure code quality and functionality.

### Backend Tests

The backend test suite uses pytest with async support and mocks to test the FastAPI endpoints without requiring an actual MongoDB connection:

```bash
# Run backend tests
cd backend
pytest

# Generate coverage report
pytest --cov=app
```

**Backend Test Structure:**
- **API Tests**: Verify all player endpoints (GET, POST, PUT, DELETE) function correctly
- **Database Tests**: Test MongoDB integration with mocked connections
- **AI Integration Tests**: Validate OpenAI integration for player descriptions

The tests use fixtures defined in `conftest.py` to mock MongoDB collections and prevent actual database connections during testing.

### Frontend Tests

The frontend uses Jest and React Testing Library for component and integration testing:

```bash
# Run frontend tests
cd frontend
npm test

# Run with coverage report
npm test -- --coverage
```

**Frontend Test Structure:**
- **Component Tests**: Verify individual React components render and behave correctly
- **Integration Tests**: Test interactions between components
- **Mock Service Worker**: Intercepts API calls to simulate backend responses

Key components tested include:
- `PlayerDashboard`: Tests sorting, filtering, and CRUD operations
- `PlayerViewDialog`: Tests player detail display
- `PlayerEditDialog`: Tests form validation and submission

### Continuous Integration

Tests are automatically run as part of the CI/CD pipeline using GitHub Actions to ensure code quality before deployment.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ken Johansen** - Python & React Developer | Kubernetes Specialist

- Website: [kenjohansen.dev](https://kenjohansen.dev)
- GitHub: [@kenjohansen](https://github.com/kenjohansen)
- LinkedIn: [kenneyjohansen](https://linkedin.com/in/kenneyjohansen)
