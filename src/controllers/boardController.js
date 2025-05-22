// src/controllers/boardController.js
import { boards } from "../db/schema.js";
import { eq } from "drizzle-orm";
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


export const createBoard = async (req, res, next) => {
  try {

    const userUid = req.header("x-user-uid");
    const { name, position = 0 } = req.body;

    // insert board with all NOT NULL fields
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

    // fetch the newly-created row
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
    console.log(err)
    next(err);
  }
};
