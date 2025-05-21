// scripts/seed.js
import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { users, boards, boardUsers, lists, cards } from "../src/db/schema.js";

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  const db = drizzle(pool);

  const uidAlice = "UidAlice123";
  const uidBob = "UidBob456";

  try {
    // 1️⃣ Upsert users
    await db
      .insert(users)
      .values([
        {
          uid: uidAlice,
          email: "alice@example.com",
          name: "Alice Liddell",
          photo: "https://example.com/alice.png",
        },
        {
          uid: uidBob,
          email: "bob@example.com",
          name: "Bob Builder",
          photo: "https://example.com/bob.png",
        },
      ])
      .onDuplicateKeyUpdate({
        set: {
          email: (v) => v.email,
          name: (v) => v.name,
          photo: (v) => v.photo,
        },
      })
      .execute();

    // 2️⃣ Create a board & grab its insertId
    const [boardResult] = await db
      .insert(boards)
      .values({
        name: "Sample Project Board",
        position: 0,
        ownerUid: uidAlice,
        createdBy: uidAlice,
        updatedBy: uidAlice,
      })
      .execute();
    const boardId = boardResult.insertId; // ← now actually set

    // 3️⃣ Add board members
    await db
      .insert(boardUsers)
      .values([
        {
          boardId,
          userUid: uidAlice,
          role: "owner",
          status: "accepted",
          invitedBy: uidAlice,
        },
        {
          boardId,
          userUid: uidBob,
          role: "member",
          status: "pending",
          invitedBy: uidAlice,
        },
      ])
      .execute();

    // 4️⃣ Create lists & grab each insertId
    const [todoRes] = await db
      .insert(lists)
      .values({
        boardId,
        title: "To Do",
        color: "#D8B4FE",
        position: 0,
        createdBy: uidAlice,
        updatedBy: uidAlice,
      })
      .execute();
    const todoId = todoRes.insertId;

    const [doingRes] = await db
      .insert(lists)
      .values({
        boardId,
        title: "Doing",
        color: "#FDE68A",
        position: 1,
        createdBy: uidAlice,
        updatedBy: uidAlice,
      })
      .execute();
    const doingId = doingRes.insertId;

    const [doneRes] = await db
      .insert(lists)
      .values({
        boardId,
        title: "Done",
        color: "#86EFAC",
        position: 2,
        createdBy: uidAlice,
        updatedBy: uidAlice,
      })
      .execute();
    const doneId = doneRes.insertId;

    // 5️⃣ Create some cards
    await db
      .insert(cards)
      .values([
        {
          listId: todoId,
          title: "Set up project repo",
          position: 0,
          color: "blue",
          createdBy: uidAlice,
          updatedBy: uidAlice,
        },
        {
          listId: todoId,
          title: "Define schema",
          position: 1,
          color: "#E0E7FF",
          completed: true,
          createdBy: uidBob,
          updatedBy: uidBob,
        },
        {
          listId: doingId,
          title: "Create initial components",
          position: 0,
          color: "purple",
          createdBy: uidBob,
          updatedBy: uidBob,
        },
        {
          listId: doneId,
          title: "Add styling",
          position: 0,
          color: "green",
          archived: true,
          createdBy: uidAlice,
          updatedBy: uidAlice,
        },
      ])
      .execute();

    console.log("✅ Seed inserted successfully. Board ID:", boardId);
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await pool.end();
    process.exit();
  }
})();
