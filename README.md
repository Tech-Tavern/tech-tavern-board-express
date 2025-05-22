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

### Health

#### GET /health

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

### Users

#### GET /users

List all users.

**Response**

```json
[
  {
    "uid": "UidAlice123",
    "email": "alice@example.com",
    "name": "Alice Liddell",
    "photo": "https://example.com/alice.png",
    "createdAt": "2025-05-21T12:00:00Z"
  },
  {
    "uid": "UidBob456",
    "email": "bob@example.com",
    "name": "Bob Builder",
    "photo": "https://example.com/bob.png",
    "createdAt": "2025-05-21T12:00:00Z"
  }
]
```

#### GET /users/\:uid

Fetch a single user by Firebase UID.

**Response**

```json
{
  "uid": "UidAlice123",
  "email": "alice@example.com",
  "name": "Alice Liddell",
  "photo": "https://example.com/alice.png",
  "createdAt": "2025-05-21T12:00:00Z"
}
```

#### POST /users

Create or update a user record (called after auth).

**Body**

```json
{
  "uid": "UidAlice123",
  "email": "alice@example.com",
  "name": "Alice Liddell",
  "photo": "https://example.com/alice.png"
}
```

**Response**

```json
{
  "uid": "UidAlice123",
  "email": "alice@example.com",
  "name": "Alice Liddell",
  "photo": "https://example.com/alice.png",
  "createdAt": "2025-05-21T12:00:00Z"
}
```

### Boards

#### GET /boards

Retrieve all boards accessible to the user.

**Response**

```json
[
  {
    "id": 1,
    "name": "Project Roadmap",
    "ownerUid": "UidAlice123",
    "createdBy": "UidAlice123",
    "updatedBy": "UidAlice123",
    "createdAt": "2025-05-01T08:00:00Z",
    "updatedAt": "2025-05-18T10:15:30Z"
  },
  {
    "id": 2,
    "name": "Marketing Plan",
    "ownerUid": "UidBob456",
    "createdBy": "UidBob456",
    "updatedBy": "UidBob456",
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
  "ownerUid": "UidAlice123",
  "createdBy": "UidAlice123",
  "updatedBy": "UidAlice123",
  "createdAt": "2025-05-21T12:00:00Z",
  "updatedAt": "2025-05-21T12:00:00Z"
}
```

### Board Members

#### GET /boards/\:boardId/members

List all members of a given board.

**Response**

```json
[
  {
    "boardId": 1,
    "userUid": "UidAlice123",
    "role": "owner",
    "status": "accepted",
    "invitedBy": "UidAlice123",
    "invitedAt": "2025-05-21T12:05:00Z"
  },
  {
    "boardId": 1,
    "userUid": "UidBob456",
    "role": "member",
    "status": "pending",
    "invitedBy": "UidAlice123",
    "invitedAt": "2025-05-21T12:05:00Z"
  }
]
```

#### POST /boards/\:boardId/members

Invite a user to a board.

**Body**

```json
{ "userUid": "UidBob456", "role": "member" }
```

**Response**

```json
{
  "boardId": 1,
  "userUid": "UidBob456",
  "role": "member",
  "status": "pending",
  "invitedBy": "UidAlice123",
  "invitedAt": "2025-05-21T12:05:00Z"
}
```

#### PUT /boards/\:boardId/members/\:userUid

Accept or deny an invitation.

**Body**

```json
{ "status": "accepted" }
```

**Response**

```json
{ "boardId": 1, "userUid": "UidBob456", "status": "accepted" }
```

#### DELETE /boards/\:boardId/members/\:userUid

Remove a member from a board.

**Response**

- `204 No Content`

### Lists

#### GET /boards/\:boardId/lists

Retrieve lists for a specific board.

**Response**

```json
[
  {
    "id": 10,
    "boardId": 1,
    "title": "To Do",
    "color": "#D8B4FE",
    "position": 0,
    "createdBy": "UidAlice123",
    "updatedBy": "UidAlice123",
    "createdAt": "2025-01-15T09:35:00.000Z",
    "updatedAt": "2025-01-15T09:35:00.000Z"
  },
  {
    "id": 11,
    "boardId": 1,
    "title": "In Progress",
    "color": "#A5F3FC",
    "position": 1,
    "createdBy": "UidBob456",
    "updatedBy": "UidBob456",
    "createdAt": "2025-01-16T10:00:00.000Z",
    "updatedAt": "2025-03-05T15:10:00.000Z"
  }
]
```

#### POST /boards/\:boardId/lists

Create a new list in a board.

**Body**

```json
{ "title": "Review", "position": 3, "color": "#FDE68A" }
```

**Response**

```json
{
  "id": 12,
  "boardId": 1,
  "title": "Review",
  "position": 3,
  "color": "#FDE68A",
  "createdBy": "UidAlice123",
  "updatedBy": "UidAlice123",
  "createdAt": "2025-05-21T12:10:00Z",
  "updatedAt": "2025-05-21T12:10:00Z"
}
```

### Cards

#### GET /boards/\:boardId/lists/\:listId/cards

Retrieve cards in a specific list.

**Response**

```json
[
  {
    "id": 100,
    "listId": 10,
    "title": "Set up project repo",
    "description": "Initialize GitHub repo, add README and license",
    "color": "default",
    "position": 0,
    "completed": false,
    "archived": false,
    "createdBy": "UidAlice123",
    "updatedBy": "UidAlice123",
    "createdAt": "2025-01-15T09:40:00.000Z",
    "updatedAt": "2025-01-15T09:40:00.000Z"
  },
  {
    "id": 101,
    "listId": 10,
    "title": "Define schema",
    "description": "Draft database schema and share with team",
    "color": "#E0E7FF",
    "position": 1,
    "completed": true,
    "archived": false,
    "createdBy": "UidBob456",
    "updatedBy": "UidBob456",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-02-01T12:15:00.000Z"
  }
]
```

#### POST /boards/\:boardId/lists/\:listId/cards

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
  "id": 102,
  "listId": 10,
  "title": "Finalize copy",
  "description": "Incorporate feedback and finalize",
  "color": "green",
  "position": 2,
  "completed": false,
  "archived": false,
  "createdBy": "UidAlice123",
  "updatedBy": "UidAlice123",
  "createdAt": "2025-05-21T12:15:00Z",
  "updatedAt": "2025-05-21T12:15:00Z"
}
```

#### PUT /boards/\:boardId/lists/\:listId/cards/\:cardId

Update a card (e.g., move position, recolor, mark complete, archive).

**Body**

```json
{ "position": 1, "completed": true, "color": "red" }
```

**Response**

```json
{
  "id": 101,
  "listId": 10,
  "title": "Define schema",
  "description": "Draft database schema and share with team",
  "color": "red",
  "position": 1,
  "completed": true,
  "archived": false,
  "createdBy": "UidBob456",
  "updatedBy": "UidBob456",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-05-21T12:20:00Z"
}
```

## Database Schema

The application uses these tables defined in `src/db/schema.js`:

- **users**: Firebase UIDs with profile info
- **boards**: tracks board metadata and ownership
- **board_users**: join table for board membership and invitation status
- **lists**: belongs to a board, ordered by `position`
- **cards**: belongs to a list, with fields for content, status, color, and order

Every table has `created_at` and `updated_at` timestamps managed by Drizzle.

## Notes

- Migrations are managed via Drizzle Kit and run on each startup (`npm run migrate`).
- Do **not** commit your real `.env`; commit only `.env.sample`.
- If another dev clones this repo, they can stand up just the DB (`docker-compose up -d db`) and then run the API locally, or bring up the full stack with `docker-compose up -d`.
