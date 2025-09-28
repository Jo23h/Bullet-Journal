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

const mainPrompt = `Always think about the 20% that can give me 80% return - help me prioritize!`

export const sendQueryToGemini = async (userText) => {
    const prompt = `${mainPrompt} GEMINI_QUERY => ${userText}`;
    try{
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return text;

    } catch (err) {
        console.error("Some error:", err);
        return "An error occurred. Please try again.";
    }
}