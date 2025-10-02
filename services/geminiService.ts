import { GoogleGenAI } from "@google/genai";
import { Call } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll alert the user and prevent API calls.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateReportSummary = async (calls: Call[]): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Error: Gemini API key is not configured. Please set the API_KEY environment variable.";
    }

    const aggregatedData = calls.reduce((acc, call) => {
        acc.totalCalls += 1;
        acc.totalRevenue += call.revenue;
        acc.sources[call.source] = (acc.sources[call.source] || 0) + 1;
        acc.statuses[call.status] = (acc.statuses[call.status] || 0) + 1;
        return acc;
    }, {
        totalCalls: 0,
        totalRevenue: 0,
        sources: {} as Record<string, number>,
        statuses: {} as Record<string, number>,
    });

    const prompt = `
    You are a senior call tracking analyst providing a performance summary.
    Analyze the following call data and provide a concise, insightful report in markdown format.

    Data Summary:
    - Total Calls: ${aggregatedData.totalCalls}
    - Total Revenue: $${aggregatedData.totalRevenue.toFixed(2)}
    - Calls by Source: ${JSON.stringify(aggregatedData.sources)}
    - Calls by Status: ${JSON.stringify(aggregatedData.statuses)}

    Your report should:
    1.  Start with a title "### AI-Powered Performance Summary".
    2.  Provide a brief overview of the key metrics (total calls and revenue).
    3.  Identify the top-performing call source.
    4.  Comment on the call status distribution (e.g., answered vs. missed calls).
    5.  Conclude with one key, actionable insight or recommendation for improvement.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating report summary:", error);
        return "An error occurred while generating the AI summary. Please check the console for details.";
    }
};
