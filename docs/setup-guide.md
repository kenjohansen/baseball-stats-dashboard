# Baseball Stats Dashboard Setup Guide

This guide provides step-by-step instructions for setting up and running the Baseball Stats Dashboard project in different environments.

## Setup Options Overview

```mermaid
flowchart TD
    Start([Start Setup]) --> Choice{Choose Setup Method}
    Choice -->|Local Development| Local[Local Development]
    Choice -->|Docker| Docker[Docker Compose]
    Choice -->|Production| K8s[Kubernetes]
    
    Local --> FrontendLocal[Setup Frontend]
    Local --> BackendLocal[Setup Backend]
    Local --> MongoLocal[Setup MongoDB]
    
    Docker --> DockerCompose[Run Docker Compose]
    
    K8s --> HelmChart[Deploy with Helm]
    
    style Start fill:#4CAF50,stroke:#333,stroke-width:2px
    style Choice fill:#FF9800,stroke:#333,stroke-width:2px
    style Local fill:#2196F3,stroke:#333,stroke-width:2px
    style Docker fill:#2196F3,stroke:#333,stroke-width:2px
    style K8s fill:#2196F3,stroke:#333,stroke-width:2px
```

## Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- Docker and Docker Compose (for containerized setup)
- Kubernetes cluster (for production deployment)
- MongoDB (v5.0+)
- OpenAI API key

## Local Development Setup

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB
    
    Dev->>DB: Start MongoDB
    Dev->>BE: Setup Python venv
    Dev->>BE: Install dependencies
    Dev->>BE: Configure environment
    Dev->>BE: Start FastAPI server
    Dev->>FE: Install npm packages
    Dev->>FE: Configure environment
    Dev->>FE: Start React dev server
    
    BE->>DB: Connect
    FE->>BE: API Requests
```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

6. Update the `.env` file with your OpenAI API key and MongoDB connection details.

7. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

8. The backend API will be available at `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`

### MongoDB Setup

1. Install and start MongoDB:
   - Windows: Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - macOS: `brew install mongodb-community@5.0`
   - Linux: Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. Start MongoDB:
   ```bash
   mongod --dbpath /path/to/data/directory
   ```

3. The MongoDB server will be available at `mongodb://localhost:27017`

## Docker Compose Setup (Recommended for Development)

```mermaid
graph TD
    subgraph "Docker Compose Environment"
        Frontend["Frontend Container<br>React App on Nginx"]
        Backend["Backend Container<br>FastAPI on Uvicorn"]
        MongoDB["MongoDB Container"]
        
        Frontend -->|"Port 80:3000"| User
        User -->|"localhost:80"| Frontend
        Frontend -->|"API Requests"| Backend
        Backend -->|"Port 8000"| Frontend
        Backend -->|"Queries"| MongoDB
    end
    
    style Frontend fill:#61dafb,stroke:#333,stroke-width:2px
    style Backend fill:#009688,stroke:#333,stroke-width:2px
    style MongoDB fill:#4DB33D,stroke:#333,stroke-width:2px
    style User fill:#ff9800,stroke:#333,stroke-width:2px
```

1. Make sure Docker and Docker Compose are installed.

2. Create a `.env` file in the project root with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start the application stack:
   ```bash
   docker-compose up -d
   ```

4. The application will be available at:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`

5. To stop the application:
   ```bash
   docker-compose down
   ```

## Kubernetes Deployment (Production)

```mermaid
graph TD
    subgraph "Kubernetes Cluster"
        Ingress["Ingress Controller"]
        FrontendSvc["Frontend Service"]
        BackendSvc["Backend Service"]
        FrontendPods["Frontend Pods"]
        BackendPods["Backend Pods"]
        MongoDB["MongoDB StatefulSet"]
        ConfigMaps["ConfigMaps"]
        Secrets["Secrets"]
        
        Ingress --> FrontendSvc
        Ingress --> BackendSvc
        FrontendSvc --> FrontendPods
        BackendSvc --> BackendPods
        BackendPods --> MongoDB
        ConfigMaps --> BackendPods
        Secrets --> BackendPods
        Secrets --> MongoDB
    end
    
    User["External User"] --> Ingress
    
    style Ingress fill:#326CE5,stroke:#333,stroke-width:2px
    style FrontendSvc fill:#326CE5,stroke:#333,stroke-width:2px
    style BackendSvc fill:#326CE5,stroke:#333,stroke-width:2px
    style FrontendPods fill:#326CE5,stroke:#333,stroke-width:2px
    style BackendPods fill:#326CE5,stroke:#333,stroke-width:2px
    style MongoDB fill:#326CE5,stroke:#333,stroke-width:2px
    style ConfigMaps fill:#326CE5,stroke:#333,stroke-width:2px
    style Secrets fill:#326CE5,stroke:#333,stroke-width:2px
    style User fill:#ff9800,stroke:#333,stroke-width:2px
```

1. Update the Kubernetes secrets in `k8s/secrets.yaml` with your MongoDB URI and OpenAI API key:
   ```bash
   # Generate base64 encoded values
   echo -n "mongodb://username:password@hostname:port/" | base64
   echo -n "your_openai_api_key" | base64
   ```

2. Update the generated values in `k8s/secrets.yaml`.

3. Build and push Docker images:
   ```bash
   # Set your Docker registry
   export DOCKER_REGISTRY=your-registry
   
   # Build and push frontend
   docker build -t ${DOCKER_REGISTRY}/baseball-stats-frontend:latest ./frontend
   docker push ${DOCKER_REGISTRY}/baseball-stats-frontend:latest
   
   # Build and push backend
   docker build -t ${DOCKER_REGISTRY}/baseball-stats-backend:latest ./backend
   docker push ${DOCKER_REGISTRY}/baseball-stats-backend:latest
   ```

4. Update the image references in the Kubernetes deployment files if needed.

5. Apply Kubernetes configurations:
   ```bash
   kubectl apply -f k8s/secrets.yaml
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   ```

6. Monitor the deployment:
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

7. Access the application using the configured Ingress hostnames:
   - Frontend: `https://baseball-stats.kenjohansen.dev`
   - Backend API: `https://api.baseball-stats.kenjohansen.dev`

## Initial Data Load

After setting up the backend, you can load sample baseball player data by making a GET request to:

```
http://localhost:8000/api/players/load
```

This will fetch data from the external baseball API and populate your MongoDB database.

## Troubleshooting

### Frontend Issues

- **API Connection Errors**: Ensure the `REACT_APP_API_URL` environment variable is correctly set and the backend server is running.
- **Build Errors**: Make sure all dependencies are installed with `npm install`.

### Backend Issues

- **MongoDB Connection Errors**: Verify that MongoDB is running and the connection URI is correct.
- **OpenAI API Errors**: Check that your OpenAI API key is valid and correctly set in the environment.

### Docker Issues

- **Container Startup Failures**: Check container logs with `docker-compose logs`.
- **Network Issues**: Ensure ports 3000, 8000, and 27017 are available on your system.

### Kubernetes Issues

- **Pod Startup Failures**: Check pod logs with `kubectl logs <pod-name>`.
- **Ingress Issues**: Verify that your Ingress controller is properly configured.

## Support

For additional help, please contact Ken Johansen at kenney.johansen@gmail.com or visit [kenjohansen.dev](https://kenjohansen.dev).
