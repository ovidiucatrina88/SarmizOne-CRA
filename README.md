# Risk Quantification Platform (FAIR)

This application is a comprehensive platform for quantifying and managing cybersecurity risks using the **FAIR (Factor Analysis of Information Risk)** framework. It enables organizations to model risk scenarios, visualize exposure, and make data-driven decisions based on probable loss magnitude and frequency.

## Features

- **Risk Scenario Management**: Create, edit, and drag-and-drop risk scenarios.
- **FAIR Analysis**: Detailed breakdown of risk factors (Threat Event Frequency, Contact Frequency, Probability of Action, Loss Magnitude, etc.).
- **Visualizations**: Interactive graphs (Force Graph, React Flow) to visualize risk relationships and hierarchies.
- **Monte Carlo Simulations**: (Backend) Run simulations to calculate Annualized Loss Exposure (ALE).
- **Dashboard**: High-level summary of risk posture and key performance indicators.
- **Asset Management**: Link risks to specific assets and controls.

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL**: A running PostgreSQL instance.
- **npm** or **yarn**

### Environment Setup

1.  Copy the example environment file (if available) or set up your `.env` file with the following required variables:
    *   `DATABASE_URL`: Connection string for your PostgreSQL database.
    *   `SESSION_SECRET`: Secret for session management.
    *   `OPENAI_API_KEY`: (Optional) For AI-assisted features.

### Installation

Install the project dependencies:

```bash
npm install
```

### Running the Application

**Development Mode:**
To start both the backend server and the frontend build process in development mode:

```bash
npm run dev
```

The application should be accessible at `http://localhost:5000` (or the port specified in your logs).

**Production Build:**
To build the application for production:

```bash
npm run build
```

To run the production build:

```bash
npm run start
```

### Database Management

Push schema changes to the database:

```bash
npm run db:push
```

## Tech Stack

- **Frontend**: React, Tailwind CSS, Radix UI, @xyflow/react, Recharts.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL with Drizzle ORM.
- **Language**: TypeScript.

## License

This project is licensed under a **Non-Commercial License**. See the [LICENSE](LICENSE) file for details.
**Commercial use of this software is strictly prohibited.**
