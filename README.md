# CLI Wallpaper Generator

A TypeScript-based tool that generates beautiful CLI cheat sheet wallpapers in multiple resolutions. Perfect for developers who want quick reference guides as their desktop backgrounds.

## Features

- 🎨 **Multiple CLI Tools**: Support for Git, Docker, Kubernetes, npm, and Salesforce CLI
- 📱 **Multiple Resolutions**: Generate wallpapers in 1920x1080, 2560x1440, and 3840x2160
- 🚀 **Easy to Use**: Simple command-line interface and web interface
- 🎯 **Extensible**: Easy to add new CLI tools
- 💻 **TypeScript**: Fully typed and maintainable code
- 🌐 **Web Interface**: Interactive web app for on-demand generation
- 📊 **Resolution Scaling**: Proper text scaling for each resolution
- 🎭 **Playwright**: Modern browser automation for better screenshots

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CLI-Wallpaper
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### Web Interface (Recommended)

Start the web server:
```bash
npm run server
```

Open your browser and navigate to `http://localhost:3000`

**Features:**
- Interactive CLI tool selection
- Resolution picker with preview
- Real-time wallpaper generation
- Live preview of generated wallpapers
- Gallery with search and filtering
- One-click download

### Command Line Interface

#### Generate wallpapers for a specific CLI tool:
```bash
npm run generate git
npm run generate docker
npm run generate kubernetes
npm run generate npm
npm run generate salesforce
```

#### Generate wallpapers for all CLI tools:
```bash
npm run generate all
```

#### List available CLI tools:
```bash
npm run generate list
```

#### Show help:
```bash
npm run generate --help
```

## Available CLI Tools

- **Git**: Version control commands (clone, commit, push, pull, branch, merge, etc.)
- **Docker**: Container management (run, build, images, compose, etc.)
- **Kubernetes**: Container orchestration (kubectl commands)
- **npm**: Package management (install, run, publish, etc.)
- **Salesforce**: SF CLI commands (org management, deployment, etc.)

## Output

Wallpapers are saved to the `./output/` directory with the following structure:
```
output/
├── git/
│   ├── git-1920x1080.png
│   ├── git-2560x1440.png
│   └── git-3840x2160.png
├── docker/
│   ├── docker-1920x1080.png
│   ├── docker-2560x1440.png
│   └── docker-3840x2160.png
└── ...
```

## Resolutions

- **1920x1080** (Full HD) - Most common desktop resolution
- **2560x1440** (2K) - High-resolution displays with 1.33x scaling
- **3840x2160** (4K) - Ultra-high-resolution displays with 2x scaling

## Development

### Project Structure
```
src/
├── templates/
│   └── template.html          # Reusable HTML template with resolution scaling
├── data/
│   ├── git.json               # Git commands data
│   ├── docker.json            # Docker commands data
│   ├── kubernetes.json        # Kubernetes commands data
│   ├── npm.json               # npm commands data
│   └── salesforce.json        # Salesforce CLI commands data
├── types/
│   └── index.ts               # TypeScript interfaces
├── generator.ts               # Core generation logic with Playwright
├── server.ts                  # Express API server
└── index.ts                   # CLI entry point

web/
├── index.html                 # Web interface
├── styles.css                 # Frontend styling
└── app.js                     # Frontend JavaScript
```

### Adding New CLI Tools

1. Create a new JSON file in `src/data/` with the CLI name (e.g., `aws.json`)
2. Follow the existing structure:
```json
{
  "title": "AWS CLI",
  "sections": [
    {
      "title": "Section Name",
      "commands": [
        { "name": "aws command", "description": "Command description" }
      ]
    }
  ]
}
```
3. The tool will automatically detect the new CLI and make it available

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run CLI in development mode with ts-node
- `npm run generate` - Build and run the CLI generator
- `npm run server` - Start Express web server
- `npm run dev:server` - Start server in development mode
- `npm start` - Start web server (alias for server)
- `npm run clean` - Clean build and output directories

## API Endpoints

The web server provides the following REST API endpoints:

- `GET /api/clis` - List available CLI tools
- `GET /api/resolutions` - List available resolutions
- `POST /api/generate` - Generate wallpaper on demand
- `GET /api/wallpapers` - List all generated wallpapers
- `GET /api/preview/:cli/:resolution` - Get preview of specific wallpaper

## Dependencies

- **TypeScript**: Type-safe JavaScript development
- **Playwright**: Modern browser automation for screenshots
- **Express**: Web server framework
- **CORS**: Cross-origin resource sharing
- **Node.js**: Runtime environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your CLI tool data or improvements
4. Test your changes
5. Submit a pull request

## License

MIT License - see LICENSE file for details
