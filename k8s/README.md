# Kubernetes Deployment Configuration

This directory contains Kubernetes manifests for deploying the Baseball Stats Dashboard application to a Kubernetes cluster.

## Structure

- `frontend/` - Frontend deployment resources
  - `deployment.yaml` - Frontend deployment configuration
  - `service.yaml` - Frontend service configuration
  - `ingress.yaml` - Ingress configuration for frontend
  - `configmap.yaml` - Environment configuration
- `backend/` - Backend deployment resources
  - `deployment.yaml` - Backend deployment configuration
  - `service.yaml` - Backend service configuration
  - `configmap.yaml` - Environment configuration
  - `secrets.yaml` - Sensitive configuration (template)
- `database/` - Database deployment resources
  - `statefulset.yaml` - PostgreSQL StatefulSet
  - `service.yaml` - Database service
  - `pvc.yaml` - Persistent volume claim
  - `secrets.yaml` - Database credentials (template)
- `monitoring/` - Monitoring resources
  - `prometheus.yaml` - Prometheus configuration
  - `grafana.yaml` - Grafana deployment
- `namespace.yaml` - Namespace definition

## Deployment

```bash
# Create namespace
kubectl apply -f namespace.yaml

# Deploy database
kubectl apply -f database/

# Deploy backend
kubectl apply -f backend/

# Deploy frontend
kubectl apply -f frontend/

# Deploy monitoring (optional)
kubectl apply -f monitoring/
```

## Features

- Scalable microservices architecture
- Separate namespaces for isolation
- Resource limits and requests for optimal performance
- Health checks and readiness probes
- Persistent storage for database
- Ingress configuration with TLS
- Monitoring with Prometheus and Grafana

## Requirements

- Kubernetes 1.22+
- kubectl CLI
- Access to a Kubernetes cluster (local or cloud)
```
