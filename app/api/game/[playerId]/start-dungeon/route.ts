import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dungeons, rooms, playerProgress, players } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createScavengerHuntPuzzle } from "@/lib/game/scavenger-hunt";
import { generateDungeonRoomImage } from "@/lib/ai/image-generation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params;

    // Get player to access appearance for image generation
    const [player] = await db
      .select()
      .from(players)
      .where(eq(players.id, playerId))
      .limit(1);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

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
        description: "Your first adventure begins in the mysterious Crystal Caverns. Explore and find clues to solve puzzles!",
      })
      .returning();

    // Generate dungeon image with character
    try {
      const characterAppearance = player.appearance as {
        gender?: string;
        race?: string;
        hairColor?: string;
        hairStyle?: string;
        eyeColor?: string;
        skinTone?: string;
        clothing?: string;
      } | null;
      
      const dungeonImageUrl = await generateDungeonRoomImage(
        "A magical crystal cave entrance with glowing gems and mysterious pathways",
        dungeonTheme,
        `dungeons/${dungeon.id}/entrance.png`,
        characterAppearance || undefined,
        "standing at the entrance, looking around"
      );
      await db
        .update(dungeons)
        .set({ imageUrl: dungeonImageUrl })
        .where(eq(dungeons.id, dungeon.id));
    } catch (error) {
      console.error("Failed to generate dungeon image:", error);
      // Continue without image
    }

    // Create rooms with scavenger hunt puzzles
    const roomDescriptions = [
      {
        name: "Entrance Hall",
        description: "You stand at the entrance of the Crystal Caverns. The walls shimmer with magical energy. Look around for clues!",
        order: 1,
        action: "exploring the entrance hall, searching for clues",
      },
      {
        name: "Gem Chamber",
        description: "A chamber filled with glowing crystals. Each gem seems to pulse with its own rhythm. Search carefully for hidden clues!",
        order: 2,
        action: "examining the glowing crystals, looking for patterns",
      },
      {
        name: "Mirror Maze",
        description: "You enter a room filled with mirrors. Your reflection seems to move independently. Explore every corner to find what you need!",
        order: 3,
        action: "navigating through the mirrors, searching for answers",
      },
    ];

    const createdRooms = [];

    for (let i = 0; i < roomDescriptions.length; i++) {
      const roomDesc = roomDescriptions[i];
      const puzzle = createScavengerHuntPuzzle(roomDesc.description);

      // Generate room image with character
      let imageUrl = null;
      try {
        const characterAppearance = player.appearance as {
          gender?: string;
          race?: string;
          hairColor?: string;
          hairStyle?: string;
          eyeColor?: string;
          skinTone?: string;
          clothing?: string;
        } | null;
        
        imageUrl = await generateDungeonRoomImage(
          roomDesc.description, 
          dungeonTheme,
          `dungeons/${dungeon.id}/rooms/${roomDesc.order}-${roomDesc.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          characterAppearance || undefined,
          roomDesc.action
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
          puzzleData: {
            theme: puzzle.theme,
            clues: puzzle.clues,
            solution: puzzle.solution,
            solutionHint: puzzle.solutionHint,
            requiredClues: puzzle.requiredClues,
          },
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

