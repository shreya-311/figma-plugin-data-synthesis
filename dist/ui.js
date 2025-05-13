"use strict";
// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeWithAI');
    const contextInfo = document.getElementById('contextInfo');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    if (!analyzeButton || !contextInfo) {
        console.error('Required elements not found');
        return;
    }
    // Function to show error message
    const showError = (message) => {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            if (successMessage)
                successMessage.style.display = 'none';
        }
    };
    // Function to show success message
    const showSuccess = (message) => {
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            if (errorMessage)
                errorMessage.style.display = 'none';
        }
    };
    // Function to enable/disable the analyze button
    const setAnalyzeButtonState = (enabled) => {
        analyzeButton.disabled = !enabled;
        analyzeButton.textContent = enabled ? 'Analyze with AI' : 'Analyzing...';
    };
    // Add click handler to the analyze button
    analyzeButton.addEventListener('click', async () => {
        const text = contextInfo.value.trim();
        if (!text) {
            showError('Please enter some research text to analyze');
            return;
        }
        try {
            // Disable button and show loading state
            setAnalyzeButtonState(false);
            showError('');
            // Send request to backend
            const response = await fetch('http://localhost:3000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            if (!result.themes || !Array.isArray(result.themes) || result.themes.length === 0) {
                throw new Error('No themes were found in the analysis');
            }
            // Send themes back to the plugin
            parent.postMessage({
                pluginMessage: {
                    type: 'create-visualization',
                    data: {
                        type: 'themes',
                        data: result.themes
                    }
                }
            }, '*');
            showSuccess('Analysis complete! Themes have been sent to the plugin.');
        }
        catch (error) {
            console.error('Error analyzing text:', error);
            showError(error instanceof Error ? error.message : 'An error occurred while analyzing the text');
        }
        finally {
            // Re-enable button
            setAnalyzeButtonState(true);
        }
    });
    // Enable/disable analyze button based on textarea content
    contextInfo.addEventListener('input', () => {
        analyzeButton.disabled = !contextInfo.value.trim();
    });
    // Initial button state
    analyzeButton.disabled = !contextInfo.value.trim();
});
