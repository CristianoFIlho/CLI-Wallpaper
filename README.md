# CLI Wallpaper Generator

A TypeScript-based tool that generates beautiful CLI cheat sheet wallpapers in multiple resolutions. Perfect for developers who want quick reference guides as their desktop backgrounds.

## Features

- 🎨 **Multiple CLI Tools**: Support for Git, Docker, Kubernetes, npm, and Salesforce CLI
- 📱 **Multiple Resolutions**: Generate wallpapers in 1920x1080, 2560x1440, and 3840x2160
- 🚀 **Easy to Use**: Simple command-line interface
- 🎯 **Extensible**: Easy to add new CLI tools
- 💻 **TypeScript**: Fully typed and maintainable code

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

### Generate wallpapers for a specific CLI tool:
```bash
npm run generate git
npm run generate docker
npm run generate kubernetes
npm run generate npm
npm run generate salesforce
```

### Generate wallpapers for all CLI tools:
```bash
npm run generate all
```

### List available CLI tools:
```bash
npm run generate list
```

### Show help:
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
- **2560x1440** (2K) - High-resolution displays
- **3840x2160** (4K) - Ultra-high-resolution displays

## Development

### Project Structure
```
src/
├── templates/
│   └── template.html          # Reusable HTML template
├── data/
│   ├── git.json               # Git commands data
│   ├── docker.json            # Docker commands data
│   ├── kubernetes.json        # Kubernetes commands data
│   ├── npm.json               # npm commands data
│   └── salesforce.json        # Salesforce CLI commands data
├── types/
│   └── index.ts               # TypeScript interfaces
├── generator.ts               # Core generation logic
└── index.ts                   # CLI entry point
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
- `npm run dev` - Run in development mode with ts-node
- `npm run generate` - Build and run the generator
- `npm run clean` - Clean build and output directories

## Dependencies

- **TypeScript**: Type-safe JavaScript development
- **Puppeteer**: Headless browser for screenshot generation
- **Node.js**: Runtime environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your CLI tool data or improvements
4. Test your changes
5. Submit a pull request

## License

MIT License - see LICENSE file for details
