import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { WallpaperGenerator } from './generator';
import { RESOLUTIONS } from './types';

const app = express();
const port = process.env.PORT || 3000;
const generator = new WallpaperGenerator();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../web')));
app.use('/output', express.static(path.join(__dirname, '../output')));

// API Routes
app.get('/api/clis', (req: Request, res: Response) => {
  try {
    const clis = generator.listAvailableCLIs();
    res.json({ success: true, data: clis });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get('/api/resolutions', (req: Request, res: Response) => {
  try {
    res.json({ success: true, data: RESOLUTIONS });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { cli, resolution } = req.body;
    
    if (!cli || !resolution) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: cli and resolution' 
      });
    }

    // Validate CLI exists
    const availableCLIs = generator.listAvailableCLIs();
    if (!availableCLIs.includes(cli)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid CLI: ${cli}` 
      });
    }

    // Validate resolution
    const validResolution = RESOLUTIONS.find(r => r.name === resolution);
    if (!validResolution) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid resolution: ${resolution}` 
      });
    }

    // Generate wallpaper
    await generator.generateForCLI(cli);
    
    res.json({ 
      success: true, 
      message: `Generated ${cli} wallpaper in ${resolution}`,
      imagePath: `/output/${cli}/${cli}-${resolution}.png`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get('/api/wallpapers', (req: Request, res: Response) => {
  try {
    const fs = require('fs');
    const outputDir = path.join(__dirname, '../output');
    
    if (!fs.existsSync(outputDir)) {
      return res.json({ success: true, data: [] });
    }

    const wallpapers = [];
    const cliDirs = fs.readdirSync(outputDir);
    
    for (const cliDir of cliDirs) {
      const cliPath = path.join(outputDir, cliDir);
      if (fs.statSync(cliPath).isDirectory()) {
        const files = fs.readdirSync(cliPath)
          .filter((file: string) => file.endsWith('.png'))
          .map((file: string) => ({
            cli: cliDir,
            filename: file,
            path: `/output/${cliDir}/${file}`,
            resolution: file.replace(`${cliDir}-`, '').replace('.png', '')
          }));
        wallpapers.push(...files);
      }
    }

    res.json({ success: true, data: wallpapers });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get('/api/preview/:cli/:resolution', async (req: Request, res: Response) => {
  try {
    const { cli, resolution } = req.params;
    
    // Check if wallpaper exists
    const imagePath = path.join(__dirname, '../output', cli, `${cli}-${resolution}.png`);
    const fs = require('fs');
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'Wallpaper not found. Generate it first.' 
      });
    }

    res.json({ 
      success: true, 
      imagePath: `/output/${cli}/${cli}-${resolution}.png`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Serve web interface
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📱 Web interface: http://localhost:${port}`);
  console.log(`🔧 API endpoints: http://localhost:${port}/api/*`);
});
