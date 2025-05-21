// src/controllers/listController.js
import { eq } from "drizzle-orm";
import { db } from "../../index.js";
import { lists } from "../db/schema.js";

export const getLists = async (req, res, next) => {
  try {
    const boardId = BigInt(req.params.boardId);

    const rows = await db
      .select()
      .from(lists)
      .where(eq(lists.boardId, boardId))
      .orderBy(lists.position);

    res.json(
      rows.map((l) => ({
        id: l.id.toString(),
        boardId: l.boardId.toString(),
        title: l.title,
        color: l.color,
        position: l.position.toString(),
        createdBy: l.createdBy,
        updatedBy: l.updatedBy,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
      })),
    );
  } catch (err) {
    next(err);
  }
};

export const createList = async (req, res, next) => {
  try {
    const boardId = BigInt(req.params.boardId);
    const { title, position = 0, color = "#D8B4FE" } = req.body;
    const userUid = req.user.uid; // set by your Firebase auth middleware

    // 1️⃣ insert & grab the auto-increment id
    const { insertId } = await db
      .insert(lists)
      .values({
        boardId,
        title,
        color,
        position,
        createdBy: userUid,
        updatedBy: userUid,
      })
      .execute();

    // 2️⃣ re-query the full row so we have timestamps, etc.
    const [l] = await db
      .select()
      .from(lists)
      .where(eq(lists.id, BigInt(insertId)));

    // 3️⃣ serialize and return
    res.status(201).json({
      id: l.id.toString(),
      boardId: l.boardId.toString(),
      title: l.title,
      color: l.color,
      position: l.position.toString(),
      createdBy: l.createdBy,
      updatedBy: l.updatedBy,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};
