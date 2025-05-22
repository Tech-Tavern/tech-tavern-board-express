import express from "express";
import { createBoard, getBoards, getMyBoards } from "../controllers/boardController.js";

const router = express.Router();
router.get("/", getBoards);
router.get("/my", getMyBoards);
router.post("/", createBoard);
export default router;
