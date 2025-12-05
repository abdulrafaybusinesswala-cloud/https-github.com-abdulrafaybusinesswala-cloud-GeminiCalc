import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment");
  }
  return new GoogleGenAI({ apiKey });
};

export const solveMathProblem = async (prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful and precise math assistant. 
        Your goal is to solve math problems provided in natural language or standard notation.
        
        Rules:
        1. If the input is a direct math problem (e.g., "5 + 5", "sqrt(144)"), provide the step-by-step solution briefly, then the final result.
        2. If the input is a word problem, explain the reasoning clearly but concisely.
        3. Format the final answer clearly at the end, e.g., "Final Answer: 42".
        4. Use Markdown for formatting (bold, italic, code blocks).`,
        temperature: 0.1, // Low temperature for precision
      }
    });
    
    return response.text || "I couldn't generate a solution. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the AI service. Please check your API key or connection.";
  }
};