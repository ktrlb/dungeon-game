import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allPlayers = await db
      .select({
        id: players.id,
        name: players.name,
        level: players.level,
        experience: players.experience,
        appearance: players.appearance,
        createdAt: players.createdAt,
      })
      .from(players)
      .orderBy(desc(players.createdAt))
      .limit(50); // Limit to 50 most recent

    return NextResponse.json({ players: allPlayers });
  } catch (error) {
    console.error("Error listing players:", error);
    return NextResponse.json(
      { error: "Failed to list players" },
      { status: 500 }
    );
  }
}

