'use server';
/**
 * @fileOverview An AI-powered resume builder.
 *
 * - buildResume - A function that takes user details and generates a professional resume.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { ResumeBuilderInputSchema, ResumeBuilderOutputSchema, type ResumeBuilderInput, type ResumeBuilderOutput } from '@/lib/schemas';

export async function buildResume(input: ResumeBuilderInput): Promise<ResumeBuilderOutput> {
    return resumeBuilderFlow(input);
}

const resumeBuilderPrompt = ai.definePrompt({
    name: 'resumeBuilderPrompt',
    input: { schema: ResumeBuilderInputSchema },
    output: { schema: ResumeBuilderOutputSchema },
    prompt: `You are an expert resume writer and career coach. Your task is to take the user's provided information and generate a professional, well-formatted resume in Markdown. You will also provide actionable suggestions for improvement.

User's Information:
---
**Name:** {{name}}
**Contact:** {{email}} | {{phone}}

**Professional Summary:**
{{{professionalSummary}}}

**Work Experience:**
{{#each workExperience}}
- **Job Title:** {{jobTitle}}
- **Company:** {{company}} | {{location}}
- **Dates:** {{startDate}} - {{endDate}}
- **Responsibilities:**
  {{#each responsibilities}}
  - {{{this}}}
  {{/each}}
{{/each}}

**Education:**
{{#each education}}
- **Degree:** {{degree}}
- **Institution:** {{institution}} | {{location}}
- **Graduation Date:** {{graduationDate}}
{{/each}}

**Skills:**
{{#each skills}}
- {{{this}}}
{{/each}}
---

Instructions:

1.  **Generate Resume Markdown**:
    *   Create a clean, professional, and easy-to-read resume using standard Markdown formatting.
    *   Start with the user's name as a main heading (\`#\`), followed by their contact information.
    *   Create sections for "Professional Summary", "Work Experience", "Education", and "Skills" using level 2 headings (\`##\`).
    *   Under "Work Experience", for each job, list the responsibilities as bullet points. **Critically, rephrase these responsibilities into action-oriented achievements.** Start each bullet point with a strong action verb (e.g., "Led," "Developed," "Managed," "Achieved"). Quantify results wherever possible (e.g., "Increased efficiency by 20%").
    *   Format the rest of the sections neatly.

2.  **Generate Suggestions**:
    *   Provide a list of 3-5 concise, actionable suggestions for how the user could improve their resume content.
    *   These suggestions should be specific to the provided input. For example, if a responsibility is weak, suggest a stronger, more action-oriented phrasing. If skills are generic, suggest adding more specific technologies. If the summary is passive, suggest making it more impactful.

Your entire response must be a single, valid JSON object that strictly conforms to the output schema.
`,
});

const resumeBuilderFlow = ai.defineFlow(
  {
    name: 'resumeBuilderFlow',
    inputSchema: ResumeBuilderInputSchema,
    outputSchema: ResumeBuilderOutputSchema,
  },
  async (input) => {
    const { output } = await resumeBuilderPrompt(input);
    if (!output) {
      throw new Error("The AI failed to generate a resume. Please try adjusting your inputs.");
    }
    return output;
  }
);
