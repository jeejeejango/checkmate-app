import { GoogleGenAI, Type } from "@google/genai";
import { TodoItem } from '../types';
import { Timestamp } from 'firebase/firestore';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateTasksFromGoal = async (goal: string): Promise<Omit<TodoItem, 'id'>[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the goal "${goal}", generate a concise to-do list of actionable steps.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tasks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "A single, actionable task."
                            }
                        }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);

        if (parsed.tasks && Array.isArray(parsed.tasks)) {
            return parsed.tasks.map((task: string) => ({
                text: task,
                completed: false,
                createdAt: Timestamp.now(),
            }));
        }

        return [];

    } catch (error) {
        console.error("Error generating tasks with Gemini:", error);
        throw new Error("Failed to generate AI-powered tasks. Please try again.");
    }
};

export const parseTasksFromVoice = async (transcript: string): Promise<Omit<TodoItem, 'id'>[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse the following text into a concise to-do list of distinct, actionable tasks. For example, if the input is "remind me to buy milk and also book a dentist appointment for Tuesday", the output should be ["Buy milk", "Book a dentist appointment for Tuesday"]. The input text is: "${transcript}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tasks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "A single, actionable task."
                            }
                        }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);

        if (parsed.tasks && Array.isArray(parsed.tasks)) {
            return parsed.tasks.map((task: string) => ({
                text: task,
                completed: false,
                createdAt: Timestamp.now(),
            }));
        }

        return [];

    } catch (error) {
        console.error("Error parsing tasks with Gemini:", error);
        throw new Error("Failed to parse AI-powered tasks. Please try again.");
    }
};
