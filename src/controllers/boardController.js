import { db } from "../../index.js";
import { boards } from "../db/schema.js";

export const getBoards = async (req, res, next) => {
  try {
    const all = await db.select().from(boards);
    res.json(all);
  } catch (err) {
    next(err);
  }
};

export const createBoard = async (req, res, next) => {
  try {
    const { name } = req.body;
    const [board] = await db.insert(boards).values({ name });
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
};
