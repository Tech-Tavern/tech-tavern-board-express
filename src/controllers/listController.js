import { db } from "../../index.js";
import { lists } from "../db/schema.js";

export const getLists = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const all = await db
      .select()
      .from(lists)
      .where(lists.boardId.eq(Number(boardId)));
    res.json(all);
  } catch (err) {
    next(err);
  }
};

export const createList = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, position } = req.body;
    const [list] = await db
      .insert(lists)
      .values({ boardId: Number(boardId), title, position });
    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
};
