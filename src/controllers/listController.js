import { eq } from "drizzle-orm";
import { db } from "../../index.js";
import { cards, lists } from "../db/schema.js";

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
        columnPos: l.columnPos.toString(),
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
    const { title, position = 0, color = "#D8B4FE", columnPos } = req.body;
    const userUid = req.header("x-user-uid");

    const [ResultSetHeader] = await db
      .insert(lists)
      .values({
        boardId,
        title,
        color,
        position,
        columnPos,
        createdBy: userUid,
        updatedBy: userUid,
      })
      .execute();

    const [l] = await db
      .select()
      .from(lists)
      .where(eq(lists.id, BigInt(ResultSetHeader.insertId)));

    res.status(201).json({
      id: l.id.toString(),
      boardId: l.boardId.toString(),
      title: l.title,
      color: l.color,
      position: l.position.toString(),
      columnPos: l.columnPos.toString(),
      createdBy: l.createdBy,
      updatedBy: l.updatedBy,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateList = async (req, res, next) => {
  try {
    const boardId = BigInt(req.params.boardId);
    const listId = BigInt(req.params.listId);
    const { title, color, position, columnPos } = req.body;
    const updatedBy = req.header("x-user-uid");

    const updateFields = { updatedBy };

    if (title !== undefined) updateFields.title = title;
    if (color !== undefined) updateFields.color = color;
    if (position !== undefined) updateFields.position = BigInt(position);
    if (columnPos !== undefined) updateFields.columnPos = BigInt(columnPos);

    await db
      .update(lists)
      .set(updateFields)
      .where(eq(lists.id, listId), eq(lists.boardId, boardId))
      .execute();

    const [l] = await db.select().from(lists).where(eq(lists.id, listId));

    res.json({
      id: l.id.toString(),
      boardId: l.boardId.toString(),
      title: l.title,
      color: l.color,
      position: l.position.toString(),
      columnPos: l.columnPos.toString(),
      createdBy: l.createdBy,
      updatedBy: l.updatedBy,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteList = async (req, res, next) => {
  try {
    const listId = BigInt(req.params.listId);

    await db.delete(cards).where(eq(cards.listId, listId)).execute();

    await db.delete(lists).where(eq(lists.id, listId)).execute();

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
