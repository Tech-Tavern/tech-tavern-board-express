# Tech Tavern Board Express Backend

A Node/Express backend using Drizzle ORM and MySQL for the Trello-style board app.

## Prerequisites

- Node.js 18+ installed locally
- Docker and Docker Compose installed
  _Troubleshooting:_ If you don't have Docker Compose, install it via your package manager or follow the guide at [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)\_
- A copy of `.env` created from `.env.sample`

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

- MySQL on the host port defined in `.env`
- API on the host port defined in `.env`

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

### Boards

#### GET /boards

Retrieve all boards.

**Response**

```json
[
  {
    "id": 1,
    "name": "Project Roadmap",
    "createdAt": "2025-05-01T08:00:00Z",
    "updatedAt": "2025-05-18T10:15:30Z"
  },
  {
    "id": 2,
    "name": "Marketing Plan",
    "createdAt": "2025-04-22T09:30:00Z",
    "updatedAt": "2025-05-19T16:45:00Z"
  }
]
```

#### POST /boards

Create a new board.

**Body**

```json
{ "name": "New Campaign" }
```

**Response**

```json
{
  "id": 3,
  "name": "New Campaign",
  "createdAt": "2025-05-21T12:00:00Z",
  "updatedAt": "2025-05-21T12:00:00Z"
}
```

### Lists

#### GET /boards/:boardId/lists

Retrieve lists for a specific board.

**Response**

```json
[
  {
    "id": 1,
    "boardId": 2,
    "title": "To Do",
    "position": 0,
    "createdAt": "2025-05-20T11:00:00Z",
    "updatedAt": "2025-05-20T11:00:00Z"
  },
  {
    "id": 2,
    "boardId": 2,
    "title": "In Progress",
    "position": 1,
    "createdAt": "2025-05-20T11:05:00Z",
    "updatedAt": "2025-05-20T11:05:00Z"
  },
  {
    "id": 3,
    "boardId": 2,
    "title": "Done",
    "position": 2,
    "createdAt": "2025-05-20T11:10:00Z",
    "updatedAt": "2025-05-20T11:10:00Z"
  }
]
```

#### POST /boards/:boardId/lists

Create a new list in a board.

**Body**

```json
{ "title": "Review", "position": 3 }
```

**Response**

```json
{
  "id": 4,
  "boardId": 2,
  "title": "Review",
  "position": 3,
  "createdAt": "2025-05-21T12:05:00Z",
  "updatedAt": "2025-05-21T12:05:00Z"
}
```

### Cards

#### GET /boards/:boardId/lists/:listId/cards

Retrieve cards in a specific list.

**Response**

```json
[
  {
    "id": 5,
    "listId": 1,
    "title": "Write draft",
    "description": "Create initial draft of marketing copy",
    "color": "yellow",
    "position": 0,
    "completed": false,
    "archived": false,
    "createdAt": "2025-05-19T09:00:00Z",
    "updatedAt": "2025-05-19T09:00:00Z"
  },
  {
    "id": 6,
    "listId": 1,
    "title": "Review draft",
    "description": "Peer review the draft content",
    "color": "blue",
    "position": 1,
    "completed": false,
    "archived": false,
    "createdAt": "2025-05-19T10:00:00Z",
    "updatedAt": "2025-05-19T10:30:00Z"
  }
]
```

#### POST /boards/:boardId/lists/:listId/cards

Create a new card.

**Body**

```json
{
  "title": "Finalize copy",
  "description": "Incorporate feedback and finalize",
  "color": "green",
  "position": 2
}
```

**Response**

```json
{
  "id": 7,
  "listId": 1,
  "title": "Finalize copy",
  "description": "Incorporate feedback and finalize",
  "color": "green",
  "position": 2,
  "completed": false,
  "archived": false,
  "createdAt": "2025-05-21T12:10:00Z",
  "updatedAt": "2025-05-21T12:10:00Z"
}
```

#### PUT /boards/:boardId/lists/:listId/cards/:cardId

Update a card (e.g., move position, recolor, mark complete, archive).

**Body**

```json
{ "position": 1, "completed": true, "color": "red" }
```

**Response**

```json
{
  "id": 6,
  "listId": 1,
  "title": "Review draft",
  "description": "Peer review the draft content",
  "color": "red",
  "position": 1,
  "completed": true,
  "archived": false,
  "createdAt": "2025-05-19T10:00:00Z",
  "updatedAt": "2025-05-21T12:15:00Z"
}
```

## Database Schema

The application uses three main tables defined in `src/db/schema.js`:

- **boards**: tracks board metadata (`id`, `name`, timestamps)
- **lists**: belongs to a board and orders lists via `position`
- **cards**: belongs to a list with fields for `title`, `description`, `color`, `position`, `completed`, and `archived`

Each table includes `created_at` and `updated_at` timestamps managed by Drizzle.

## Notes

- Migrations are managed via Drizzle Kit and run on each startup (`npm run migrate`).
- Do **not** commit your real `.env` file; commit only `.env.sample`.
- If another developer clones this repo, they can stand up just the DB (`docker-compose up -d db`) and then run the API locally, or bring up the full stack with `docker-compose up -d`.
