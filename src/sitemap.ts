import { DocData, SEOConfig } from './config';
import fs from 'fs/promises';
import path from 'path';

export const generateSitemap = async (
  docs: DocData[],
  config: SEOConfig,
  outputPath: string
): Promise<void> => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${docs
    .map(
      (doc) => `
  <url>
    <loc>${config.baseUrl}${doc.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  await fs.writeFile(path.join(outputPath, 'sitemap.xml'), sitemap);
};
