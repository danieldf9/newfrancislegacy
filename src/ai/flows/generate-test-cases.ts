'use server';

/**
 * @fileOverview AI flow for generating comprehensive QA test cases.
 *
 * This file defines the Genkit flow and prompt used to analyze Jira ticket
 * descriptions and acceptance criteria to produce structured test cases.
 *
 * - generateTestCases: A server function that wraps the AI flow.
 * - GenerateTestCasesInput: Input schema containing ticket details.
 * - GenerateTestCasesOutput: Output schema containing an array of test cases.
 */

import {ai} from '@/ai/genkit';
import { GenerateTestCasesInputSchema, GenerateTestCasesOutputSchema, type GenerateTestCasesInput, type GenerateTestCasesOutput } from '@/lib/schemas';


export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const generateTestCasesPrompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are an expert test case generator for Jira tickets. Your task is to generate a comprehensive set of test cases based on the provided Jira ticket description and acceptance criteria. The goal is to cover positive paths, negative paths, edge cases, and accessibility considerations.

Each test case must include the following fields:
- testCaseId: A unique identifier for the test case, following the format "{{projectKey}}-TEST-XXX" where XXX is a padded number (e.g., JIRA-TEST-001, JIRA-TEST-002).
- testCaseName: A concise, descriptive name for the test case, summarizing the action and expected outcome.
- description: A one-sentence summary of the test case's goal.
- precondition: The state or setup required before executing the test case (e.g., "User is logged in and on the dashboard page."). Can be "None" if not applicable.
- testSteps: A clear, ordered list of steps to execute the test case.
- expectedResult: A detailed description of the expected outcome after executing the test steps.
- actualResult: Leave this field blank.
- status: Leave this field blank.

Here is the Jira ticket information:
- Project Key: {{projectKey}}
- Description: {{{description}}}
- Acceptance Criteria: {{{acceptanceCriteria}}}

Based on this information, generate a complete list of test cases. Be thorough and think about different user scenarios. The output must be a JSON array of test case objects.
`,
});

const generateTestCasesFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFlow',
    inputSchema: GenerateTestCasesInputSchema,
    outputSchema: GenerateTestCasesOutputSchema,
  },
  async input => {
    const {output} = await generateTestCasesPrompt(input);
    if (!output) {
        console.warn("AI analysis for test cases returned no output.");
        return [];
    }
    return output;
  }
);
