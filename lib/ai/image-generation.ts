/**
 * Vercel AI Gateway integration for image generation
 * Uses Google Imagen through Vercel AI Gateway
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
    size = "512x512", // Default to smaller size
    style = "vivid",
    uploadToBlob = true,
    blobFilename
  } = options;

  // Check if we have AI Gateway configured
  const aiGatewayValue = process.env.AI_GATEWAY || process.env.VERCEL_AI_GATEWAY_URL;
  const isTokenFormat = aiGatewayValue?.startsWith("vck_") || aiGatewayValue?.startsWith("sk-");
  
  // Vercel AI Gateway URL
  const gatewayBaseUrl = isTokenFormat 
    ? "https://ai-gateway.vercel.sh/v1" 
    : aiGatewayValue?.endsWith("/v1") 
      ? aiGatewayValue 
      : aiGatewayValue?.endsWith("/")
        ? `${aiGatewayValue}v1`
        : `${aiGatewayValue}/v1`;
  const gatewayToken = isTokenFormat ? aiGatewayValue : undefined;
  const useGateway = !!aiGatewayValue;
  
  // Require AI Gateway
  if (!useGateway) {
    console.warn("AI_GATEWAY is not set, returning placeholder");
    const placeholderUrl = "https://via.placeholder.com/512x512/4a5568/ffffff?text=Dungeon+Room";
    return { url: placeholderUrl };
  }

  // Use AI Gateway endpoint
  const apiUrl = `${gatewayBaseUrl}/images/generations`;

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Use the AI Gateway token for authorization
  if (gatewayToken) {
    headers.Authorization = `Bearer ${gatewayToken}`;
  } else if (process.env.AI_GATEWAY_API_KEY) {
    headers.Authorization = `Bearer ${process.env.AI_GATEWAY_API_KEY}`;
  } else {
    headers.Authorization = `Bearer ${aiGatewayValue}`;
  }

  // Use Google Imagen - fast and reliable
  const modelName = "google/imagen-4.0-fast-generate-001";
  const imageSize = "512x512"; // Smaller size for faster generation and lower costs
  
  console.log(`Generating image via AI Gateway with model: ${modelName}, size: ${imageSize}`);
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: modelName,
        prompt,
        size: imageSize,
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Image generation failed (${response.status}): ${errorText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // Not JSON
      }
      throw new Error(errorMessage);
    }

    const responseText = await response.text();
    console.log(`Response status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
    console.log(`Response text length: ${responseText.length}, first 200 chars: ${responseText.substring(0, 200)}`);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error(`Invalid JSON response from image generation API`);
    }
    
    // Log the response structure (without the huge base64 string)
    console.log("Response structure:", {
      hasImages: !!data.images,
      imagesType: Array.isArray(data.images) ? "array" : typeof data.images,
      imagesLength: Array.isArray(data.images) ? data.images.length : "N/A",
      hasData: !!data.data,
      dataLength: Array.isArray(data.data) ? data.data.length : "N/A",
      firstDataKeys: data.data?.[0] ? Object.keys(data.data[0]) : [],
      hasUrl: !!data.url,
      topLevelKeys: Object.keys(data || {}),
    });
    
    // Handle different response formats
    let generatedUrl: string | undefined;
    let revisedPrompt: string | undefined;
    
    // OpenAI DALL-E format with b64_json: { data: [{ b64_json: "..." }] }
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      const imageData = data.data[0];
      
      // Check for b64_json (base64 encoded image)
      if (imageData.b64_json) {
        // Convert base64 to data URI
        generatedUrl = `data:image/png;base64,${imageData.b64_json}`;
        console.log("Extracted b64_json and converted to data URI");
      }
      // Check for url property
      else if (imageData.url) {
        generatedUrl = imageData.url;
        console.log("Extracted URL from data[0].url");
      }
      
      // Get revised prompt if available
      revisedPrompt = imageData.revised_prompt;
    }
    // Google Imagen format: { images: [{ image_url: { url: "data:image/..." } }] }
    else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      const imageData = data.images[0];
      
      // Check nested structure: image_url.url
      if (imageData.image_url) {
        if (typeof imageData.image_url === "object" && imageData.image_url.url) {
          generatedUrl = imageData.image_url.url;
          console.log("Extracted URL from image_url.url");
        } else if (typeof imageData.image_url === "string") {
          generatedUrl = imageData.image_url;
          console.log("Extracted URL from image_url (string)");
        }
      }
      // Fallback: direct url property
      if (!generatedUrl && imageData.url) {
        generatedUrl = imageData.url;
        console.log("Extracted URL from direct url property");
      }
      
      // Check for revised prompt in providerMetadata
      if (data.providerMetadata?.vertex?.images?.[0]?.revisedPrompt) {
        revisedPrompt = data.providerMetadata.vertex.images[0].revisedPrompt;
      }
    }
    // FLUX/other models format: { url: "..." }
    else if (data.url) {
      generatedUrl = data.url;
      revisedPrompt = data.revisedPrompt || data.revised_prompt;
    }
    // Array of URLs
    else if (Array.isArray(data) && data.length > 0 && data[0]?.url) {
      generatedUrl = data[0].url;
    }
    // Direct URL string
    else if (typeof data === "string") {
      generatedUrl = data;
    }
    
    if (!generatedUrl) {
      console.error(`Failed to extract URL from response. Structure:`, {
        hasImages: !!data.images,
        imagesLength: data.images?.length,
        firstImageKeys: data.images?.[0] ? Object.keys(data.images[0]) : [],
        imageUrlStructure: data.images?.[0]?.image_url,
        imageUrlType: typeof data.images?.[0]?.image_url,
        hasData: !!data.data,
        hasUrl: !!data.url,
        dataKeys: Object.keys(data || {}),
      });
      throw new Error(`Invalid response format from image generation API. Could not extract image URL.`);
    }
    
    console.log(`Successfully generated image using model: ${modelName}, URL type: ${generatedUrl.substring(0, 50)}...`);

    // Handle base64 data URI - convert to buffer and upload
    if (generatedUrl.startsWith("data:image")) {
      console.log(`Processing base64 image, length: ${generatedUrl.length}`);
      // Extract base64 data
      const base64Data = generatedUrl.split(",")[1];
      if (!base64Data) {
        throw new Error("Invalid base64 data URI format");
      }
      
      const buffer = Buffer.from(base64Data, "base64");
      console.log(`Converted to buffer, size: ${buffer.length} bytes`);
      
      // Upload directly to Blob
      if (uploadToBlob && process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const { put } = await import("@vercel/blob");
          const filename = blobFilename || `dungeon-images/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
          console.log(`Uploading to Blob storage: ${filename}`);
          const blob = await put(filename, buffer, {
            access: "public",
            contentType: "image/png",
          });
          console.log(`Successfully uploaded to Blob: ${blob.url}`);
          return {
            url: blob.url,
            revisedPrompt,
          };
        } catch (error) {
          console.error("Failed to upload base64 image to Blob:", error);
          // Fallback: return data URI (not ideal but works)
          console.log("Falling back to data URI");
          return {
            url: generatedUrl,
            revisedPrompt,
          };
        }
      }
      // If blob not configured, return data URI
      console.log("Blob storage not configured, returning data URI");
      return {
        url: generatedUrl,
        revisedPrompt,
      };
    }

    // Upload regular URL to Blob storage if enabled
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
  } catch (error) {
    console.error(`Image generation error with ${modelName}:`, error);
    throw error;
  }
}

/**
 * Character appearance type for image generation
 */
