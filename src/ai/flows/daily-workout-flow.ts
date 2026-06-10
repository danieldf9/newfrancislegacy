'use server';
/**
 * @fileOverview An AI flow to generate a single, on-demand workout session.
 */

import { ai } from '@/ai/genkit';
import { DailyWorkoutInputSchema, DailyWorkoutOutputSchema, type DailyWorkoutInput, type DailyWorkoutOutput } from '@/lib/schemas';
import { executeWithFallback } from '@/ai/fallback';

export async function getDailyWorkout(input: DailyWorkoutInput): Promise<DailyWorkoutOutput> {
  return dailyWorkoutFlow(input);
}

const dailyWorkoutPrompt = ai.definePrompt({
    name: 'dailyWorkoutPrompt',
    input: { schema: DailyWorkoutInputSchema },
    output: { schema: DailyWorkoutOutputSchema },
    prompt: `You are an expert AI Fitness Coach. Your task is to generate a complete, well-structured, and safe workout session for a user based on their profile and specific daily requests.

User's Base Profile:
- Fitness Goals: {{#each fitnessGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Experience Level: {{experienceLevel}}

Today's Workout Request:
- Desired Workout Type: {{workoutPreference}}
- Target Muscle Groups: {{targetMuscleGroups}}
- Desired Duration: {{workoutDuration}}
- Equipment Available Today: {{{availableEquipment}}}

Instructions:
1.  **Generate Workout Title & Type**: Create a descriptive title (e.g., "Full Body Strength & Conditioning") and a workout type that matches the user's preference (e.g., "Strength Training", "HIIT", "Yoga Flow").
2.  **Estimate Duration**: Provide a realistic estimated duration for the entire session that aligns with the user's request (e.g., "Approx. 45 minutes").
3.  **Structure the Workout in Phases**: The workout MUST have three distinct phases: "Warm-up", "Main Workout", and "Cool-down".
4.  **Populate Phases with Exercises**:
    *   **Warm-up**: Include 3-5 dynamic stretches and light cardio exercises (e.g., "Jumping Jacks", "Arm Circles"). For each, you must specify a 'duration' (e.g., "60 seconds").
    *   **Main Workout**: Include 5-8 exercises that align with the user's daily preferences. For each exercise, you **MUST** specify 'sets', 'reps' (e.g., "3x10-12 reps"), and a 'rest' period (e.g., "60 seconds rest"). Do not use the 'duration' field for this phase.
    *   **Cool-down**: Include 3-5 static stretches targeting the muscles worked. For each, you must specify a 'duration' (e.g., "Hold for 30 seconds").
5.  **Provide Clear Instructions**: For each exercise, provide a \`notes\` field with a brief, actionable tip on form or execution (e.g., "Keep your back straight and core engaged.").
6.  **Safety First**: Ensure the exercise selection is appropriate for the user's stated experience level. Avoid high-impact exercises if not suitable.

Your entire response must be a single, valid JSON object that strictly conforms to the output schema.
`,
});

const dailyWorkoutFlow = ai.defineFlow(
  {
    name: 'dailyWorkoutFlow',
    inputSchema: DailyWorkoutInputSchema,
    outputSchema: DailyWorkoutOutputSchema,
  },
  async (input) => {
    return await executeWithFallback(dailyWorkoutPrompt, input);
  }
);
