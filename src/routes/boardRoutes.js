import express from "express";
import {
  createBoard,
  deleteBoard,
  getBoards,
  getMyBoards,
  updateBoard,
} from "../controllers/boardController.js";

const router = express.Router();
router.get("/", getBoards);
router.get("/my", getMyBoards);
router.post("/", createBoard);
router.delete("/:boardId", deleteBoard);
router.put("/:boardId", updateBoard);
export default router;
