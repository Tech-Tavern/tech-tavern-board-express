import express from "express";
import {
  getLists,
  createList,
  updateList,
  deleteList,
} from "../controllers/listController.js";

const router = express.Router({ mergeParams: true });
router.get("/", getLists);
router.post("/", createList);
router.put("/:listId", updateList);
router.delete("/:listId", deleteList);
export default router;
