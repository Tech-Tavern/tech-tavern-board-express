import { eq } from 'drizzle-orm';
import { db } from "../../index.js";
import { users } from "../db/schema.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const all = await db.select().from(users);
    res.json(all);
  } catch (err) {
    next(err);
  }
};

export const getUserByUid = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const [user] = await db.select().from(users).where(eq(users.uid, uid));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const upsertUser = async (req, res, next) => {
  try {
    const { uid, email, name, photo } = req.body;
    await db
      .insert(users)
      .values({ uid, email, name, photo })
      .onDuplicateKeyUpdate({
        set: {
          email: (v) => v.email,
          name: (v) => v.name,
          photo: (v) => v.photo,
        },
      })
      .execute();
    const [fresh] = await db.select().from(users).where(eq(users.uid, uid));
    res.status(201).json(fresh);
  } catch (err) {
    console.error(err)
    next(err);
  }
};
