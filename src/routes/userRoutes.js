import express from "express";
import {
  getAllUsers,
  getUserByUid,
  upsertUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.get("/:uid", getUserByUid);

router.post("/", upsertUser);

export default router;
