import "dotenv/config";
import { defineConfig } from "drizzle-kit";
const isDocker = process.env.NODE_ENV === "docker";
export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: isDocker ? "tech-tavern-mysql" : "localhost",
    port: isDocker ? 3306 : 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});
