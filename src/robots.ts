import { SEOConfig } from './config';
import fs from 'fs/promises';
import path from 'path';

export const generateRobots = async (config: SEOConfig, outputPath: string): Promise<void> => {
  const robots = `User-agent: *
Allow: /

Sitemap: ${config.baseUrl}/sitemap.xml`;

  await fs.writeFile(path.join(outputPath, 'robots.txt'), robots);
};
