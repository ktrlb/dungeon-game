/**
 * Vercel Blob storage integration for image storage
 */
import { put } from "@vercel/blob";

interface UploadImageOptions {
  imageUrl: string;
  filename: string;
  contentType?: string;
}

/**
 * Download image from URL and upload to Vercel Blob storage
 */
export async function uploadImageToBlob(
  options: UploadImageOptions
): Promise<string> {
  const { imageUrl, filename, contentType = "image/png" } = options;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set. Please configure Vercel Blob storage.");
  }

  try {
    // Download the image from the generated URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBlob = await imageResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: "public",
      contentType,
    });

    return blob.url;
  } catch (error) {
    console.error("Error uploading image to Blob storage:", error);
    throw error;
  }
}

/**
 * Upload image buffer directly to Blob storage
 */
export async function uploadBufferToBlob(
  buffer: Buffer,
  filename: string,
  contentType: string = "image/png"
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set. Please configure Vercel Blob storage.");
  }

  try {
    const blob = await put(filename, buffer, {
      access: "public",
      contentType,
    });

    return blob.url;
  } catch (error) {
    console.error("Error uploading buffer to Blob storage:", error);
    throw error;
  }
}

