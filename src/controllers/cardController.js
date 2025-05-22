// src/controllers/cardController.js
import { eq } from "drizzle-orm";
import { cards } from "../db/schema.js";
import { db } from "../../index.js";

// GET /boards/:boardId/lists/:listId/cards
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

// POST /boards/:boardId/lists/:listId/cards
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

    // insert & get insertId
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

    // re-fetch the new row
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

// PUT /boards/:boardId/lists/:listId/cards/:cardId
export const updateCard = async (req, res, next) => {
  try {
    const cardId = BigInt(req.params.cardId);
    const { title, description, color, position, completed, archived } =
      req.body;
    const userUid = req.header("x-user-uid");

    // build the update payload only from provided fields
    const upd = { updatedBy: userUid };
    if (title !== undefined) upd.title = title;
    if (description !== undefined) upd.description = description;
    if (color !== undefined) upd.color = color;
    if (position !== undefined) upd.position = position;
    if (completed !== undefined) upd.completed = completed;
    if (archived !== undefined) upd.archived = archived;
    // always touch updatedBy

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
