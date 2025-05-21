import express from "express";
import { getLists, createList } from "../controllers/listController.js";

const router = express.Router({ mergeParams: true });
router.get("/", getLists);
router.post("/", createList);
export default router;
