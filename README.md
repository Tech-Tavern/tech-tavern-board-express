# Tech Tavern Board Express Backend

A Node/Express backend using Drizzle ORM and MySQL for the Trello-style board app.

## Prerequisites

* Node.js 18+ installed locally
* Docker and Docker Compose installed
  *Troubleshooting:* If you don't have Docker Compose, install it via your package manager or follow the guide at [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)\_
* A copy of `.env` created from `.env.sample`

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```
2. Copy the environment template and update:

   ```bash
   cp .env.sample .env
   ```

   The values in `.env.sample` will work out-of-the-box for local development. For security, consider rotating these credentials or using stronger passwords before sharing or deploying.

## Development (iterating on API)

1. Start only the database container:

   ```bash
   docker-compose up -d db
   ```
2. Run migrations and launch the API with nodemon:

   ```bash
   npm run dev
   ```
3. The API will listen on the port defined in `.env` (default `3009`).

## Running Both Services (production or full stack)

Bring up both the database and the API in containers:

```bash
docker-compose up -d
```

This will automatically apply any pending migrations and expose:

* MySQL on the host port defined in `.env`
* API on the host port defined in `.env`

## Stopping Services

Tear down all containers and network:

```bash
docker-compose down
```

## API Endpoints

### GET /health

Check server health status.

**Request**

```http
GET /health HTTP/1.1
Host: localhost:${PORT}
```

**Response**

```json
{ "status": "ok" }
```

## Notes

* Migrations are managed via Drizzle Kit and run on each startup (`npm run migrate`).
* Do **not** commit your real `.env` file; commit only `.env.sample`.
* If another developer clones this repo, they can stand up just the DB (`docker-compose up -d db`) and then run the API locally, or bring up the full stack with `docker-compose up -d`.
