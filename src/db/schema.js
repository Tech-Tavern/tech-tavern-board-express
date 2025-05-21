import {
  mysqlTable,
  serial,
  bigint,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";

/* ---------- boards ---------- */
export const boards = mysqlTable("boards", {
  id: serial("id").primaryKey(), 
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});

/* ---------- lists ----------- */
export const lists = mysqlTable("lists", {
  id: serial("id").primaryKey(),
  boardId: bigint("board_id", { unsigned: true })
    .notNull()
    .references(() => boards.id),
  title: varchar("title", { length: 255 }).notNull(),
  position: bigint("position", { unsigned: true }).default(0),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});

/* ---------- cards ----------- */
export const cards = mysqlTable("cards", {
  id: serial("id").primaryKey(),
  listId: bigint("list_id", { unsigned: true })
    .notNull()
    .references(() => lists.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 50 }).default("default"),
  position: bigint("position", { unsigned: true }).default(0),
  completed: boolean("completed").default(false).notNull(),
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});
