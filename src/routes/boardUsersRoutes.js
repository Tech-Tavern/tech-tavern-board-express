import express from "express";
import {
  listBoardMembers,
  inviteBoardMember,
  updateBoardMemberStatus,
  removeBoardMember,
} from "../controllers/boardUsersController.js";

const router = express.Router({ mergeParams: true });

router.get("/", listBoardMembers);

router.post("/", inviteBoardMember);

router.put("/:userUid", updateBoardMemberStatus);

router.delete("/:userUid", removeBoardMember);

export default router;
