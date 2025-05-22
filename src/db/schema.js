import {
  mysqlTable,
  serial,
  bigint,
  varchar,
  text,
  timestamp,
  boolean,
  primaryKey,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

/* ---------- users (Firebase) ---------- */
export const users = mysqlTable("users", {
  uid: varchar("uid", { length: 64 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  photo: varchar("photo", { length: 512 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

/* ---------- boards ---------- */
export const boards = mysqlTable("boards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: bigint("position", { unsigned: true }).default(0),

  ownerUid: varchar("owner_uid", { length: 64 })
    .notNull()
    .references(() => users.uid),

  createdBy: varchar("created_by", { length: 64 })
    .notNull()
    .references(() => users.uid),
  updatedBy: varchar("updated_by", { length: 64 })
    .notNull()
    .references(() => users.uid),

  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});

/* ---------- board ⇄ user membership (with invite status) ---------- */
export const boardUsers = mysqlTable(
  "board_users",
  {
    boardId: bigint("board_id", { unsigned: true })
      .notNull()
      .references(() => boards.id),
    userUid: varchar("user_uid", { length: 64 })
      .notNull()
      .references(() => users.uid),
    role: varchar("role", { length: 20 }).notNull().default("member"),
    status: mysqlEnum("status", ["pending", "accepted"])
      .notNull()
      .default("pending"),
    invitedBy: varchar("invited_by", { length: 64 })
      .notNull()
      .references(() => users.uid),
    invitedAt: timestamp("invited_at", { mode: "string" }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.boardId, table.userUid),
  }),
);

/* ---------- lists ---------- */
export const lists = mysqlTable("lists", {
  id: serial("id").primaryKey(),
  boardId: bigint("board_id", { unsigned: true })
    .notNull()
    .references(() => boards.id),
  title: varchar("title", { length: 255 }).notNull(),
  color: varchar("color", { length: 50 }).default("#D8B4FE"),
  position: bigint("position", { unsigned: true }).default(0),
  columnPos: bigint("column_pos", { unsigned: true }).default(0),
  createdBy: varchar("created_by", { length: 64 })
    .notNull()
    .references(() => users.uid),
  updatedBy: varchar("updated_by", { length: 64 })
    .notNull()
    .references(() => users.uid),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});

/* ---------- cards ---------- */
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
  createdBy: varchar("created_by", { length: 64 })
    .notNull()
    .references(() => users.uid),
  updatedBy: varchar("updated_by", { length: 64 })
    .notNull()
    .references(() => users.uid),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});
