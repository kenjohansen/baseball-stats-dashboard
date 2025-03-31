Deployment
==========

This section describes the deployment options for the Baseball Stats Dashboard application, with a focus on Kubernetes deployment using Helm.

Deployment Options
----------------

The Baseball Stats Dashboard can be deployed in several ways:

1. **Local Development**: Using Docker Compose
2. **Kubernetes**: Using Helm charts for production deployment
3. **Cloud Platforms**: Deployment to AWS, Azure, or Google Cloud

Docker Compose Deployment
-----------------------

For local development or simple deployments, Docker Compose provides an easy way to run all components:

.. code-block:: bash

    # Start all services
    docker-compose up -d

    # View logs
    docker-compose logs -f

    # Stop all services
    docker-compose down

The Docker Compose configuration includes:

- Frontend container (React)
- Backend container (FastAPI)
- MongoDB container
- Volume for MongoDB data persistence

Kubernetes Deployment with Helm
-----------------------------

For production deployments, Kubernetes with Helm is recommended. The Helm chart is located in the ``helm/baseball-stats`` directory.

Prerequisites:

- Kubernetes cluster (local or cloud-based)
- Helm 3.x installed
- kubectl configured to access your cluster

Installation Steps:

1. Add the Helm repository (if hosted in a repository):

   .. code-block:: bash

      helm repo add baseball-stats https://kenjohansen.github.io/baseball-stats-dashboard/helm-repo
      helm repo update

2. Install the chart:

   .. code-block:: bash

      helm install baseball-stats baseball-stats/baseball-stats \
        --namespace baseball-stats \
        --create-namespace \
        --set backend.image.tag=latest \
        --set frontend.image.tag=latest

   Or, install from the local chart:

   .. code-block:: bash

      helm install baseball-stats ./helm/baseball-stats \
        --namespace baseball-stats \
        --create-namespace

3. Verify the deployment:

   .. code-block:: bash

      kubectl get pods -n baseball-stats
      kubectl get services -n baseball-stats
      kubectl get ingress -n baseball-stats

Helm Chart Structure
------------------

The Helm chart follows the standard Helm structure:

.. code-block:: text

    baseball-stats/
    ├── Chart.yaml           # Chart metadata
    ├── values.yaml          # Default configuration values
    ├── templates/           # Kubernetes manifest templates
    │   ├── _helpers.tpl     # Template helpers
    │   ├── frontend-deployment.yaml
    │   ├── frontend-service.yaml
    │   ├── backend-deployment.yaml
    │   ├── backend-service.yaml
    │   ├── mongodb-deployment.yaml
    │   ├── mongodb-service.yaml
    │   ├── mongodb-pvc.yaml
    │   ├── ingress.yaml
    │   ├── secrets.yaml
    │   └── hpa.yaml         # Horizontal Pod Autoscaler
    └── charts/              # Dependent charts (if any)

Configuration Options
-------------------

The Helm chart can be configured using values in ``values.yaml`` or by passing ``--set`` parameters to the ``helm install`` command.

Key configuration options:

.. code-block:: yaml

    # Frontend configuration
    frontend:
      replicaCount: 2
      image:
        repository: kenjohansen/baseball-stats-frontend
        tag: latest
      resources:
        limits:
          cpu: 200m
          memory: 256Mi
        requests:
          cpu: 100m
          memory: 128Mi
      autoscaling:
        enabled: true
        minReplicas: 2
        maxReplicas: 5
        targetCPUUtilizationPercentage: 80

    # Backend configuration
    backend:
      replicaCount: 2
      image:
        repository: kenjohansen/baseball-stats-backend
        tag: latest
      resources:
        limits:
          cpu: 300m
          memory: 512Mi
        requests:
          cpu: 150m
          memory: 256Mi
      autoscaling:
        enabled: true
        minReplicas: 2
        maxReplicas: 5
        targetCPUUtilizationPercentage: 80
      
    # MongoDB configuration
    mongodb:
      enabled: true
      image:
        repository: mongo
        tag: 5.0
      persistence:
        enabled: true
        size: 10Gi
      
    # Ingress configuration
    ingress:
      enabled: true
      className: nginx
      annotations:
        cert-manager.io/cluster-issuer: letsencrypt-prod
      hosts:
        - host: baseball-stats.kenjohansen.dev
          paths:
            - path: /
              pathType: Prefix
              service: frontend
            - path: /api
              pathType: Prefix
              service: backend
      tls:
        - secretName: baseball-stats-tls
          hosts:
            - baseball-stats.kenjohansen.dev

Cloud Platform Deployments
------------------------

The Helm chart can be used to deploy to various cloud platforms:

Amazon EKS
~~~~~~~~~

.. code-block:: bash

    # Create an EKS cluster
    eksctl create cluster --name baseball-stats --region us-west-2 --nodegroup-name standard-nodes --node-type t3.medium --nodes 3 --nodes-min 1 --nodes-max 5

    # Deploy the Helm chart
    helm install baseball-stats ./helm/baseball-stats --namespace baseball-stats --create-namespace

Google Kubernetes Engine (GKE)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

    # Create a GKE cluster
    gcloud container clusters create baseball-stats --num-nodes=3 --machine-type=e2-standard-2 --region=us-central1

    # Deploy the Helm chart
    helm install baseball-stats ./helm/baseball-stats --namespace baseball-stats --create-namespace

Azure Kubernetes Service (AKS)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

    # Create an AKS cluster
    az aks create --resource-group baseball-stats-rg --name baseball-stats --node-count 3 --enable-addons monitoring --generate-ssh-keys

    # Get credentials
    az aks get-credentials --resource-group baseball-stats-rg --name baseball-stats

    # Deploy the Helm chart
    helm install baseball-stats ./helm/baseball-stats --namespace baseball-stats --create-namespace

Continuous Deployment
-------------------

For continuous deployment, you can use tools like ArgoCD or Flux:

ArgoCD Setup
~~~~~~~~~~

1. Install ArgoCD:

   .. code-block:: bash

      kubectl create namespace argocd
      kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

2. Create an Application resource:

   .. code-block:: yaml

      apiVersion: argoproj.io/v1alpha1
      kind: Application
      metadata:
        name: baseball-stats
        namespace: argocd
      spec:
        project: default
        source:
          repoURL: https://github.com/kenjohansen/baseball-stats-dashboard.git
          targetRevision: HEAD
          path: helm/baseball-stats
        destination:
          server: https://kubernetes.default.svc
          namespace: baseball-stats
        syncPolicy:
          automated:
            prune: true
            selfHeal: true

Monitoring and Logging
--------------------

For monitoring and logging, consider adding:

1. **Prometheus** for metrics collection
2. **Grafana** for visualization
3. **Elasticsearch, Fluentd, and Kibana (EFK)** for logging

These can be installed alongside the Baseball Stats Dashboard using their respective Helm charts.
