import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { CLIData, Resolution, RESOLUTIONS } from './types';

export class WallpaperGenerator {
  private templatePath: string;
  private outputPath: string;

  constructor() {
    this.templatePath = path.join(__dirname, 'templates', 'template.html');
    this.outputPath = path.join(process.cwd(), 'output');
  }

  /**
   * Load CLI data from JSON file
   */
  private loadCLIData(cliName: string): CLIData {
    const dataPath = path.join(__dirname, 'data', `${cliName}.json`);
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data) as CLIData;
  }

  /**
   * Generate HTML sections from CLI data
   */
  private generateSections(data: CLIData): string {
    return data.sections.map(section => {
      const commands = section.commands.map(command => `
        <div class="command">
          <div class="command-name">${command.name}</div>
          <div class="command-desc">${command.description}</div>
        </div>
      `).join('');

      return `
        <div class="column">
          <div class="section">
            <div class="section-title">${section.title}</div>
            ${commands}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Generate HTML content from template and data
   */
  private generateHTML(data: CLIData, resolution: Resolution): string {
    const template = fs.readFileSync(this.templatePath, 'utf8');
    const sections = this.generateSections(data);
    
    return template
      .replace('{{TITLE}}', data.title)
      .replace('{{RESOLUTION}}', resolution.name)
      .replace('{{SECTIONS}}', sections);
  }

  /**
   * Ensure output directory exists
   */
  private ensureOutputDir(cliName: string): void {
    const cliOutputDir = path.join(this.outputPath, cliName);
    if (!fs.existsSync(cliOutputDir)) {
      fs.mkdirSync(cliOutputDir, { recursive: true });
    }
  }

  /**
   * Generate screenshot for specific resolution
   */
  private async generateScreenshot(html: string, resolution: Resolution, cliName: string): Promise<void> {
    const browser = await chromium.launch({
      headless: true
    });

    try {
      const page = await browser.newPage();
      await page.setViewportSize({
        width: resolution.width,
        height: resolution.height
      });

      await page.setContent(html, { waitUntil: 'networkidle' });

      const outputDir = path.join(this.outputPath, cliName);
      const filename = `${cliName}-${resolution.name}.png`;
      const filepath = path.join(outputDir, filename);

      await page.screenshot({
        path: filepath,
        fullPage: true,
        type: 'png'
      });

      console.log(`✓ Generated ${filename}`);
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate wallpapers for a specific CLI
   */
  async generateForCLI(cliName: string): Promise<void> {
    console.log(`\n🎨 Generating wallpapers for ${cliName}...`);
    
    try {
      const data = this.loadCLIData(cliName);
      this.ensureOutputDir(cliName);

      // Generate screenshots for all resolutions
      for (const resolution of RESOLUTIONS) {
        const html = this.generateHTML(data, resolution);
        await this.generateScreenshot(html, resolution, cliName);
      }

      console.log(`✅ Successfully generated ${RESOLUTIONS.length} wallpapers for ${cliName}`);
    } catch (error) {
      console.error(`❌ Error generating wallpapers for ${cliName}:`, error);
      throw error;
    }
  }

  /**
   * Generate wallpapers for all available CLIs
   */
  async generateAll(): Promise<void> {
    const availableCLIs = ['salesforce', 'git', 'docker', 'kubernetes', 'npm'];
    
    console.log('🚀 Generating wallpapers for all CLI tools...');
    
    for (const cliName of availableCLIs) {
      await this.generateForCLI(cliName);
    }
    
    console.log('\n🎉 All wallpapers generated successfully!');
  }

  /**
   * List available CLI tools
   */
  listAvailableCLIs(): string[] {
    const dataDir = path.join(__dirname, 'data');
    return fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  }
}
