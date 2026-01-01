import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dungeons, rooms, playerProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createRiddlePuzzle, createPatternPuzzle, createWordPuzzle } from "@/lib/game/puzzles";
import { generateDungeonRoomImage } from "@/lib/ai/image-generation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params;

    // Check if player already has a dungeon
    const [existingProgress] = await db
      .select()
      .from(playerProgress)
      .where(eq(playerProgress.playerId, playerId))
      .limit(1);

    if (existingProgress?.dungeonId) {
      return NextResponse.json({ error: "Player already has an active dungeon" }, { status: 400 });
    }

    // Create a starter dungeon
    const dungeonTheme = "A magical crystal cave with glowing gems and mysterious pathways";
    const [dungeon] = await db
      .insert(dungeons)
      .values({
        name: "Crystal Caverns",
        level: 1,
        description: "Your first adventure begins in the mysterious Crystal Caverns. Solve puzzles to progress!",
      })
      .returning();

    // Generate dungeon image
    try {
      const dungeonImageUrl = await generateDungeonRoomImage(
        "A magical crystal cave entrance with glowing gems and mysterious pathways",
        dungeonTheme,
        `dungeons/${dungeon.id}/entrance.png`
      );
      await db
        .update(dungeons)
        .set({ imageUrl: dungeonImageUrl })
        .where(eq(dungeons.id, dungeon.id));
    } catch (error) {
      console.error("Failed to generate dungeon image:", error);
      // Continue without image
    }

    // Create rooms with puzzles
    const roomDescriptions = [
      {
        name: "Entrance Hall",
        description: "You stand at the entrance of the Crystal Caverns. The walls shimmer with magical energy.",
        order: 1,
      },
      {
        name: "Gem Chamber",
        description: "A chamber filled with glowing crystals. Each gem seems to pulse with its own rhythm.",
        order: 2,
      },
      {
        name: "Mirror Maze",
        description: "You enter a room filled with mirrors. Your reflection seems to move independently.",
        order: 3,
      },
    ];

    const puzzleTypes = [createRiddlePuzzle, createPatternPuzzle, createWordPuzzle];
    const createdRooms = [];

    for (let i = 0; i < roomDescriptions.length; i++) {
      const roomDesc = roomDescriptions[i];
      const puzzleGenerator = puzzleTypes[i % puzzleTypes.length];
      const puzzle = puzzleGenerator();

      // Generate room image
      let imageUrl = null;
      try {
        imageUrl = await generateDungeonRoomImage(
          roomDesc.description, 
          dungeonTheme,
          `dungeons/${dungeon.id}/rooms/${roomDesc.order}-${roomDesc.name.toLowerCase().replace(/\s+/g, '-')}.png`
        );
      } catch (error) {
        console.error(`Failed to generate image for room ${roomDesc.name}:`, error);
      }

      const [room] = await db
        .insert(rooms)
        .values({
          dungeonId: dungeon.id,
          name: roomDesc.name,
          description: roomDesc.description,
          imageUrl,
          puzzleType: puzzle.type,
          puzzleData: { ...puzzle.data, answer: puzzle.solution },
          order: roomDesc.order,
        })
        .returning();

      createdRooms.push(room);
    }

    // Set player progress to first room
    await db
      .update(playerProgress)
      .set({
        dungeonId: dungeon.id,
        currentRoomId: createdRooms[0].id,
      })
      .where(eq(playerProgress.playerId, playerId));

    return NextResponse.json({
      dungeon,
      currentRoom: createdRooms[0],
    });
  } catch (error) {
    console.error("Error starting dungeon:", error);
    return NextResponse.json(
      { error: "Failed to start dungeon" },
      { status: 500 }
    );
  }
}