interface CharacterAppearance {
  gender?: string;
  race?: string;
  hairColor?: string;
  hairStyle?: string;
  eyeColor?: string;
  skinTone?: string;
  clothing?: string;
  accessories?: string[];
}

/**
 * Generate dungeon room image with consistent style, optionally including character
 */
export async function generateDungeonRoomImage(
  roomDescription: string,
  dungeonTheme: string,
  filename?: string,
  characterAppearance?: CharacterAppearance,
  characterAction?: string
): Promise<string> {
  let prompt = `A creative, family-friendly dungeon room illustration in a fantasy style. ${dungeonTheme}. ${roomDescription}.`;
  
  // Add character to the scene if appearance is provided
  if (characterAppearance) {
    const genderDesc = characterAppearance.gender === "Girl" ? "young girl" : "young boy";
    const characterDesc = `${genderDesc} ${characterAppearance.race || "Human"} character with ${characterAppearance.hairColor || "brown"} ${characterAppearance.hairStyle || "medium"} hair, ${characterAppearance.eyeColor || "brown"} eyes, ${characterAppearance.skinTone || "medium"} skin tone, wearing ${characterAppearance.clothing || "adventurer's gear"}`;
    const actionDesc = characterAction || "exploring and looking around";
    prompt += ` The character (${characterDesc}) is visible in the scene, ${actionDesc}.`;
  }
  
  prompt += ` Colorful, engaging, suitable for middle-grade children. No violence or scary elements.`;
  
  // Generate a filename if not provided
  const imageFilename = filename || `dungeon-rooms/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  
  const result = await generateImage({
    prompt,
    size: "512x512", // Smaller size for faster generation
    style: "vivid",
    uploadToBlob: true,
    blobFilename: imageFilename,
  });

  return result.url;
}
