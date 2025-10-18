#!/usr/bin/env node

import { WallpaperGenerator } from './generator';

async function main() {
  const generator = new WallpaperGenerator();
  const args = process.argv.slice(2);

  // Show help if no arguments or help flag
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp(generator);
    return;
  }

  const command = args[0].toLowerCase();

  try {
    switch (command) {
      case 'all':
        await generator.generateAll();
        break;
      
      case 'list':
        const availableCLIsList = generator.listAvailableCLIs();
        console.log('\n📋 Available CLI tools:');
        availableCLIsList.forEach(cli => console.log(`  • ${cli}`));
        break;
      
      default:
        // Check if it's a valid CLI name
        const availableCLIsDefault = generator.listAvailableCLIs();
        if (availableCLIsDefault.includes(command)) {
          await generator.generateForCLI(command);
        } else {
          console.error(`❌ Unknown CLI tool: ${command}`);
          console.log('\n📋 Available CLI tools:');
          availableCLIsDefault.forEach(cli => console.log(`  • ${cli}`));
          console.log('\nUse "npm run generate list" to see all available tools.');
          process.exit(1);
        }
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

function showHelp(generator: WallpaperGenerator) {
  const availableCLIs = generator.listAvailableCLIs();
  
  console.log(`
🎨 CLI Wallpaper Generator

USAGE:
  npm run generate <command>

COMMANDS:
  all                    Generate wallpapers for all CLI tools
  list                   List available CLI tools
  <cli-name>            Generate wallpapers for specific CLI tool

AVAILABLE CLI TOOLS:
${availableCLIs.map(cli => `  • ${cli}`).join('\n')}

EXAMPLES:
  npm run generate git           # Generate Git wallpapers
  npm run generate docker       # Generate Docker wallpapers
  npm run generate all          # Generate all wallpapers
  npm run generate list         # List available tools

OUTPUT:
  Wallpapers are saved to ./output/<cli-name>/
  Resolutions: 1920x1080, 2560x1440, 3840x2160

OPTIONS:
  --help, -h             Show this help message
`);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
