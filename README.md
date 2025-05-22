# Tech Tavern Board Express Backend

A Node/Express backend using Drizzle ORM and MySQL for the Trello‑style board app.

## Prerequisites

- Node.js 18+ installed locally
- Docker and Docker Compose installed
  _Troubleshooting:_ If you don't have Docker Compose, install it via your package manager or follow the guide at [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
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

   The values in `.env.sample` will work out of the box for local development. For security, consider rotating these credentials before sharing or deploying.

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

## Full‑stack Run (production or full stack)

Bring up both the DB and API in containers:

```bash
docker-compose up -d
```

This applies any pending migrations and exposes:

- MySQL on the host port defined in `.env`
- API on the host port defined in `.env`

## Stopping Services

Tear down all containers and network:

```bash
docker-compose down
```

---

## Authentication Header

For development and seeding we trust an `x-user-uid` header to identify the user. In production you’ll replace this with real Firebase JWT verification middleware.

All protected endpoints require:

```
Header: x-user-uid: <Firebase UID>
```

---

## API Endpoints

### Health Check

**GET** `/health`

Returns:

```json
{ "status": "ok" }
```

### Users

#### GET /users

List all users.

#### GET /users/\:uid

Fetch a single user by UID.

#### POST /users

Create or update a user after sign‑in.

**Body**:

```json
{
  "uid": "UidAlice123",
  "email": "alice@example.com",
  "name": "Alice Liddell",
  "photo": "https://example.com/alice.png"
}
```

---

### Boards

#### GET /boards

Retrieve all boards the authenticated user has access to.

#### POST /boards

Create a new board.
**Header**: `x-user-uid` required

**Body**:

```json
{ "name": "My New Board" }
```

---

### Board Members

#### GET /boards/\:boardId/members

List board members.

#### POST /boards/\:boardId/members

Invite a user.

**Body**:

```json
{ "userUid": "UidBob456", "role": "member" }
```

#### PUT /boards/\:boardId/members/\:userUid

Accept or deny invitation.

**Body**:

```json
{ "status": "accepted" }
```

#### DELETE /boards/\:boardId/members/\:userUid

Remove a member.

---

### Lists

#### GET /boards/\:boardId/lists

Retrieve all lists for a board.

#### POST /boards/\:boardId/lists

Create a new list.
**Body**:

```json
{ "title": "To Do", "position": 0, "color": "#D8B4FE" }
```

---

### Cards

#### GET /boards/\:boardId/lists/\:listId/cards

List cards in a list.

#### POST /boards/\:boardId/lists/\:listId/cards

Add a new card.
**Body**:

```json
{
  "title": "Write tests",
  "description": "Cover core modules",
  "color": "green",
  "position": 1
}
```

#### PUT /boards/\:boardId/lists/\:listId/cards/\:cardId

Update a card (move, recolor, complete, archive).

**Body** (any subset):

```json
{ "position": 2, "completed": true, "color": "red" }
```

---

## Seeding via HTTP

We include a helper script that hits your API and simulates 5 users each creating boards, lists, cards, invitations, and moves.

**Usage**:

```bash
node scripts/seed_api.js
```

You can customize `BASE_URL` via environment:

```bash
BASE_URL=http://localhost:3009 node scripts/seed_api.js
```

---

## Database Schema

Defined in `src/db/schema.js`, the main tables:

- **users**: Firebase profile records
- **boards**: each with `ownerUid`, `createdBy`, `updatedBy`
- **board_users**: membership status & role
- **lists**: per‑board columns
- **cards**: per‑list items, with content, colors, status, and ordering

All tables include `created_at` and `updated_at`.

---

> **Tip:** Do **not** commit your real `.env`; only `.env.sample`. If another dev clones:
>
> 1. `docker-compose up -d db`
> 2. `npm run dev`
