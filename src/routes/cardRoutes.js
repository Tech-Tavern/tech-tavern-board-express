import express from "express";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/cardController.js";

const router = express.Router({ mergeParams: true });
router.get("/", getCards);
router.post("/", createCard);
router.put("/:cardId", updateCard);
router.delete("/:cardId", deleteCard);
export default router;
