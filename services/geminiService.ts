
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Category, FinancialInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (
  transactions: Transaction[],
  categories: Category[],
  currency: string
): Promise<FinancialInsight[]> => {
  if (transactions.length === 0) return [];

  const summary = transactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId);
    return `${t.date}: ${t.type} ${t.amount} ${currency} for ${category?.name || 'Unknown'} (${t.note})`;
  }).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these transactions and provide 3 brief financial insights or tips in JSON format. 
      Transactions:
      ${summary}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['tip', 'warning', 'positive'] },
            },
            required: ['title', 'content', 'type'],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return [
      {
        title: "Track more data",
        content: "Add more transactions to get AI-powered financial insights.",
        type: "tip"
      }
    ];
  }
};
