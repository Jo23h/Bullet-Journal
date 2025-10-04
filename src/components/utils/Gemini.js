import {GoogleGenerativeAI} from '@google/generative-ai'

const geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(geminiAPIKey)

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
}

const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-preview-05-20',
    generationConfig
})

import bulletJournalService from '../../services/bulletJournal';

const mainPrompt = `help me not procrastinate!`;

export const sendQueryToGemini = async (userText) => {
    // combines predefined prompt with question
    const prompt = `${mainPrompt} GEMINI_QUERY => ${userText}`;
    try {

        // ends the combined prompt to gemini
        const response = await bulletJournalService.sendChatMessage(prompt);
        return response;
    } catch (err) {
        console.error("Error communicating with Gemini:", err);
        return "An error occurred. Please try again.";
    }
}