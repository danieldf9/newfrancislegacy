'use server';
/**
 * @fileOverview An AI-powered personalized nutrition planner.
 *
 * - getNutritionPlan - A function that generates a personalized meal plan and dietary advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { NutritionAnalysisInput, NutritionAnalysisOutput } from '@/lib/schemas';
import { NutritionAnalysisInputSchema, NutritionAnalysisOutputSchema } from '@/lib/schemas';
import { executeWithFallback } from '@/ai/fallback';


export async function getNutritionPlan(input: NutritionAnalysisInput): Promise<NutritionAnalysisOutput> {
  return nutritionAnalysisFlow(input);
}

const nutritionAnalysisPrompt = ai.definePrompt({
    name: 'nutritionAnalysisPrompt',
    input: { schema: NutritionAnalysisInputSchema },
    output: { schema: NutritionAnalysisOutputSchema },
    prompt: `You are an expert nutritionist and dietary planner. Your task is to create a personalized one-day meal plan and provide actionable dietary advice based on the user's health data.

User's Health Data:
- Age: {{age}}
- Weight: {{weightKg}} kg
- Height: {{heightCm}} cm
- Activity Level: {{activityLevel}}
- Medical History: {{{medicalHistory}}}
- Dietary Preferences & Restrictions: {{{dietaryPreferences}}}

Instructions:
1.  **Analyze Data**: Thoroughly analyze all the provided health data to understand the user's nutritional needs, goals, and constraints. Calculate their estimated daily calorie needs.
2.  **Generate a One-Day Meal Plan**: Create a balanced, one-day meal plan that includes breakfast, lunch, dinner, and two snack options.
    *   For each meal (e.g., "Breakfast", "Lunch"), provide a specific dish name (e.g., "Scrambled Eggs with Spinach and Whole Wheat Toast").
    *   For each dish, list the ingredients and provide simple preparation instructions.
    *   Estimate the calorie count for each meal.
3.  **Create a Grocery List**: Based on the meal plan, generate a simple grocery list. Group items by category (e.g., Produce, Protein, Dairy, Pantry).
4.  **Provide Dietary Advice**: Offer 3-5 clear, actionable, and personalized dietary advice points based on the user's data. For example, if they have a history of high blood pressure, suggest reducing sodium intake.
5.  **Give Allergy/Deficiency Alerts**: Based on the medical history and dietary preferences, identify and list any potential food allergies or nutritional deficiencies the user should be mindful of. If none are apparent, state that clearly.

Your entire response must be a single, valid JSON object that conforms to the output schema.
`,
});

const nutritionAnalysisFlow = ai.defineFlow(
  {
    name: 'nutritionAnalysisFlow',
    inputSchema: NutritionAnalysisInputSchema,
    outputSchema: NutritionAnalysisOutputSchema,
  },
  async (input) => {
    return await executeWithFallback(nutritionAnalysisPrompt, input);
  }
);
