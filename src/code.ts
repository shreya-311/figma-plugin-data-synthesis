/// <reference types="@figma/plugin-typings" />

interface VisualizationData {
  type: string;
  data: any;
}

interface ThemeData {
  name: string;
  frequency: number;
  quotes: string[];
}

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

interface WordData {
  text: string;
  size: number;
}

interface JourneyStep {
  phase: string;
  description: string;
}

figma.showUI(__html__, { width: 450, height: 600 });

// Handle messages from the UI
figma.ui.onmessage = async (msg: { type: string; data?: any }) => {
  if (msg.type === 'create-artboard') {
    const nodes: SceneNode[] = [];
    
    // Create a new frame
    const frame = figma.createFrame();
    frame.name = "Research Synthesis";
    frame.resize(1920, 1080);
    frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    nodes.push(frame);
    
    // Add title
    const title = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    title.fontName = { family: "Inter", style: "Bold" };
    title.characters = "Research Synthesis";
    title.fontSize = 48;
    title.x = 50;
    title.y = 50;
    frame.appendChild(title);

    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.currentPage.selection = nodes;
  }

  if (msg.type === 'create-visualization' && msg.data) {
    const data: VisualizationData = msg.data;
    await createVisualization(data);
  }

  if (msg.type === 'process-data') {
    // This would typically involve processing the uploaded files
    // For now, we'll just acknowledge receipt
    figma.ui.postMessage({ type: 'processing-complete' });
  }
};

async function createVisualization(data: VisualizationData) {
  const frame = figma.createFrame();
  frame.name = `${data.type} Visualization`;
  frame.resize(800, 600);
  
  switch (data.type) {
    case 'themes':
      await createThemeVisualization(frame, data.data as ThemeData[]);
      break;
    case 'wordcloud':
      await createWordCloudVisualization(frame, data.data as WordData[]);
      break;
    case 'journey':
      await createJourneyMapVisualization(frame, data.data as JourneyStep[]);
      break;
    case 'sentiments':
      await createSentimentVisualization(frame, data.data as SentimentData);
      break;
  }
}

async function createThemeVisualization(frame: FrameNode, themes: ThemeData[]) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  let yOffset = 50;
  for (const theme of themes) {
    const themeText = figma.createText();
    themeText.characters = `${theme.name} (${theme.frequency})`;
    themeText.x = 50;
    themeText.y = yOffset;
    frame.appendChild(themeText);
    yOffset += 30;

    // Add quotes
    for (const quote of theme.quotes) {
      const quoteText = figma.createText();
      quoteText.characters = `"${quote}"`;
      quoteText.x = 70;
      quoteText.y = yOffset;
      frame.appendChild(quoteText);
      yOffset += 20;
    }
    yOffset += 20;
  }
}

async function createWordCloudVisualization(frame: FrameNode, words: WordData[]) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  // Simple word cloud layout (random positions)
  for (const word of words) {
    const text = figma.createText();
    text.characters = word.text;
    text.fontSize = Math.max(12, Math.min(48, word.size));
    text.x = Math.random() * (frame.width - 100) + 50;
    text.y = Math.random() * (frame.height - 100) + 50;
    frame.appendChild(text);
  }
}

async function createJourneyMapVisualization(frame: FrameNode, steps: JourneyStep[]) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  let xOffset = 50;
  const yCenter = frame.height / 2;

  for (let i = 0; i < steps.length; i++) {
    // Create step circle
    const circle = figma.createEllipse();
    circle.resize(40, 40);
    circle.x = xOffset;
    circle.y = yCenter - 20;
    frame.appendChild(circle);

    // Create step text
    const text = figma.createText();
    text.characters = steps[i].phase;
    text.x = xOffset - 20;
    text.y = yCenter + 30;
    frame.appendChild(text);

    // Create line to next step if not last step
    if (i < steps.length - 1) {
      const line = figma.createLine();
      line.x = xOffset + 40;
      line.y = yCenter;
      line.strokeWeight = 2;
      line.resize(100, 0);
      frame.appendChild(line);
    }

    xOffset += 150;
  }
}

async function createSentimentVisualization(frame: FrameNode, sentiments: SentimentData) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  const total = sentiments.positive + sentiments.neutral + sentiments.negative;
  const barWidth = 300;
  const barHeight = 40;

  // Create bars for each sentiment
  const positiveWidth = (sentiments.positive / total) * barWidth;
  const neutralWidth = (sentiments.neutral / total) * barWidth;
  const negativeWidth = (sentiments.negative / total) * barWidth;

  // Positive bar
  const positiveBar = figma.createRectangle();
  positiveBar.resize(positiveWidth, barHeight);
  positiveBar.x = 50;
  positiveBar.y = 50;
  positiveBar.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.8, b: 0.2 } }];
  frame.appendChild(positiveBar);

  // Neutral bar
  const neutralBar = figma.createRectangle();
  neutralBar.resize(neutralWidth, barHeight);
  neutralBar.x = 50 + positiveWidth;
  neutralBar.y = 50;
  neutralBar.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
  frame.appendChild(neutralBar);

  // Negative bar
  const negativeBar = figma.createRectangle();
  negativeBar.resize(negativeWidth, barHeight);
  negativeBar.x = 50 + positiveWidth + neutralWidth;
  negativeBar.y = 50;
  negativeBar.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.2, b: 0.2 } }];
  frame.appendChild(negativeBar);
} 