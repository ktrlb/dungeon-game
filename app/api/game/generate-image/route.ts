import { NextResponse } from "next/server";
import { generateDungeonRoomImage } from "@/lib/ai/image-generation";

export async function POST(request: Request) {
  try {
    const { roomDescription, dungeonTheme } = await request.json();

    if (!roomDescription || !dungeonTheme) {
      return NextResponse.json(
        { error: "roomDescription and dungeonTheme are required" },
        { status: 400 }
      );
    }

    const imageUrl = await generateDungeonRoomImage(roomDescription, dungeonTheme);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

