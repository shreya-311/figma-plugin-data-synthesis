# Figma Data Synthesis Plugin

A Figma plugin that helps designers synthesize and visualize research data, such as interview transcripts, survey responses, and other qualitative data.

## Features

- Upload various file types (PDF, images, CSV, text files, audio/video)
- Add context information about research sessions
- Generate visualizations:
  - Theme analysis with quotes
  - Word clouds
  - Journey maps
  - Sentiment analysis
- Create and edit artboards with research insights
- Export visualizations to Figma frames

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. In Figma, go to Plugins > Development > Import plugin from manifest...
5. Select the manifest.json file from this repository

## Usage

1. Open the plugin in Figma
2. Upload your research data files
3. Add context information about the research session
4. Click "Process Data" to analyze the uploads
5. Use the visualization buttons to create different views of your data
6. Create a new artboard or add visualizations to an existing one
7. Edit and customize the visualizations as needed

## Development

### Prerequisites

- Node.js and npm
- Figma desktop app
- Basic knowledge of TypeScript and Figma plugin API

### Project Structure

```
figma-plugin-data-synthesis/
├── code.ts              # Main plugin code
├── ui.html             # Plugin UI
├── ui.ts              # UI logic
├── styles.css         # UI styles
├── manifest.json      # Plugin manifest
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript configuration
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run watch
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this code in your own projects!
