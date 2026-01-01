import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  health: integer("health").default(100).notNull(),
  maxHealth: integer("max_health").default(100).notNull(),
  inventory: jsonb("inventory").$type<string[]>().default([]).notNull(),
  // Character stats
  strength: integer("strength").default(10).notNull(),
  intelligence: integer("intelligence").default(10).notNull(),
  agility: integer("agility").default(10).notNull(),
  wisdom: integer("wisdom").default(10).notNull(),
  // Character appearance
  appearance: jsonb("appearance").$type<{
    gender?: string;
    race?: string;
    hairColor?: string;
    hairStyle?: string;
    eyeColor?: string;
    skinTone?: string;
    clothing?: string;
    accessories?: string[];
    portraitUrl?: string;
  }>().default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dungeons = pgTable("dungeons", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  level: integer("level").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  dungeonId: uuid("dungeon_id").references(() => dungeons.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  puzzleType: varchar("puzzle_type", { length: 100 }),
  puzzleData: jsonb("puzzle_data").$type<Record<string, unknown>>(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playerProgress = pgTable("player_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id").references(() => players.id).notNull(),
  dungeonId: uuid("dungeon_id").references(() => dungeons.id),
  currentRoomId: uuid("current_room_id").references(() => rooms.id),
  completedRooms: jsonb("completed_rooms").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

