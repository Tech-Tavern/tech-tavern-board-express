import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { errorHandler } from "./src/middleware/errorHandler";

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

app.get("/health", (req, res) => {
  res.json({ status: "ok", code: 200 });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3009;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
