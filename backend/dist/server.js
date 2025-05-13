"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const themeAnalysis_1 = require("./services/themeAnalysis");
const app = (0, express_1.default)();
const port = config_1.config.port;
// Log environment variables (for debugging)
console.log('Environment variables loaded:', {
    port: config_1.config.port,
    nodeEnv: config_1.config.nodeEnv,
    hasApiKey: !!config_1.config.openaiApiKey
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', ((_req, res) => {
    res.json({ status: 'ok' });
}));
// Theme analysis endpoint
const analyzeHandler = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
            res.status(400).json({
                error: 'Invalid request: text field is required and must be a string',
                themes: []
            });
            return;
        }
        const themes = await (0, themeAnalysis_1.analyzeThemes)(text);
        res.json({ themes });
    }
    catch (error) {
        console.error('Error processing analysis request:', error);
        res.status(500).json({
            error: 'An error occurred while analyzing the text',
            themes: []
        });
    }
};
app.post('/analyze', analyzeHandler);
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
