import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { players, playerProgress, dungeons, rooms } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params;

    // Get player
    const [player] = await db
      .select()
      .from(players)
      .where(eq(players.id, playerId))
      .limit(1);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Get player progress
    const [progress] = await db
      .select()
      .from(playerProgress)
      .where(eq(playerProgress.playerId, playerId))
      .limit(1);

    let dungeon = null;
    let currentRoom = null;

    if (progress?.dungeonId) {
      // Get current dungeon
      const [dungeonData] = await db
        .select()
        .from(dungeons)
        .where(eq(dungeons.id, progress.dungeonId))
        .limit(1);

      dungeon = dungeonData || null;

      // Get current room
      if (progress.currentRoomId) {
        const [roomData] = await db
          .select()
          .from(rooms)
          .where(eq(rooms.id, progress.currentRoomId))
          .limit(1);

        currentRoom = roomData || null;
      }
    }

    return NextResponse.json({
      player,
      dungeon,
      currentRoom,
      completedRooms: progress?.completedRooms || [],
    });
  } catch (error) {
    console.error("Error loading game:", error);
    return NextResponse.json(
      { error: "Failed to load game" },
      { status: 500 }
    );
  }
}

