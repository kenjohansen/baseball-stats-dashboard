# Baseball Stats Dashboard Architecture

## System Architecture Diagram

```mermaid
graph TD
    subgraph "Baseball Stats Dashboard"
        Frontend["Frontend (React)"]
        Backend["Backend (FastAPI)"]
        Database["MongoDB Database"]
        OpenAI["OpenAI API"]
        
        Frontend --> Backend
        Backend --> Database
        Backend --> OpenAI
    end
    
    subgraph "Frontend Components"
        UI["Material UI Components"]
        State["React State Management"]
        API_Client["Axios API Client"]
        
        Frontend --> UI
        Frontend --> State
        Frontend --> API_Client
    end
    
    subgraph "Backend Components"
        Routes["API Routes"]
        Models["Data Models"]
        Services["Business Logic"]
        DB_Client["MongoDB Client"]
        
        Backend --> Routes
        Backend --> Models
        Backend --> Services
        Backend --> DB_Client
    end
    
    subgraph "Kubernetes Deployment"
        Ingress["Ingress Controller"]
        FrontendSvc["Frontend Service (ClusterIP)"]
        BackendSvc["Backend Service (ClusterIP)"]
        MongoSvc["MongoDB Service (ClusterIP)"]
        
        Ingress --> FrontendSvc
        Ingress --> BackendSvc
        BackendSvc --> MongoSvc
    end
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        Kubernetes Cluster                               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────┐         ┌────────────────────────────┐  │
│  │                            │         │                            │  │
│  │   Frontend Deployment      │         │    Backend Deployment      │  │
│  │   (2+ Pods)                │         │    (2+ Pods)               │  │
│  │                            │         │                            │  │
│  └────────────────────────────┘         └────────────────────────────┘  │
│               │                                       │                  │
│               ▼                                       ▼                  │
│  ┌────────────────────────────┐         ┌────────────────────────────┐  │
│  │                            │         │                            │  │
│  │   Frontend Service         │         │    Backend Service         │  │
│  │   (ClusterIP)              │         │    (ClusterIP)             │  │
│  │                            │         │                            │  │
│  └────────────────────────────┘         └────────────────────────────┘  │
│               │                                       │                  │
│               └───────────────┬───────────────────────┘                  │
│                               │                                          │
│                               ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │                        Ingress Controller                          │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                               │                                          │
└───────────────────────────────┼──────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                              External Traffic                             │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌────────────────────┐     ┌─────────────────────┐     ┌────────────────────┐
│                    │     │                     │     │                    │
│    User Browser    │◄───►│   React Frontend    │◄───►│   FastAPI Backend  │
│                    │     │                     │     │                    │
└────────────────────┘     └─────────────────────┘     └────────────────────┘
                                                               │
                                                               │
                                                               ▼
                           ┌─────────────────────┐     ┌────────────────────┐
                           │                     │     │                    │
                           │   OpenAI API        │◄───►│   MongoDB          │
                           │                     │     │                    │
                           └─────────────────────┘     └────────────────────┘
```

## Component Diagram

### Frontend Component Hierarchy

```mermaid
graph TD
    App["App"]
    ThemeProvider["ThemeProvider"]
    PlayerDashboard["PlayerDashboard"]
    PlayerTable["PlayerTable"]
    TableRow["TableRow"]
    PlayerViewDialog["PlayerViewDialog"]
    PlayerEditDialog["PlayerEditDialog"]
    
    App --> ThemeProvider
    ThemeProvider --> PlayerDashboard
    PlayerDashboard --> PlayerTable
    PlayerTable --> TableRow
    PlayerDashboard --> PlayerViewDialog
    PlayerDashboard --> PlayerEditDialog
```

### Backend Component Structure

```mermaid
graph TD
    Main["main.py"]
    APIRouter["api/__init__.py"]
    PlayerRoutes["api/routes/players.py"]
    Models["models/player.py"]
    Database["db/mongodb.py"]
    Config["core/config.py"]
    
    Main --> APIRouter
    APIRouter --> PlayerRoutes
    PlayerRoutes --> Models
    PlayerRoutes --> Database
    Main --> Config
    Database --> Config
```
