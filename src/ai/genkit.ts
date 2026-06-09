import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Global Genkit instance configured for production use.
 * 
 * Plugins:
 * - googleAI: Official plugin for Google Gemini models.
 * 
 * Default Model:
 * - gemini-1.5-flash: High-performance, stable production model for text tasks.
 * 
 * This instance automatically uses the GEMINI_API_KEY from environment variables.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
});
