# Tech Tavern Board Express Backend

A Node/Express backend that uses Drizzle ORM and MySQL to power a Trello-style board app.

## Prerequisites

- Node.js 18+ installed locally
- Docker and Docker Compose installed
  _Troubleshooting:_ If you don’t have Docker Compose, follow <https://docs.docker.com/compose/install/>
- A copy of `.env` created from `.env.sample`

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy the environment template and update

   ```bash
   cp .env.sample .env
   ```

   The values in `.env.sample` work out of the box for local development. Rotate credentials before sharing or deploying.

## Development

1. Start only the database container

   ```bash
   docker-compose up -d db
   ```

2. Run migrations and launch the API with nodemon

   ```bash
   npm run dev
   ```

3. The API listens on the port set in `.env` (default `3009`).

## Full-stack Run

Bring up both the DB and API in containers

```bash
docker-compose up -d
```

This applies any pending migrations and exposes

- MySQL on the host port defined in `.env`
- API on the host port defined in `.env`

## Stopping Services

```bash
docker-compose down
```

---

## Authentication Header

During development we trust an `x-user-uid` header. Production will swap this for Firebase JWT verification.

Header: x-user-uid: <Firebase UID>

---

## API Endpoints

### Health

| Method | Path    | Notes               |
| ------ | ------- | ------------------- |
| GET    | /health | Simple uptime check |

<details><summary>Response body</summary>

```json
{ "status": "ok" }
```

</details>

---

### Users

| Method | Path        | Purpose                 |
| ------ | ----------- | ----------------------- |
| GET    | /users      | List all users          |
| GET    | /users/:uid | Fetch user by UID       |
| POST   | /users      | Create or update a user |

<details><summary>POST / request body</summary>

```json
{
  "uid": "UidAlice123",
  "email": "alice@example.com",
  "name": "Alice Liddell",
  "photo": "https://example.com/alice.png"
}
```

</details>

---

### Boards

| Method | Path             | Purpose                                             |
| ------ | ---------------- | --------------------------------------------------- |
| GET    | /boards          | Boards the current user can access                  |
| GET    | /boards/my       | Boards owned by the current user                    |
| POST   | /boards          | Create a board                                      |
| DELETE | /boards/:boardId | Delete a board (cascades lists, cards, memberships) |

<details><summary>POST / request body</summary>

```json
{ "name": "My New Board" }
```

</details>

---

### Board Members

| Method | Path                              | Purpose                   |
| ------ | --------------------------------- | ------------------------- |
| GET    | /boards/:boardId/members          | List members              |
| POST   | /boards/:boardId/members          | Invite a user             |
| PUT    | /boards/:boardId/members/:userUid | Accept or deny invitation |
| DELETE | /boards/:boardId/members/:userUid | Remove a member           |

<details><summary>POST / request body</summary>

```json
{ "userUid": "UidBob456", "role": "member" }
```

</details>

---

### Lists

| Method | Path                           | Purpose                       |
| ------ | ------------------------------ | ----------------------------- |
| GET    | /boards/:boardId/lists         | Lists on a board              |
| POST   | /boards/:boardId/lists         | Create a list                 |
| PUT    | /boards/:boardId/lists/:listId | Update title, position, color |
| DELETE | /boards/:boardId/lists/:listId | Delete a list and its cards   |

<details><summary>POST / request body</summary>

```json
{ "title": "To Do", "position": 0, "color": "#D8B4FE" }
```

</details>

---

### Cards

| Method | Path                                         | Purpose               |
| ------ | -------------------------------------------- | --------------------- |
| GET    | /boards/:boardId/lists/:listId/cards         | Cards in a list       |
| POST   | /boards/:boardId/lists/:listId/cards         | Create a card         |
| PUT    | /boards/:boardId/lists/:listId/cards/:cardId | Update or move a card |
| DELETE | /boards/:boardId/lists/:listId/cards/:cardId | Delete a card         |

<details><summary>POST / request body</summary>

```json
{
  "title": "Write tests",
  "description": "Cover core modules",
  "color": "green",
  "position": 1
}
```

</details>

<details><summary>PUT / request body (any subset)</summary>

```json
{ "position": 2, "completed": true, "color": "red" }
```

</details>

---

## Seeding via HTTP

Run the helper script that simulates five users creating boards, lists, cards, invitations, and moves.

```bash
node scripts/seed_api.js
```

Override the API base URL if needed

```bash
BASE_URL=http://localhost:3009 node scripts/seed_api.js
```

---

## Database Schema

Defined in `src/db/schema.js`. Main tables

- **users** – Firebase profiles
- **boards** – board records (ownerUid, createdBy, updatedBy)
- **board_users** – membership status and role
- **lists** – per-board columns
- **cards** – per-list items (content, colors, status, ordering)

All tables include `created_at` and `updated_at`.

---

> **Tip:** Never commit your real `.env`; only `.env.sample`.
> Clone steps for a new dev
>
> 1. `docker-compose up -d db`
> 2. `npm run dev`
