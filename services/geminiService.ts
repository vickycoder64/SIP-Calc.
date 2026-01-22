import { GoogleGenAI } from "@google/genai";
import { InsightRequest } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFinancialInsights = async (data: InsightRequest): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key not configured.";

  const prompt = `
    I am using a SIP (Systematic Investment Plan) calculator.
    Here are my details:
    - Monthly Investment: ₹${data.inputs.monthlyInvestment}
    - Expected Return Rate: ${data.inputs.expectedReturn}% per annum
    - Time Period: ${data.inputs.timePeriod} years
    
    The results are:
    - Total Invested: ₹${data.results.investedAmount}
    - Estimated Returns: ₹${data.results.estimatedReturns}
    - Total Maturity Value: ₹${data.results.totalValue}

    Please provide 3 concise, actionable financial insights or observations about this investment plan. 
    Focus on the power of compounding, inflation adjustment, or comparison with traditional savings.
    Keep the tone professional yet encouraging. Format the response as a simple list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights available at this time.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to generate insights. Please try again later.";
  }
};