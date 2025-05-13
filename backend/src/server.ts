import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import { config } from './config';
import { analyzeThemes } from './services/themeAnalysis';
import { AnalysisRequest, AnalysisResponse } from './types';

const app = express();
const port = config.port;

// Log environment variables (for debugging)
console.log('Environment variables loaded:', {
  port: config.port,
  nodeEnv: config.nodeEnv,
  hasApiKey: !!config.openaiApiKey
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', ((_req: Request, res: Response) => {
  res.json({ status: 'ok' });
}) as RequestHandler);

// Theme analysis endpoint
const analyzeHandler: RequestHandler = async (req: Request<{}, {}, AnalysisRequest>, res: Response<AnalysisResponse>): Promise<void> => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({
        error: 'Invalid request: text field is required and must be a string',
        themes: []
      });
      return;
    }

    const themes = await analyzeThemes(text);
    res.json({ themes });
  } catch (error) {
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