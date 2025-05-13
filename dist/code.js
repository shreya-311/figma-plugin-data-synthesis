"use strict";
/// <reference types="@figma/plugin-typings" />
// Track the last created artboard position
let lastArtboardX = 0;
let lastArtboardY = 0;
const ARTBOARD_SPACING = 100;
// Show UI with enough height for all elements
figma.showUI(__html__, { width: 450, height: 600 });
// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
    console.log('Plugin received message:', msg);
    try {
        if (msg.type === 'process-data') {
            console.log('Processing data:', msg.data);
            // Store some sample data
            const processedData = {
                themes: [{ name: "Theme 1", quotes: ["Quote 1"] }],
                words: [{ text: "Sample", size: 24 }],
                journey: [{ phase: "Start", description: "Beginning" }],
                sentiments: { positive: 60, neutral: 30, negative: 10 }
            };
            // Store the processed data
            await figma.clientStorage.setAsync('processedData', processedData);
            console.log('Data processed and stored');
            // Enable visualization buttons
            figma.ui.postMessage({ type: 'processing-complete' });
        }
        if (msg.type === 'create-visualization') {
            console.log('Creating visualization:', msg.data);
            // Create a frame
            const frame = figma.createFrame();
            frame.name = `${msg.data.type} Visualization`;
            frame.resize(800, 600);
            frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            // Add a title
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            const title = figma.createText();
            title.characters = frame.name;
            title.x = 40;
            title.y = 40;
            frame.appendChild(title);
            // Position the frame
            if (figma.currentPage.selection.length > 0) {
                const lastSelection = figma.currentPage.selection[0];
                frame.x = lastSelection.x + lastSelection.width + 100;
                frame.y = lastSelection.y;
            }
            // Select and focus on the new frame
            figma.currentPage.selection = [frame];
            figma.viewport.scrollAndZoomIntoView([frame]);
        }
    }
    catch (error) {
        console.error('Error:', error);
        figma.ui.postMessage({
            type: 'error',
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
async function createNewArtboard(name = "Research Synthesis") {
    const nodes = [];
    // Create a new frame
    const frame = figma.createFrame();
    frame.name = name;
    frame.resize(1920, 1080);
    frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    // Position the new artboard next to the last one
    frame.x = lastArtboardX;
    frame.y = lastArtboardY;
    // Update the position for the next artboard
    lastArtboardX += frame.width + ARTBOARD_SPACING;
    // If we've gone too far right, start a new row
    if (lastArtboardX > 5000) { // Arbitrary limit
        lastArtboardX = 0;
        lastArtboardY += frame.height + ARTBOARD_SPACING;
    }
    nodes.push(frame);
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.currentPage.selection = nodes;
    return frame;
}
async function generateResearchReport(data) {
    // Create a new artboard for the report
    const reportFrame = await createNewArtboard("Research Report");
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    let yOffset = 50;
    const padding = 50;
    // Helper function to create text
    async function createText(content, isBold = false, size = 14) {
        const text = figma.createText();
        text.fontName = { family: "Inter", style: isBold ? "Bold" : "Regular" };
        text.characters = content;
        text.fontSize = size;
        text.x = padding;
        text.y = yOffset;
        reportFrame.appendChild(text);
        yOffset += text.height + 20;
        return text;
    }
    // Create sections
    const date = new Date().toLocaleDateString();
    await createText(data.projectName || "Untitled Research", true, 36);
    await createText(date, false, 14);
    // Executive Summary
    yOffset += 20;
    await createText("Executive Summary", true, 24);
    if (data.notes) {
        // In a real implementation, we would use NLP to generate a summary
        await createText(data.notes.slice(0, 200) + "...");
    }
    else {
        const missingInfo = await createText("⚠️ Add research notes to generate an executive summary");
        missingInfo.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.5, b: 0 } }];
    }
    // Goals
    yOffset += 20;
    await createText("Research Goals", true, 24);
    if (data.goals) {
        await createText(data.goals);
    }
    else {
        const missingInfo = await createText("⚠️ Add research goals");
        missingInfo.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.5, b: 0 } }];
    }
    // Methods
    yOffset += 20;
    await createText("Research Methods", true, 24);
    if (data.methods) {
        await createText(data.methods);
    }
    else {
        const missingInfo = await createText("⚠️ Add research methods");
        missingInfo.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.5, b: 0 } }];
    }
    // Insights
    yOffset += 20;
    await createText("Key Insights", true, 24);
    if (data.notes) {
        // In a real implementation, we would use NLP to extract insights
        await createText("• Insight 1\n• Insight 2\n• Insight 3");
    }
    else {
        const missingInfo = await createText("⚠️ Add research notes to generate insights");
        missingInfo.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.5, b: 0 } }];
    }
    // Next Steps
    yOffset += 20;
    await createText("Next Steps", true, 24);
    await createText("• Review and validate insights with stakeholders\n• Prioritize findings\n• Create action items");
}
async function createVisualization(data) {
    const frame = figma.createFrame();
    frame.name = `${data.type} Visualization`;
    frame.resize(800, 600);
    switch (data.type) {
        case 'themes':
            await createThemeVisualization(frame, data.data);
            break;
        case 'wordcloud':
            await createWordCloudVisualization(frame, data.data);
            break;
        case 'journey':
            await createJourneyMapVisualization(frame, data.data);
            break;
        case 'sentiments':
            await createSentimentVisualization(frame, data.data);
            break;
    }
}
async function createThemeVisualization(frame, themes) {
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
async function createWordCloudVisualization(frame, words) {
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
async function createJourneyMapVisualization(frame, steps) {
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
async function createSentimentVisualization(frame, sentiments) {
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
