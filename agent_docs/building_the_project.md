# Building and Running the Project

## Prerequisites

-   **Node.js**: Ensure you have a recent version of Node.js installed.
-   **Docker**: Required for containerized deployment and database management.
-   **PostgreSQL**: The application requires a PostgreSQL database (version 15+).

## Environment Setup

1.  **Environment Files**:
    -   `.env.development`: Used for local development.
    -   `.env.production`: Used for production deployment.
    -   `.env.external-db`: Template for external database configuration.

    Copy `.env.external-db` to `.env.production` or `.env.development` and configure your database credentials.

## Development

To start the development server:

```bash
npm install
npm run dev
```

This will start the backend server (using `tsx`) and the frontend development server (using `vite`).

## Building for Production

To build the application for production:

```bash
npm run build
```

This command builds the frontend using Vite and bundles the backend using esbuild.

## Docker Deployment

To deploy using Docker:

1.  Build the image:
    ```bash
    docker build -t risk-app:latest .
    ```

2.  Run the container:
    ```bash
    docker run -d \
      --name risk-quantification-app \
      --restart unless-stopped \
      -p 5000:5000 \
      --env-file .env.production \
      risk-app:latest
    ```

See `PRODUCTION_README.md` for more detailed deployment instructions.
