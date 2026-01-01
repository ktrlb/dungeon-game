import { NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/image-generation";
import { uploadImageToBlob } from "@/lib/storage/blob";

interface PortraitRequest {
  appearance: {
    gender?: string;
    race?: string;
    hairColor?: string;
    hairStyle?: string;
    eyeColor?: string;
    skinTone?: string;
    clothing?: string;
    accessories?: string[];
  };
}

export async function POST(request: Request) {
  try {
    const { appearance }: PortraitRequest = await request.json();

    if (!appearance) {
      return NextResponse.json(
        { error: "Appearance data is required" },
        { status: 400 }
      );
    }

    // Build a descriptive prompt for the character portrait
    const accessoriesText = appearance.accessories && appearance.accessories.length > 0
      ? `, wearing ${appearance.accessories.filter(a => a !== "None").join(", ")}`
      : "";

    const genderDescription = appearance.gender === "Girl" ? "young girl" : "young boy";
    const prompt = `A friendly, family-friendly fantasy character portrait of a ${genderDescription}. ${appearance.race || "Human"} character with ${appearance.hairColor || "brown"} ${appearance.hairStyle || "medium"} hair, ${appearance.eyeColor || "brown"} eyes, ${appearance.skinTone || "medium"} skin tone, wearing ${appearance.clothing || "adventurer's gear"}${accessoriesText}. Colorful, engaging, suitable for middle-grade children. Portrait style, fantasy RPG character art, no violence or scary elements.`;

    // Generate the portrait
    const filename = `character-portraits/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    
    const result = await generateImage({
      prompt,
      size: "1024x1024",
      style: "vivid",
      uploadToBlob: true,
      blobFilename: filename,
    });

    return NextResponse.json({ portraitUrl: result.url });
  } catch (error) {
    console.error("Error generating portrait:", error);
    return NextResponse.json(
      { error: "Failed to generate portrait" },
      { status: 500 }
    );
  }
}

