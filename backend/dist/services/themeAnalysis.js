"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeThemes = analyzeThemes;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("../config");
const openai = new openai_1.default({
    apiKey: config_1.config.openaiApiKey
});
const SYSTEM_PROMPT = `You are a UX research analysis expert. Your task is to analyze research text (like interview transcripts or notes) and identify key themes.

For each theme you identify:
1. Give it a clear, concise name
2. Count how many times it appears (frequency)
3. Extract 2-3 relevant quotes that best represent the theme

Return the analysis as a JSON array of themes, where each theme has:
- name: string (the theme name)
- frequency: number (how many times it appears)
- quotes: string[] (2-3 representative quotes)

Focus on identifying meaningful patterns and insights that would be valuable for UX research.`;
async function analyzeThemes(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4", // or "gpt-3.5-turbo" if you prefer
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Please analyze this research text and identify the key themes:\n\n${text}` }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });
        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error('No response from OpenAI');
        }
        const parsedResponse = JSON.parse(response);
        return parsedResponse.themes || [];
    }
    catch (error) {
        console.error('Error analyzing themes:', error);
        throw error;
    }
}
