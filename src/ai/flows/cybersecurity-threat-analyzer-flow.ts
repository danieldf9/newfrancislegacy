'use server';
/**
 * @fileOverview An AI-powered cybersecurity threat analyzer.
 *
 * - analyzeForThreats - A function that analyzes a block of text for security threats.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { CybersecurityThreatAnalyzerInput, CybersecurityThreatAnalyzerOutput } from '@/lib/schemas';
import { CybersecurityThreatAnalyzerInputSchema, CybersecurityThreatAnalyzerOutputSchema } from '@/lib/schemas';
import { executeWithFallback } from '@/ai/fallback';

export async function analyzeForThreats(input: CybersecurityThreatAnalyzerInput): Promise<CybersecurityThreatAnalyzerOutput> {
  return cybersecurityThreatAnalyzerFlow(input);
}

const threatAnalysisPrompt = ai.definePrompt({
    name: 'threatAnalysisPrompt',
    input: { schema: CybersecurityThreatAnalyzerInputSchema },
    output: { schema: CybersecurityThreatAnalyzerOutputSchema },
    prompt: `You are an expert cybersecurity analyst. Your task is to meticulously analyze the provided text for any potential security threats, vulnerabilities, or malicious indicators. The text could be a code snippet, a server log, an email, a URL, or any other piece of text data.

Analyze the following text:
---
{{{text}}}
---

Instructions:
1.  **Assess Threat Level**: Based on your analysis, classify the threat level into one of the following categories: "None", "Low", "Medium", "High", or "Critical".
    *   "None": The text is completely benign.
    *   "Low": Contains suspicious elements but no direct threat (e.g., informational logs, mild spam).
    *   "Medium": Contains potential vulnerabilities or clear indicators of a possible attack that requires investigation (e.g., SQL injection attempt, suspicious script).
    *   "High": Contains a clear and immediate threat that requires urgent attention (e.g., active malware code, phishing link).
    *   "Critical": A severe threat indicating a compromise or a highly sophisticated attack.
2.  **Summarize Findings**: Write a concise summary explaining what you found. If there's a threat, explain what it is, why it's a risk, and what part of the text is problematic.
3.  **Provide Recommendations**: List clear, actionable steps that a user should take to mitigate the identified threat. If there is no threat, recommend general security best practices.
4.  **Extract Indicators of Compromise (IoCs)**: If you identify any specific IoCs, extract them into the \`indicatorsOfCompromise\` array. For each indicator, provide:
    *   \`type\`: The category of the indicator (e.g., 'IP Address', 'Domain', 'File Hash', 'URL', 'CVE').
    *   \`value\`: The actual value of the indicator (e.g., '192.168.1.100', 'malicious-site.com', 'a1b2c3d4...').
    *   \`context\`: A brief explanation of why this indicator is suspicious or relevant (e.g., "Known malicious IP", "Suspicious URL path", "Matches hash of known malware").
    *   If no IoCs are found, this array can be empty or omitted.

Your entire response must be a single JSON object that conforms to the output schema.
`,
});

const cybersecurityThreatAnalyzerFlow = ai.defineFlow(
  {
    name: 'cybersecurityThreatAnalyzerFlow',
    inputSchema: CybersecurityThreatAnalyzerInputSchema,
    outputSchema: CybersecurityThreatAnalyzerOutputSchema,
  },
  async (input) => {
    return await executeWithFallback(threatAnalysisPrompt, input);
  }
);
