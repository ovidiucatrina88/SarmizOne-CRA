---
description: How to deploy the application to production
---

# Deployment Workflow

This workflow describes how to deploy the Risk Quantification Platform to a production environment.

## Prerequisites

-   Docker installed on the target machine.
-   PostgreSQL database credentials.
-   `.env.production` file configured.

## Steps

1.  **Prepare Environment**:
    Ensure `.env.production` is present and contains the correct database credentials.
    ```bash
    cp .env.external-db .env.production
    # Edit .env.production
    ```

2.  **Build and Deploy**:
    Use the provided script for a simple deployment.
    ```bash
    ./docker-simple-deploy.sh
    ```

    Alternatively, you can manually build and run:
    ```bash
    # Build image
    docker build -t risk-app:latest .

    # Stop existing container
    docker stop risk-quantification-app || true
    docker rm risk-quantification-app || true

    # Run new container
    docker run -d \
      --name risk-quantification-app \
      --restart unless-stopped \
      -p 5000:5000 \
      --env-file .env.production \
      risk-app:latest
    ```

3.  **Verify Deployment**:
    Check the logs to ensure the application started correctly.
    ```bash
    docker logs -f risk-quantification-app
    ```
