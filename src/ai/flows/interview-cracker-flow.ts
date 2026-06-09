'use server';
/**
 * @fileOverview An AI-powered interview preparation assistant.
 *
 * - getInterviewPlan - A function that generates a personalized interview preparation plan.
 */

import { ai } from '@/ai/genkit';
import type { InterviewCrackerInput } from '@/lib/schemas';
import { InterviewCrackerInputSchema } from '@/lib/schemas';
import { z } from 'zod';

const InterviewPlanSchema = z.object({
  plan: z.string().describe("A personalized interview preparation plan in Markdown format."),
});
type InterviewPlan = z.infer<typeof InterviewPlanSchema>;


export async function getInterviewPlan(input: InterviewCrackerInput): Promise<InterviewPlan> {
  return interviewCrackerFlow(input);
}

const interviewCrackerPrompt = ai.definePrompt({
    name: 'interviewCrackerPrompt',
    input: { schema: InterviewCrackerInputSchema },
    output: { schema: InterviewPlanSchema },
    prompt: `You are an expert career coach and interview preparation strategist. Your task is to create a personalized, actionable interview preparation plan for a user based on their profile.

User Profile:
- Target Job Role: {{jobRole}}
- Experience Level: {{experienceLevel}}
{{#if topics}}
- Specific Topics to Focus On: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

Instructions:
1.  **Create a Structured Plan**: Generate a plan in Markdown format. Use headings (##) for major sections like "Technical Skills," "Behavioral Questions," "System Design," etc.
2.  **Tailor the Content**: The content of the plan should be highly relevant to the specified job role and experience level.
3.  **Actionable Advice**: Provide concrete, actionable steps. Instead of "Practice algorithms," suggest "Focus on common array and string manipulation problems on LeetCode (Easy/Medium) and understand Big O notation."
4.  **Resource Suggestions**: Recommend specific types of resources (e.g., "Read the 'Grokking the System Design Interview' course," "Practice STAR method for behavioral questions").
5.  **Mock Interview Prep**: Include a section on how to prepare for mock interviews, both AI-driven and peer-to-peer.
6.  **Comprehensive Coverage**: Ensure the plan covers all key areas for the target role, which might include data structures, algorithms, system design, behavioral questions, and role-specific knowledge.

Your entire response must be a single JSON object with a "plan" field containing the Markdown text.
`,
});

const interviewCrackerFlow = ai.defineFlow(
  {
    name: 'interviewCrackerFlow',
    inputSchema: InterviewCrackerInputSchema,
    outputSchema: InterviewPlanSchema,
  },
  async (input) => {
    const { output } = await interviewCrackerPrompt(input);
    if (!output) {
      throw new Error("The AI failed to generate an interview plan. Please try again.");
    }
    return output;
  }
);
