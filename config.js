import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI1_API_KEY });
export const conversation_limit = 30;
export const messagesToSummerize = 16;
export const conversationHistoryFile = "./conversation_history.json";
export const conversationHistoryAllTimeFolder = "./history";
export const memory_index = "./memory_index.json";
