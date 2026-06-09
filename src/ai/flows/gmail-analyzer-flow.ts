
'use server';
/**
 * @fileOverview An AI-powered Gmail security analyzer.
 *
 * - analyzeGmail - A function that analyzes recent emails for security threats.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  EmailSchema,
  GmailAnalysisResultSchema,
  GmailAnalyzerFlowOutputSchema,
  type GmailAnalyzerFlowOutput,
} from '@/lib/schemas';
import { google } from 'googleapis';
import { getGoogleOAuth2Client, getTokensFromCookie } from '@/lib/google-auth';
import { analyzeForThreats } from './cybersecurity-threat-analyzer-flow';

// This function will now create an authenticated Gmail client using stored OAuth tokens.
async function getGmailClient() {
    const tokens = await getTokensFromCookie();
    if (!tokens) {
        console.warn("User has not authenticated with Google. Gmail API will not be called.");
        return null;
    }

    const client = await getGoogleOAuth2Client();
    client.setCredentials(tokens);

    // Optional: Handle token refreshing if needed (google-auth-library often handles this)
    if (tokens.expiry_date && new Date() > new Date(tokens.expiry_date)) {
        console.log("Access token expired, attempting to refresh...");
        try {
            const { credentials } = await client.refreshAccessToken();
            client.setCredentials(credentials);
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            // In a real app, you might want to re-trigger the auth flow.
            return null;
        }
    }

    return client;
}

const fetchLatestEmails = ai.defineTool(
  {
    name: 'fetchLatestEmails',
    description: 'Fetches the 5 most recent emails from the user\'s inbox.',
    outputSchema: z.array(EmailSchema),
  },
  async () => {
    const auth = await getGmailClient();
    if (!auth) {
        return [];
    }

    const gmail = google.gmail({version: 'v1', auth});
    try {
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 5,
            q: 'in:inbox',
        });

        const messages = response.data.messages || [];
        if (messages.length === 0) {
            return [];
        }

        const emails = await Promise.all(
            messages.map(async (message) => {
                const msg = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id!,
                    format: 'full',
                });

                const headers = msg.data.payload?.headers || [];
                const fromHeader = headers.find(h => h.name === 'From');
                const subjectHeader = headers.find(h => h.name === 'Subject');
                
                let body = '';
                if (msg.data.payload?.parts) {
                    const part = msg.data.payload.parts.find(p => p.mimeType === 'text/plain');
                    if (part?.body?.data) {
                        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
                    }
                } else if (msg.data.payload?.body?.data) {
                    body = Buffer.from(msg.data.payload.body.data, 'base64').toString('utf-8');
                }

                return {
                    from: fromHeader?.value || 'Unknown Sender',
                    subject: subjectHeader?.value || 'No Subject',
                    body: body.substring(0, 4000), // Truncate body for performance
                };
            })
        );
        return emails;
    } catch (error) {
        console.error("Failed to fetch emails from Gmail API:", error);
        return [];
    }
  }
);

const gmailAnalyzerFlow = ai.defineFlow(
  {
    name: 'gmailAnalyzerFlow',
    inputSchema: z.void(),
    outputSchema: GmailAnalyzerFlowOutputSchema,
  },
  async () => {
    const emails = await fetchLatestEmails();
    if (emails.length === 0) {
        const hasAuth = !!(await getTokensFromCookie());
        if (!hasAuth) {
          return { results: [], error: "Could not fetch emails. Please connect your Gmail account to see a real analysis." };
        }
        return { results: [], error: "No recent emails found in your inbox." };
    }
    
    const analysisPromises = emails.map(async (email) => {
        const emailContentToAnalyze = `From: ${email.from}\nSubject: ${email.subject}\n\n${email.body}`;
        const analysis = await analyzeForThreats({ text: emailContentToAnalyze });
        return { email, analysis };
    });

    const results = await Promise.all(analysisPromises);
    
    return { results };
  }
);

export async function analyzeGmail(): Promise<GmailAnalyzerFlowOutput> {
    return gmailAnalyzerFlow();
}

export async function checkGmailAuthStatus(): Promise<{ isConnected: boolean }> {
    const tokens = await getTokensFromCookie();
    return { isConnected: !!tokens };
}

export async function disconnectGmail(): Promise<void> {
    const { clearTokenCookie } = await import('@/lib/google-auth');
    await clearTokenCookie();
}
