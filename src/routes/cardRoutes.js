import express from "express";
import {
  getCards,
  createCard,
  updateCard,
} from "../controllers/cardController.js";

const router = express.Router({ mergeParams: true });
router.get("/", getCards);
router.post("/", createCard);
router.put("/:cardId", updateCard);
export default router;
