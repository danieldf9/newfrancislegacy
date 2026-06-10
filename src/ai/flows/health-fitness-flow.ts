
'use server';
/**
 * @fileOverview An AI-powered personalized health and fitness planner.
 *
 * - getHealthFitnessPlan - A function that generates a personalized meal and fitness plan.
 */

import { ai } from '@/ai/genkit';
import type { HealthFitnessInput, HealthFitnessOutput } from '@/lib/schemas';
import { HealthFitnessInputSchema, HealthFitnessOutputSchema } from '@/lib/schemas';
import { executeWithFallback } from '@/ai/fallback';


export async function getHealthFitnessPlan(input: HealthFitnessInput): Promise<HealthFitnessOutput> {
  return healthFitnessAnalysisFlow(input);
}

const healthFitnessAnalysisPrompt = ai.definePrompt({
    name: 'healthFitnessAnalysisPrompt',
    model: 'googleai/gemma-4-31b-it',
    input: { schema: HealthFitnessInputSchema },
    output: { schema: HealthFitnessOutputSchema },
    prompt: `You are an expert AI Health & Fitness Coach. Your task is to create a comprehensive, holistic, and personalized 4-week health and fitness plan based on the user's detailed profile.

User Profile:
- Age: {{age}}
- Weight: {{weightKg}} kg
- Height: {{heightCm}} cm
- Activity Level: {{activityLevel}}
- Medical History: {{{medicalHistory}}}
- Dietary Preferences & Restrictions: {{{dietaryPreferences}}}
- Fitness Goals: {{#each fitnessGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Fitness Experience Level: {{experienceLevel}}
- Available Equipment: {{{availableEquipment}}}
- Workout Preferences: {{#each workoutPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Injuries & Limitations: {{{injuriesLimitations}}}

Instructions:

1.  **Analyze User Profile**: Thoroughly analyze all provided data to understand the user's needs, goals, and constraints. Calculate their estimated daily calorie needs to support their goals (e.g., calorie deficit for weight loss, surplus for muscle gain).

2.  **Generate a 4-Week Fitness Plan**:
    *   Create a structured, progressive 4-week workout program.
    *   For each week, define a clear focus (e.g., "Week 1: Foundation Building", "Week 3: Intensity Increase").
    *   For each week, provide a plan for 3-5 workout days. Each day should have a clear title (e.g., "Day 1: Full Body Strength A", "Day 3: Active Recovery & Cardio").
    *   For each workout day, list 5-7 exercises.
    *   Select exercises based on the user's goals, experience level, available equipment, and limitations.
    *   For each exercise, specify the number of sets and repetitions (e.g., "3x10-12 reps").
    *   Ensure the plan is logical and progressive, gradually increasing difficulty.

3.  **Generate a Sample One-Day Nutrition Plan**:
    *   Create a balanced, one-day meal plan (Breakfast, Lunch, Dinner, 2 Snacks) that aligns with the user's estimated daily calorie needs and dietary preferences.
    *   For each meal, provide a dish name, simple ingredients, preparation instructions, and an estimated calorie count.
    *   Generate a simple, categorized grocery list based on this meal plan.

4.  **Define Progress Tracking Metrics**:
    *   Suggest 3-5 key metrics for the user to track their progress. These should be relevant to their goals (e.g., "Body Weight (weekly)", "Workout Weights Lifted", "Run/Walk Distance").

5.  **Set Up Gamification Elements**:
    *   Create a list of 5-7 starter achievements for the user to unlock. These should be motivating and cover both consistency and milestones.
    *   For each achievement, provide a \`name\` (e.g., "First Week Done!") and a \`description\` (e.g., "Completed all workouts in your first week.").

6.  **Provide AI Coach Recommendations**:
    *   Offer 3-5 clear, actionable, and personalized tips that combine fitness, nutrition, and mindset advice based on the user's complete profile. For example, "Since your goal is weight loss, focus on hitting your protein target in your meals to stay full and support muscle."

Your entire response must be a single, valid JSON object that strictly conforms to the output schema.
`,
});

const healthFitnessAnalysisFlow = ai.defineFlow(
  {
    name: 'healthFitnessAnalysisFlow',
    inputSchema: HealthFitnessInputSchema,
    outputSchema: HealthFitnessOutputSchema,
  },
  async (input) => {
    return await executeWithFallback(healthFitnessAnalysisPrompt, input);
  }
);
