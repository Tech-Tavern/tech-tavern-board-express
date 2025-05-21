import { db } from "../index.js";
import { cards } from "../db/schema.js";

export const getCards = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const all = await db
      .select()
      .from(cards)
      .where(cards.listId.eq(Number(listId)));
    res.json(all);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const { title, description, color, position } = req.body;
    const [card] = await db.insert(cards).values({
      listId: Number(listId),
      title,
      description,
      color,
      position,
      completed: false,
      archived: false,
    });
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const updates = req.body;
    const [card] = await db
      .update(cards)
      .set(updates)
      .where(cards.id.eq(Number(cardId)));
    res.json(card);
  } catch (err) {
    next(err);
  }
};
