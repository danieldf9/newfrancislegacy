
'use server';

import { ai } from '@/ai/genkit';
import { GenerateImageInputSchema, GenerateImageOutputSchema, type GenerateImageInput, type GenerateImageOutput } from '@/lib/schemas';

// Define the Genkit flow for generating an image
const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ prompt, aspectRatio }) => {
    
    // Note: Switched to gemini-2.5-flash-image as it's more likely to be on free tier.
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image', 
        prompt: `A high-quality, photorealistic image of: ${prompt}. The image should have an aspect ratio of ${aspectRatio || '16:9'}.`,
        config: {
            // This model requires specifying response modalities.
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed. The model did not return any media.');
    }

    return { imageData: media.url };
  }
);


// Export the server action that can be called from the client
export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  // Input validation is handled by Zod inside the Genkit flow
  return generateImageFlow(input);
}
