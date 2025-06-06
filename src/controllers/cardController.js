import { eq } from "drizzle-orm";
import { cards } from "../db/schema.js";
import { db } from "../../index.js";

export const getCards = async (req, res, next) => {
  try {
    const listId = BigInt(req.params.listId);
    const rows = await db
      .select()
      .from(cards)
      .where(eq(cards.listId, listId))
      .orderBy(cards.position);

    res.json(
      rows.map((c) => ({
        id: c.id.toString(),
        listId: c.listId.toString(),
        title: c.title,
        description: c.description,
        color: c.color,
        position: c.position.toString(),
        completed: c.completed,
        archived: c.archived,
        createdBy: c.createdBy,
        updatedBy: c.updatedBy,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    );
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req, res, next) => {
  try {
    const listId = BigInt(req.params.listId);
    const {
      title,
      description = "",
      color = "default",
      position = 0,
    } = req.body;
    const userUid = req.header("x-user-uid");

    const [ResultSetHeader] = await db
      .insert(cards)
      .values({
        listId,
        title,
        description,
        color,
        position,
        completed: false,
        archived: false,
        createdBy: userUid,
        updatedBy: userUid,
      })
      .execute();

    const [c] = await db
      .select()
      .from(cards)
      .where(eq(cards.id, BigInt(ResultSetHeader.insertId)));

    res.status(201).json({
      id: c.id.toString(),
      listId: c.listId.toString(),
      title: c.title,
      description: c.description,
      color: c.color,
      position: c.position.toString(),
      completed: c.completed,
      archived: c.archived,
      createdBy: c.createdBy,
      updatedBy: c.updatedBy,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    });
  } catch (err) {
    console.log(err);

    next(err);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const cardId = BigInt(req.params.cardId);
    // include listId here
    const {
      title,
      description,
      color,
      position,
      completed,
      archived,
      listId, // ← pull `listId` out of the body
    } = req.body;
    const userUid = req.header("x-user-uid");

    // build the update object
    const upd = { updatedBy: userUid };
    if (title !== undefined) upd.title = title;
    if (description !== undefined) upd.description = description;
    if (color !== undefined) upd.color = color;
    if (position !== undefined) upd.position = position;
    if (completed !== undefined) upd.completed = completed;
    if (archived !== undefined) upd.archived = archived;

    // **new**: if listId was provided, convert to BigInt and include it
    if (listId !== undefined) {
      upd.listId = BigInt(listId);
    }

    // run the update
    await db.update(cards).set(upd).where(eq(cards.id, cardId)).execute();

    // return the fresh row
    const [c] = await db.select().from(cards).where(eq(cards.id, cardId));

    res.json({
      id: c.id.toString(),
      listId: c.listId.toString(),
      title: c.title,
      description: c.description,
      color: c.color,
      position: c.position.toString(),
      completed: c.completed,
      archived: c.archived,
      createdBy: c.createdBy,
      updatedBy: c.updatedBy,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const cardId = BigInt(req.params.cardId);
    await db.delete(cards).where(eq(cards.id, cardId)).execute();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
