import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { players, playerProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Create player
    const [player] = await db
      .insert(players)
      .values({
        name: name.trim(),
        level: 1,
        experience: 0,
        health: 100,
        maxHealth: 100,
        inventory: [],
      })
      .returning();

    // Initialize player progress (will be set when they enter first dungeon)
    await db.insert(playerProgress).values({
      playerId: player.id,
      completedRooms: [],
    });

    return NextResponse.json({ playerId: player.id });
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}

