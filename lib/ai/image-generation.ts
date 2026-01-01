/**
 * Vercel AI Gateway integration for image generation
 * Uses OpenAI DALL-E or similar models through Vercel AI Gateway
 */

interface ImageGenerationOptions {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024";
  style?: "vivid" | "natural";
}

interface ImageGenerationResponse {
  url: string;
  revisedPrompt?: string;
}

export async function generateImage(
  options: ImageGenerationOptions
): Promise<ImageGenerationResponse> {
  const { prompt, size = "1024x1024", style = "vivid" } = options;

  if (!process.env.OPENAI_API_KEY) {
    // Return a placeholder if API key is not set (for development)
    console.warn("OPENAI_API_KEY is not set, returning placeholder");
    return {
      url: "https://via.placeholder.com/1024x1024/4a5568/ffffff?text=Dungeon+Room",
    };
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
  
  return {
    url: data.data[0].url,
    revisedPrompt: data.data[0].revised_prompt,
  };
}

/**
 * Generate dungeon room image with consistent style
 */
export async function generateDungeonRoomImage(
  roomDescription: string,
  dungeonTheme: string
): Promise<string> {
  const prompt = `A creative, family-friendly dungeon room illustration in a fantasy style. ${dungeonTheme}. ${roomDescription}. Colorful, engaging, suitable for middle-grade children. No violence or scary elements.`;
  
  const result = await generateImage({
    prompt,
    size: "1024x1024",
    style: "vivid",
  });

  return result.url;
}

