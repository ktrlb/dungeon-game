/**
 * Vercel AI Gateway integration for image generation
 * Uses OpenAI DALL-E or similar models through Vercel AI Gateway
 */

import { uploadImageToBlob } from "@/lib/storage/blob";

interface ImageGenerationOptions {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024";
  style?: "vivid" | "natural";
  uploadToBlob?: boolean;
  blobFilename?: string;
}

interface ImageGenerationResponse {
  url: string;
  revisedPrompt?: string;
}

export async function generateImage(
  options: ImageGenerationOptions
): Promise<ImageGenerationResponse> {
  const { 
    prompt, 
    size = "1024x1024", 
    style = "vivid",
    uploadToBlob = true,
    blobFilename
  } = options;

  if (!process.env.OPENAI_API_KEY) {
    // Return a placeholder if API key is not set (for development)
    console.warn("OPENAI_API_KEY is not set, returning placeholder");
    const placeholderUrl = "https://via.placeholder.com/1024x1024/4a5568/ffffff?text=Dungeon+Room";
    
    // If Blob storage is configured, try to upload placeholder
    if (uploadToBlob && process.env.BLOB_READ_WRITE_TOKEN && blobFilename) {
      try {
        const blobUrl = await uploadImageToBlob({
          imageUrl: placeholderUrl,
          filename: blobFilename,
        });
        return { url: blobUrl };
      } catch (error) {
        console.warn("Failed to upload placeholder to Blob, using direct URL");
      }
    }
    
    return { url: placeholderUrl };
  }

  // Use Vercel AI Gateway if configured, otherwise direct OpenAI
  const apiUrl = process.env.VERCEL_AI_GATEWAY_URL 
    ? `${process.env.VERCEL_AI_GATEWAY_URL}/v1/images/generations`
    : "https://api.openai.com/v1/images/generations";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      size,
      style,
      n: 1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Image generation failed: ${error}`);
  }

  const data = await response.json();
  const generatedUrl = data.data[0].url;
  const revisedPrompt = data.data[0].revised_prompt;

  // Upload to Blob storage if enabled
  if (uploadToBlob && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const filename = blobFilename || `dungeon-images/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      const blobUrl = await uploadImageToBlob({
        imageUrl: generatedUrl,
        filename,
      });
      return {
        url: blobUrl,
        revisedPrompt,
      };
    } catch (error) {
      console.error("Failed to upload to Blob storage, using original URL:", error);
      // Fallback to original URL if Blob upload fails
      return {
        url: generatedUrl,
        revisedPrompt,
      };
    }
  }

  return {
    url: generatedUrl,
    revisedPrompt,
  };
}

/**
 * Generate dungeon room image with consistent style
 */
export async function generateDungeonRoomImage(
  roomDescription: string,
  dungeonTheme: string,
  filename?: string
): Promise<string> {
  const prompt = `A creative, family-friendly dungeon room illustration in a fantasy style. ${dungeonTheme}. ${roomDescription}. Colorful, engaging, suitable for middle-grade children. No violence or scary elements.`;
  
  // Generate a filename if not provided
  const imageFilename = filename || `dungeon-rooms/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  
  const result = await generateImage({
    prompt,
    size: "1024x1024",
    style: "vivid",
    uploadToBlob: true,
    blobFilename: imageFilename,
  });

  return result.url;
}

