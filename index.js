import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import boardRoutes from "./src/routes/boardRoutes.js";
import listRoutes from "./src/routes/listRoutes.js";
import cardRoutes from "./src/routes/cardRoutes.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";
import { logger } from "./src/middleware/logger.js";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3307,
});
export const db = drizzle(pool);

export const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/boards", boardRoutes);
app.use("/boards/:boardId/lists", listRoutes);
app.use("/boards/:boardId/lists/:listId/cards", cardRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "ok", code: 200 });
});
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3009;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
