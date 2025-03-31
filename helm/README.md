# Baseball Stats Dashboard Helm Chart

This Helm chart deploys the complete Baseball Stats Dashboard application, including:
- React frontend
- FastAPI backend
- MongoDB database (optional, can use external instance)
- Ingress configuration for routing
- Horizontal Pod Autoscaling for dynamic scaling

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- Ingress controller installed in your cluster (e.g., NGINX Ingress Controller)
- Optional: cert-manager for TLS certificates
- Optional: External MongoDB instance if not using the built-in MongoDB

## Installation

1. Add the repository (assuming you've published this chart to a Helm repository):
```bash
helm repo add kenjohansen https://charts.kenjohansen.dev
helm repo update
```

2. Install the chart:
```bash
# Create a namespace
kubectl create namespace baseball-stats

# Install with default values
helm install baseball-stats kenjohansen/baseball-stats-dashboard -n baseball-stats

# Or install with custom values
helm install baseball-stats kenjohansen/baseball-stats-dashboard -n baseball-stats -f my-values.yaml
```

3. For local development and testing:
```bash
# Install from local directory
helm install baseball-stats ./helm/baseball-stats -n baseball-stats
```

## Using an External MongoDB Instance

By default, this chart deploys MongoDB as part of the installation. However, you can configure it to use an existing MongoDB instance:

1. Create a values file with external MongoDB configuration:
```yaml
# external-mongodb.yaml
mongodb:
  deploy: false  # Disable the built-in MongoDB
  external:
    uri: "mongodb://username:password@mongodb.example.com:27017/Baseball?authSource=admin"
    # OR use a secret
    # secretName: "existing-mongodb-secret"  # Secret must contain MONGODB_URI key
```

2. Install the chart with these values:
```bash
helm install baseball-stats kenjohansen/baseball-stats-dashboard -n baseball-stats -f external-mongodb.yaml
```

This approach is useful for:
- Production environments where databases are managed separately
- Using managed MongoDB services (MongoDB Atlas, AWS DocumentDB, etc.)
- Connecting to existing MongoDB instances in other namespaces

## Configuration

The following table lists the configurable parameters of the Baseball Stats Dashboard chart and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `global.namespace` | Namespace to deploy resources | `baseball-stats` |
| `global.environment` | Environment name | `production` |
| `frontend.replicaCount` | Number of frontend replicas | `2` |
| `frontend.image.repository` | Frontend image repository | `kenjohansen/baseball-stats-frontend` |
| `frontend.image.tag` | Frontend image tag | `latest` |
| `frontend.service.type` | Frontend service type | `ClusterIP` |
| `frontend.ingress.enabled` | Enable ingress for frontend | `true` |
| `backend.replicaCount` | Number of backend replicas | `2` |
| `backend.image.repository` | Backend image repository | `kenjohansen/baseball-stats-backend` |
| `backend.image.tag` | Backend image tag | `latest` |
| `backend.service.type` | Backend service type | `ClusterIP` |
| `mongodb.enabled` | Enable MongoDB deployment | `true` |
| `mongodb.auth.enabled` | Enable MongoDB authentication | `true` |
| `mongodb.persistence.enabled` | Enable MongoDB persistence | `true` |
| `mongodb.persistence.size` | MongoDB PVC size | `1Gi` |
| `mongodb.deploy` | Deploy MongoDB instance | `true` |
| `mongodb.external.uri` | External MongoDB URI | `` |
| `mongodb.external.secretName` | Secret name for external MongoDB URI | `` |
| `autoscaling.enabled` | Enable HPA | `true` |
| `autoscaling.minReplicas` | Minimum replicas for HPA | `1` |
| `autoscaling.maxReplicas` | Maximum replicas for HPA | `5` |

## Architecture

This Helm chart implements a microservices architecture with:

1. **Frontend Service**: React application served via NGINX
2. **Backend Service**: FastAPI application providing RESTful API endpoints
3. **Database**: MongoDB for data persistence
4. **Ingress**: Routes traffic to appropriate services
   - `/` routes to the frontend service
   - `/api` routes to the backend service

## Monitoring

The chart includes Prometheus annotations for scraping metrics from both frontend and backend services. To enable monitoring:

1. Ensure Prometheus is installed in your cluster
2. Set `metrics.enabled` to `true`
3. Set `metrics.serviceMonitor.enabled` to `true` if using the Prometheus Operator

## Security Considerations

- Secrets are managed through Kubernetes Secrets
- TLS is configured through the Ingress resource
- MongoDB authentication is enabled by default
- API keys and sensitive data should be provided during installation

## Customization

To customize the deployment, create a `values.yaml` file with your specific configuration:

```yaml
# Example custom values
frontend:
  replicaCount: 3
  resources:
    limits:
      cpu: 300m
      memory: 512Mi

backend:
  replicaCount: 3
  env:
    - name: LOG_LEVEL
      value: INFO

mongodb:
  persistence:
    size: 5Gi
```

Then install the chart with:
```bash
helm install baseball-stats kenjohansen/baseball-stats-dashboard -n baseball-stats -f values.yaml
```

## Author

**Ken Johansen** - Python & React Developer | Kubernetes Specialist
- Website: [kenjohansen.dev](https://kenjohansen.dev)
- GitHub: [@kenjohansen](https://github.com/kenjohansen)
- LinkedIn: [kenneyjohansen](https://linkedin.com/in/kenneyjohansen)
