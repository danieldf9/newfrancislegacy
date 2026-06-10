
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { RecipeSchema, CulinarySuggestionOutputSchema, type CulinarySuggestionOutput, type Recipe } from '@/lib/schemas';
import { executeWithFallback } from '@/ai/fallback';

const culinaryAssistantPrompt = ai.definePrompt({
    name: 'culinaryAssistantPrompt',
    prompt: `You are a friendly and knowledgeable AI Culinary Assistant. The user, {{userName}}, is asking for your help in the kitchen.
    
    Your capabilities are:
    1.  Provide recipes when asked.
    2.  Suggest what to make with a list of ingredients.
    3.  Answer general cooking questions.
    4.  Engage in witty, friendly, culinary-themed conversation.

    Analyze the user's query: "{{query}}"

    - If the user is asking for a specific recipe, or for ideas on what to cook, you MUST respond with a JSON object that strictly follows the 'Recipe' schema. The recipe should be creative and sound delicious.
    - If the user is asking a general cooking question or just chatting, you MUST respond with a JSON object containing a 'textResponse' field. Your response should be helpful, witty, and encouraging.

    **CRITICAL**: You must only return a single, valid JSON object. Do not return any other text, greetings, or apologies.
    `,
    input: {
        schema: z.object({
            query: z.string(),
            userName: z.string().optional(),
        })
    },
    output: {
        schema: CulinarySuggestionOutputSchema,
    }
});


export async function getCulinarySuggestion(query: string, userName?: string | null): Promise<CulinarySuggestionOutput> {
  try {
    const { output } = await culinaryAssistantPrompt({ query, userName: userName || 'buddy' });

    if (!output) {
        throw new Error("The AI did not return any output.");
    }
    
    // If the output is a recipe, generate an image for it.
    if ('recipeName' in output) {
        const recipe = output as Recipe;
        try {
            const imagePrompt = `A delicious, photorealistic, professional-quality photo of ${recipe.recipeName}, ${recipe.description}`;
            
            const { media } = await ai.generate({
                model: 'googleai/gemini-2.5-flash-image',
                prompt: imagePrompt,
                config: { responseModalities: ['TEXT', 'IMAGE'] },
            });
            
            if (media?.url) {
                recipe.imageDataUri = media.url;
            }

        } catch (imageError) {
            console.warn("Image generation failed for recipe, returning recipe without image.", imageError);
            // Non-blocking: If image generation fails, we still return the recipe.
        }
        return recipe;
    }

    // Otherwise, return the text response.
    return output;

  } catch (error: any) {
    console.error("Error in getCulinarySuggestion:", error);

    // Check for specific Google AI rate limit error
    if (error.message && error.message.includes('429')) {
      return { textResponse: "I'm very popular in the kitchen right now! Please wait a moment and try asking again." };
    }

    // Handle Zod validation errors from the prompt output
    if (error instanceof z.ZodError) {
        console.error("Zod Validation Error:", error.errors);
        return { textResponse: "I seem to have misplaced my recipe book... My apologies! Could you try asking in a different way?" };
    }
    
    // Handle JSON parsing errors if the model output is malformed
    if (error instanceof SyntaxError) {
        console.error("JSON Parsing Error:", error);
        return { textResponse: "I seem to have misplaced my recipe book... My apologies! Could you try asking in a different way?" };
    }


    // Generic fallback for other unexpected errors
    return { textResponse: "I'm sorry, but I've run into an unexpected problem in the kitchen. Please try asking something else." };
  }
}
    
