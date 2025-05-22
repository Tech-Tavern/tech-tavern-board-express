import { db } from "../../index.js";
import { boardUsers } from "../db/schema.js";

export const listBoardMembers = async (req, res, next) => {
  try {
    const boardId = Number(req.params.boardId);
    const members = await db
      .select()
      .from(boardUsers)
      .where(boardUsers.boardId.equals(boardId));
    res.json(members);
  } catch (err) {
    next(err);
  }
};

export const inviteBoardMember = async (req, res, next) => {
  try {
    const boardId = Number(req.params.boardId);
    const inviter = req.user.uid;
    const { userUid, role = "member" } = req.body;

    await db
      .insert(boardUsers)
      .values({
        boardId,
        userUid,
        role,
        status: "pending",
        invitedBy: inviter,
      })
      .execute();
    res.status(201).json({ boardId, userUid, status: "pending", role });
  } catch (err) {
    next(err);
  }
};

export const updateBoardMemberStatus = async (req, res, next) => {
  try {
    const boardId = Number(req.params.boardId);
    const userUid = req.params.userUid;
    const { status } = req.body;

    if (!["accepted", "denied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (status === "denied") {
      await db
        .delete(boardUsers)
        .where(
          boardUsers.boardId.equals(boardId),
          boardUsers.userUid.equals(userUid),
        )
        .execute();
      return res.status(204).end();
    }

    await db
      .update(boardUsers)
      .set({ status })
      .where(
        boardUsers.boardId.equals(boardId),
        boardUsers.userUid.equals(userUid),
      )
      .execute();

    res.json({ boardId, userUid, status });
  } catch (err) {
    next(err);
  }
};

export const removeBoardMember = async (req, res, next) => {
  try {
    const boardId = Number(req.params.boardId);
    const userUid = req.params.userUid;

    await db
      .delete(boardUsers)
      .where(
        boardUsers.boardId.equals(boardId),
        boardUsers.userUid.equals(userUid),
      )
      .execute();

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
