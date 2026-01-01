import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, playerProgress, players } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ playerId: string; roomId: string }> }
) {
  try {
    const { playerId, roomId } = await params;

    // Mark room as completed
    await db
      .update(rooms)
      .set({ isCompleted: true })
      .where(eq(rooms.id, roomId));

    // Get current progress
    const [progress] = await db
      .select()
      .from(playerProgress)
      .where(eq(playerProgress.playerId, playerId))
      .limit(1);

    if (!progress) {
      return NextResponse.json({ error: "Progress not found" }, { status: 404 });
    }

    // Add room to completed rooms
    const completedRooms = [...(progress.completedRooms || []), roomId];
    await db
      .update(playerProgress)
      .set({ completedRooms })
      .where(eq(playerProgress.playerId, playerId));

    // Award experience
    const [player] = await db
      .select()
      .from(players)
      .where(eq(players.id, playerId))
      .limit(1);

    if (player) {
      const newExperience = player.experience + 50;
      const newLevel = Math.floor(newExperience / 200) + 1;
      
      await db
        .update(players)
        .set({
          experience: newExperience,
          level: newLevel,
        })
        .where(eq(players.id, playerId));
    }

    // Find next room
    const [currentRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (currentRoom && progress.dungeonId) {
      const [nextRoom] = await db
        .select()
        .from(rooms)
        .where(
          and(
            eq(rooms.dungeonId, progress.dungeonId),
            eq(rooms.order, currentRoom.order + 1)
          )
        )
        .limit(1);

      if (nextRoom) {
        await db
          .update(playerProgress)
          .set({ currentRoomId: nextRoom.id })
          .where(eq(playerProgress.playerId, playerId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing room:", error);
    return NextResponse.json(
      { error: "Failed to complete room" },
      { status: 500 }
    );
  }
}

