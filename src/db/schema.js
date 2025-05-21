import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  int,
} from "drizzle-orm/mysql-core";

// Boards table
export const boards = mysqlTable("boards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});

// Lists table
export const lists = mysqlTable("lists", {
  id: serial("id").primaryKey(),
  boardId: int("board_id", { unsigned: true })
    .notNull()
    .references(() => boards.id),
  title: varchar("title", { length: 255 }).notNull(),
  position: int("position").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});

// Cards table
export const cards = mysqlTable("cards", {
  id: serial("id").primaryKey(),
  listId: int("list_id", { unsigned: true })
    .notNull()
    .references(() => lists.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 50 }).default("default"),
  position: int("position").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});
