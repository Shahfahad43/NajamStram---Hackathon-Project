import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI Safely
// We check if the key exists to avoid immediate constructor errors causing a white screen
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey.length > 0) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.warn("Failed to initialize GoogleGenAI. AI features will be disabled.", error);
  }
}

export const generateStreamTitle = async (topic: string): Promise<string> => {
  if (!ai) {
    return "AI Title Generation Unavailable (Check API Key)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a catchy, exciting title for a live stream about the FIFA World Cup 2034 in Saudi Arabia. 
      The specific topic is: "${topic}". 
      Keep it short (under 60 characters), energetic, and suitable for a sports streaming platform. 
      Return only the title text, nothing else.`,
    });
    
    return response.text ? response.text.trim() : `Live: ${topic}`;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Live: ${topic}`; // Fallback title
  }
};

export const generateMatchPrediction = async (match: string): Promise<string> => {
  if (!ai) {
    return "Prediction Unavailable";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very brief, fun, 2-sentence prediction for the football match: ${match}. Focus on the excitement of the 2034 World Cup in Saudi Arabia.`,
    });
    
    return response.text ? response.text.trim() : "Prediction unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Prediction currently unavailable. Tune in to watch!";
  }
};

export const generateTacticalInsight = async (streamTitle: string, tags: string[]): Promise<string> => {
  if (!ai) {
    return "AI Analysis Unavailable";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert football commentator for the 2034 World Cup. 
      Based on the stream title "${streamTitle}" and tags "${tags.join(', ')}", provide a short (max 2 sentences) tactical insight or interesting fact to engage the viewers. 
      Sound professional but excited.`,
    });
    
    return response.text ? response.text.trim() : "Enjoy the match!";
  } catch (error) {
    return "Keep an eye on the midfield battle, that's where the game will be won today!";
  }
};