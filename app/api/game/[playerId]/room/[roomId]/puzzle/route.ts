import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createRiddlePuzzle, createPatternPuzzle, createWordPuzzle } from "@/lib/game/puzzles";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string; roomId: string }> }
) {
  try {
    const { roomId } = await params;

    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room || !room.puzzleType) {
      return NextResponse.json({ error: "Room or puzzle not found" }, { status: 404 });
    }

    // Generate a fresh puzzle of the same type
    let puzzle;
    switch (room.puzzleType) {
      case "riddle":
        puzzle = createRiddlePuzzle();
        break;
      case "pattern":
        puzzle = createPatternPuzzle();
        break;
      case "word":
        puzzle = createWordPuzzle();
        break;
      default:
        // Use existing puzzle data
        puzzle = {
          type: room.puzzleType,
          data: room.puzzleData || {},
          solution: (room.puzzleData as { answer?: string })?.answer || "",
        };
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Error getting puzzle:", error);
    return NextResponse.json(
      { error: "Failed to get puzzle" },
      { status: 500 }
    );
  }
}

