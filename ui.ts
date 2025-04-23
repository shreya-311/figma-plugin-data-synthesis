document.getElementById('fileUpload')?.addEventListener('change', handleFileUpload);
document.getElementById('processData')?.addEventListener('click', processData);
document.getElementById('createArtboard')?.addEventListener('click', createArtboard);
document.getElementById('generateThemes')?.addEventListener('click', generateThemes);
document.getElementById('createWordCloud')?.addEventListener('click', createWordCloud);
document.getElementById('showJourneyMap')?.addEventListener('click', showJourneyMap);
document.getElementById('showSentiments')?.addEventListener('click', showSentiments);

let uploadedFiles: File[] = [];
let processedData: any = null;

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    uploadedFiles = Array.from(input.files);
    document.getElementById('processData')?.removeAttribute('disabled');
  }
}

async function processData() {
  if (uploadedFiles.length === 0) {
    showError('Please upload files first');
    return;
  }

  const contextInfo = (document.getElementById('contextInfo') as HTMLTextAreaElement).value;
  const dataType = (document.getElementById('dataType') as HTMLSelectElement).value;

  // In a real implementation, we would process the files here
  // For now, we'll simulate processing with dummy data
  processedData = {
    themes: [
      {
        name: 'User Experience',
        frequency: 15,
        quotes: ['The interface is confusing', 'Navigation is not intuitive']
      },
      {
        name: 'Performance',
        frequency: 10,
        quotes: ['The app is slow', 'Takes too long to load']
      }
    ],
    words: [
      { text: 'experience', size: 48 },
      { text: 'interface', size: 36 },
      { text: 'navigation', size: 24 },
      { text: 'performance', size: 36 }
    ],
    journey: [
      { phase: 'Discovery', description: 'Initial contact' },
      { phase: 'Evaluation', description: 'Testing period' },
      { phase: 'Purchase', description: 'Decision making' },
      { phase: 'Onboarding', description: 'First use' }
    ],
    sentiments: {
      positive: 45,
      neutral: 30,
      negative: 25
    }
  };

  parent.postMessage({ pluginMessage: { type: 'process-data' } }, '*');
  enableVisualizationButtons();
}

function createArtboard() {
  parent.postMessage({ pluginMessage: { type: 'create-artboard' } }, '*');
}

function generateThemes() {
  if (!processedData) return;
  parent.postMessage({
    pluginMessage: {
      type: 'create-visualization',
      data: {
        type: 'themes',
        data: processedData.themes
      }
    }
  }, '*');
}

function createWordCloud() {
  if (!processedData) return;
  parent.postMessage({
    pluginMessage: {
      type: 'create-visualization',
      data: {
        type: 'wordcloud',
        data: processedData.words
      }
    }
  }, '*');
}

function showJourneyMap() {
  if (!processedData) return;
  parent.postMessage({
    pluginMessage: {
      type: 'create-visualization',
      data: {
        type: 'journey',
        data: processedData.journey
      }
    }
  }, '*');
}

function showSentiments() {
  if (!processedData) return;
  parent.postMessage({
    pluginMessage: {
      type: 'create-visualization',
      data: {
        type: 'sentiments',
        data: processedData.sentiments
      }
    }
  }, '*');
}

function enableVisualizationButtons() {
  const buttons = [
    'generateThemes',
    'createWordCloud',
    'showJourneyMap',
    'showSentiments'
  ];
  
  buttons.forEach(id => {
    document.getElementById(id)?.removeAttribute('disabled');
  });
}

function showError(message: string) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  document.querySelector('.container')?.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

// Listen for messages from the plugin code
onmessage = (event) => {
  const message = event.data.pluginMessage;
  if (message.type === 'processing-complete') {
    console.log('Processing complete');
  }
}; 