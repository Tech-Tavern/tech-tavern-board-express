import express from "express";
import { getLists, createList, updateList } from "../controllers/listController.js";

const router = express.Router({ mergeParams: true });
router.get("/", getLists);
router.post("/", createList);
router.put("/:listId", updateList);
export default router;
