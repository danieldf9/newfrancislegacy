'use server';
/**
 * @fileOverview An AI-powered mock interview flow.
 */

import { ai } from '@/ai/genkit';
import type { MockInterviewState, MockInterviewOutput } from '@/lib/schemas';
import { MockInterviewStateSchema, MockInterviewOutputSchema } from '@/lib/schemas';

const mockInterviewPrompt = ai.definePrompt({
    name: 'mockInterviewPrompt',
    input: { schema: MockInterviewStateSchema },
    output: { schema: MockInterviewOutputSchema },
    prompt: `You are an expert interviewer conducting a mock interview for a '{{jobRole}}' position with a candidate of '{{experienceLevel}}' experience. The interview should focus on these topics: {{#if topics}}{{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}a mix of technical and behavioral questions{{/if}}.

Conversation History:
---
{{#each history}}
- {{role}}: {{content}}
{{/each}}
---

Your Task:
Based on the conversation history, analyze the user's last response and then formulate your next turn.

1.  **If the user has just provided an answer** (i.e., the last message in the history is from the user):
    *   **Provide Feedback**: Write brief, constructive feedback on their answer. If it's a behavioral question, assess if they used a structure like STAR. If technical, assess correctness and clarity. Keep feedback to 2-3 sentences.
    *   **Ask the Next Question**: Formulate the next logical question based on the role, topics, and interview progression.
2.  **If this is the beginning of the interview** (i.e., history is empty) or if you just asked a question:
    *   **Ask a Question**: Formulate the first or next interview question. Do not provide feedback. If the history is empty, start with a greeting like "Hello! Thanks for coming in. Let's start with a classic: Tell me about yourself."

**Output Format**:
Your response MUST be a single, valid JSON object.
- Include a "feedback" field ONLY if you are providing feedback on a user's answer.
- Always include a "question" field with the next question you are asking.
`,
});

export async function getMockInterviewResponse(input: MockInterviewState): Promise<MockInterviewOutput> {
    const { output } = await mockInterviewPrompt(input);
    if (!output) {
      throw new Error("The AI failed to respond. Please try again.");
    }
    return output;
}
