import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import path from 'path';
import { WallpaperGenerator } from '../src/generator';
import { RESOLUTIONS } from '../src/types';

const generator = new WallpaperGenerator();

// Helper function to handle CORS
const corsHandler = cors();

// API Routes
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  corsHandler(req, res, () => {});

  const { method, url } = req;

  try {
    switch (true) {
      case method === 'GET' && url === '/api/clis':
        return handleGetCLIs(req, res);
      
      case method === 'GET' && url === '/api/resolutions':
        return handleGetResolutions(req, res);
      
      case method === 'POST' && url === '/api/generate':
        return handleGenerate(req, res);
      
      case method === 'GET' && url === '/api/wallpapers':
        return handleGetWallpapers(req, res);
      
      case method === 'GET' && url?.startsWith('/api/preview/'):
        return handlePreview(req, res);
      
      default:
        res.status(404).json({ success: false, error: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

async function handleGetCLIs(req: VercelRequest, res: VercelResponse) {
  try {
    const clis = generator.listAvailableCLIs();
    res.json({ success: true, data: clis });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

async function handleGetResolutions(req: VercelRequest, res: VercelResponse) {
  try {
    res.json({ success: true, data: RESOLUTIONS });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

async function handleGenerate(req: VercelRequest, res: VercelResponse) {
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
}

async function handleGetWallpapers(req: VercelRequest, res: VercelResponse) {
  try {
    const fs = require('fs');
    const outputDir = path.join(process.cwd(), 'output');
    
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
}

async function handlePreview(req: VercelRequest, res: VercelResponse) {
  try {
    const { cli, resolution } = req.query as { cli: string; resolution: string };
    
    // Check if wallpaper exists
    const imagePath = path.join(process.cwd(), 'output', cli, `${cli}-${resolution}.png`);
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
}
