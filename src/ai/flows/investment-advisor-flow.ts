'use server';
/**
 * @fileOverview An AI-powered investment portfolio advisor for the Indian market.
 *
 * - getInvestmentPortfolio - A function that generates a personalized portfolio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { InvestmentAdvisorInput, InvestmentAdvisorOutput } from '@/lib/schemas';
import { InvestmentAdvisorInputSchema, InvestmentAdvisorOutputSchema } from '@/lib/schemas';
import { executeWithFallback } from '@/ai/fallback';

// This is a mock function. In a real application, you would fetch this from a live API.
const getMockStockPrice = async (ticker: string): Promise<number> => {
    // Simulate some price variation based on ticker
    const basePrices: { [key: string]: number } = {
        'NIFTYBEES': 260,
        'MID150BEES': 210,
        'JUNIORBEES': 550,
        'GOLDBEES': 60,
        'LIQUIDBEES': 1000,
        'BANKBEES': 480,
    };
    const base = basePrices[ticker] || 100;
    const randomFactor = (Math.random() - 0.5) * 0.1; // +/- 5%
    return parseFloat((base * (1 + randomFactor)).toFixed(2));
}


const getStockPrice = ai.defineTool(
  {
    name: 'getStockPrice',
    description: 'Returns the current market price of a given Indian stock ETF ticker.',
    inputSchema: z.object({
      ticker: z.string().describe('The ticker symbol of the stock ETF on an Indian exchange (e.g., NIFTYBEES).'),
    }),
    outputSchema: z.number(),
  },
  async ({ ticker }) => {
    return getMockStockPrice(ticker);
  }
)


export async function getInvestmentPortfolio(input: InvestmentAdvisorInput): Promise<InvestmentAdvisorOutput> {
  return investmentAdvisorFlow(input);
}

const investmentAdvisorPrompt = ai.definePrompt({
    name: 'investmentAdvisorPrompt',
    tools: [getStockPrice],
    input: { schema: InvestmentAdvisorInputSchema },
    output: { schema: InvestmentAdvisorOutputSchema },
    prompt: `You are a savvy and responsible AI Investment Advisor for the **Indian market**. Your task is to create a sample diversified investment portfolio for a user in India based on their profile. Your response MUST be a single JSON object conforming to the output schema.

User Profile:
- Age: {{age}}
- Investment Amount: ₹{{investmentAmount}}
- Risk Tolerance: {{riskTolerance}}
- Investment Time Horizon: {{timeHorizon}}
- Financial Goals: {{{financialGoals}}}

Instructions:
1.  **Analyze User Profile**: Based on the user's risk tolerance, age, and time horizon, determine an appropriate asset allocation strategy.
    *   'low' risk: Conservative portfolio, heavy on debt funds and stable assets.
    *   'medium' risk: Balanced portfolio, a mix of equity and debt.
    *   'high' risk: Aggressive portfolio, heavy on growth-oriented equity funds.
2.  **Generate Portfolio Name and Summary**: Create a descriptive name for the portfolio (e.g., "Conservative Wealth Preservation", "Balanced Growth & Income", "Aggressive Future Builder") and write a brief summary explaining the strategy for an Indian investor, referencing their goals.
3.  **Create Asset Allocation**: Propose a diversified portfolio with 4-6 asset classes relevant to English. For each asset class:
    *   Provide a clear name (e.g., 'Indian Large-Cap Equity', 'Indian Mid-Cap Equity', 'Debt - Gilt Funds', 'Gold ETF').
    *   Suggest a common, real-world ETF or Mutual Fund ticker symbol available on Indian exchanges (NSE/BSE) that represents that asset class (e.g., NIFTYBEES for Nifty 50, JUNIORBEES for Nifty Next 50, GOLDBEES for Gold).
    *   Assign an allocation percentage. The total of all allocations MUST equal 100.
    *   **For each asset, use the getStockPrice tool to fetch its current price.**
    *   **Provide a 'rationale'**: Explain in 1-2 sentences why this asset class is a good fit for the user's profile and include its current price from the tool.
4.  **Projected Returns**: Provide a realistic, conservative annual return projection range in the 'range' field. In the 'disclaimer' field, you must include a clear disclaimer that these are not guaranteed returns and investing involves risk.
5.  **Recommended Next Steps**: List 3-4 clear, actionable next steps for a beginner investor in India, such as opening a Demat/trading account with popular Indian brokers, completing KYC, and setting up SIPs.

Example for a 'medium' risk profile in India:
{
  "portfolioName": "Balanced Indian Growth Portfolio",
  "summary": "This portfolio is designed for balanced growth and is suitable for Indian investors with a medium-term horizon and moderate risk tolerance. It mixes equity for growth with debt for stability.",
  "assetAllocation": [
    { "assetClass": "Indian Large-Cap Equity", "ticker": "NIFTYBEES", "allocationPercentage": 40, "rationale": "Provides exposure to India's top 50 companies for stable growth. The current price is ₹262.50." },
    { "assetClass": "Indian Mid-Cap Equity", "ticker": "MID150BEES", "allocationPercentage": 20, "rationale": "Targets the next generation of potential large-caps for higher growth potential. The current price is ₹208.10." },
    { "assetClass": "Indian Government Bonds", "ticker": "LIQUIDBEES", "allocationPercentage": 30, "rationale": "Offers stability and capital preservation through government securities. The current price is ₹1000.00." },
    { "assetClass": "Gold", "ticker": "GOLDBEES", "allocationPercentage": 10, "rationale": "Acts as a hedge against inflation and market volatility. The current price is ₹61.30." }
  ],
  "projectedReturns": {
    "range": "Projected long-term annual returns of 9-11%.",
    "disclaimer": "These are projections, not guarantees. All investments carry risk, including the potential loss of principal. Mutual fund and ETF investments are subject to market risks, read all scheme related documents carefully."
  },
  "recommendedNextSteps": [
    "Open a Demat & Trading account with a SEBI-registered broker like Zerodha, Groww, or Upstox.",
    "Complete your KYC (Know Your Customer) verification process.",
    "Fund your account with your initial investment amount.",
    "Consider setting up Systematic Investment Plans (SIPs) for the recommended ETFs/funds to invest regularly."
  ]
}

Generate the portfolio now based on the provided user profile for an Indian investor.
`,
});

const investmentAdvisorFlow = ai.defineFlow(
  {
    name: 'investmentAdvisorFlow',
    inputSchema: InvestmentAdvisorInputSchema,
    outputSchema: InvestmentAdvisorOutputSchema,
  },
  async (input) => {
    return await executeWithFallback(investmentAdvisorPrompt, input);
  }
);
