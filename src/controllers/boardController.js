import { boards, boardUsers, cards, lists } from "../db/schema.js";
import { eq, inArray } from "drizzle-orm";
import { db } from "../../index.js";

export const getBoards = async (req, res, next) => {
  try {
    const rows = await db.select().from(boards);
    const sanitized = rows.map((b) => ({
      id: b.id.toString(),
      name: b.name,
      position: b.position.toString(),
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));
    res.json(sanitized);
  } catch (err) {
    next(err);
  }
};

export const getMyBoards = async (req, res, next) => {
  try {
    const userUid = req.header("x-user-uid");
    if (!userUid) {
      return res.status(401).json({ message: "Missing x-user-uid header" });
    }

    const rows = await db
      .select()
      .from(boards)
      .where(eq(boards.ownerUid, userUid))
      .orderBy(boards.position);

    const sanitized = rows.map((b) => ({
      id: b.id.toString(),
      name: b.name,
      position: b.position.toString(),
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      ownerUid: b.ownerUid,
      createdBy: b.createdBy,
      updatedBy: b.updatedBy,
    }));

    res.json(sanitized);
  } catch (err) {
    next(err);
  }
};

export const createBoard = async (req, res, next) => {
  try {
    const userUid = req.header("x-user-uid");
    const { name, position = 0 } = req.body;

    const [{ insertId }] = await db
      .insert(boards)
      .values({
        name,
        position,
        ownerUid: userUid,
        createdBy: userUid,
        updatedBy: userUid,
      })
      .execute();

    const [b] = await db
      .select()
      .from(boards)
      .where(eq(boards.id, BigInt(insertId)));

    res.status(201).json({
      id: b.id.toString(),
      name: b.name,
      position: b.position.toString(),
      ownerUid: b.ownerUid,
      createdBy: b.createdBy,
      updatedBy: b.updatedBy,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    const boardId = BigInt(req.params.boardId);
    const { name, position } = req.body;
    const updatedBy = req.header("x-user-uid");

    const data = { updatedBy };
    if (name !== undefined) data.name = name;
    if (position !== undefined) data.position = BigInt(position);

    await db.update(boards).set(data).where(eq(boards.id, boardId)).execute();

    const [row] = await db.select().from(boards).where(eq(boards.id, boardId));

    if (!row) return res.status(404).json({ error: "Board not found" });

    res.json({
      id: row.id.toString(),
      name: row.name,
      position: row.position?.toString(),
      ownerUid: row.ownerUid,
      createdBy: row.createdBy,
      updatedBy: row.updatedBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteBoard = async (req, res, next) => {
  try {
    const boardId = BigInt(req.params.boardId);

    await db.transaction(async (trx) => {
      const listRows = await trx
        .select({ id: lists.id })
        .from(lists)
        .where(eq(lists.boardId, boardId));

      const listIds = listRows.map((l) => l.id);
      if (listIds.length) {
        await trx.delete(cards).where(inArray(cards.listId, listIds)).execute();
      }

      await trx.delete(lists).where(eq(lists.boardId, boardId)).execute();
      await trx
        .delete(boardUsers)
        .where(eq(boardUsers.boardId, boardId))
        .execute();
      await trx.delete(boards).where(eq(boards.id, boardId)).execute();
    });

    res.status(204).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
