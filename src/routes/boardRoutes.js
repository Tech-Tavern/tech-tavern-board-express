import express from "express";
import { createBoard, getBoards } from "../controllers/boardController.js";

const router = express.Router();
router.get("/", getBoards);
router.post("/", createBoard);
export default router;
