#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { SEOConfig, DocData, DEFAULT_CONFIG } from './config';
import { generateSitemap } from './sitemap';
import { generateRobots } from './robots';
import { generateStructuredData } from './structured-data';

export class JengaSEO {
  private config: SEOConfig;
  private cache: Map<string, string> = new Map();

  constructor(config: SEOConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config } as SEOConfig;
  }

  private _validateConfig = (): void => {
    if (!this.config.baseUrl) {
      throw new Error('Base URL is required');
    }
    if (!this.config.author) {
      throw new Error('Author is required');
    }
  };

  private _validateDocData = (doc: DocData): void => {
    if (!doc.title) {
      throw new Error('Title is required in document data');
    }
    if (!doc.description) {
      throw new Error('Description is required in document data');
    }
    if (!doc.path) {
      throw new Error('Path is required in document data');
    }
  };

  private _readDataFile = async (dataPath: string): Promise<DocData[]> => {
    try {
      const dataFilePath = path.resolve(process.cwd(), dataPath);
      printInfo(`Reading data file from: ${dataFilePath}`);

      if (!fs.existsSync(dataFilePath)) {
        throw new Error(`File not found: ${dataFilePath}`);
      }

      const data = await fs.promises.readFile(dataFilePath, 'utf8');
      const docs = JSON.parse(data);

      if (!Array.isArray(docs)) {
        throw new Error(`Data file must contain an array of documents. Found: ${typeof docs}`);
      }

      if (docs.length === 0) {
        throw new Error('Data file contains an empty array');
      }

      docs.forEach((doc) => this._validateDocData(doc));
      return docs;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      printError(errorMessage);
      throw error;
    }
  };

  private _generateTemplate = (doc: DocData): string => {
    const cacheKey = `${doc.path}-${doc.title}`;
    if (this.config.cache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const keywords = doc.keywords ? doc.keywords.join(', ') : '';
    const image = doc.image || this.config.defaultImage;
    const language = doc.language || this.config.language;
    const structuredData = doc.structuredData || this.config.structuredData;

    const template = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title}</title>
  <meta name="description" content="${doc.description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="${this.config.author}">
  <meta property="og:title" content="${doc.title}">
  <meta property="og:description" content="${doc.description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${this.config.baseUrl}${doc.path}">
  ${this.config.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}"></script>` : ''}
  ${structuredData ? `<script type="application/ld+json">${JSON.stringify(generateStructuredData(doc, this.config))}</script>` : ''}
</head>
<body>
  <script>
    window.location.href = '${this.config.baseUrl}${doc.path}';
  </script>
</body>
</html>
    `.trim();

    if (this.config.cache) {
      this.cache.set(cacheKey, template);
    }

    return template;
  };

  public generate = async (dataPath: string, outputPath: string): Promise<void> => {
    this._validateConfig();
    const docs = await this._readDataFile(dataPath);

    const resolvedOutputPath = path.resolve(process.cwd(), outputPath);
    if (!fs.existsSync(resolvedOutputPath)) {
      fs.mkdirSync(resolvedOutputPath, { recursive: true });
    }

    const generatePromises = docs.map(async (doc) => {
      const template = this._generateTemplate(doc);
      const filePath = path.join(resolvedOutputPath, doc.path, 'index.html');
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, template);
    });

    if (this.config.parallel) {
      await Promise.all(generatePromises);
    } else {
      for (const promise of generatePromises) {
        await promise;
      }
    }

    if (this.config.sitemap) {
      await generateSitemap(docs, this.config, resolvedOutputPath);
    }

    if (this.config.robots) {
      await generateRobots(this.config, resolvedOutputPath);
    }
  };
}

const printBanner = (): void => {
  console.log('\n' + chalk.bold.cyan('Jenga-SEO') + chalk.gray(' - SEO Template Generator\n'));
};

const printSuccess = (message: string): void => {
  console.log(chalk.green('✓') + ' ' + message);
};

const printInfo = (message: string): void => {
  console.log(chalk.blue('ℹ') + ' ' + message);
};

const printError = (message: string): void => {
  console.error(chalk.red('✖') + ' ' + chalk.red('Error: ') + message);
};

export const cli = async (): Promise<void> => {
  printBanner();

  const program = new Command();

  program
    .name('jenga-seo')
    .description('Generate SEO-friendly static HTML templates for SPAs')
    .version('1.1.1')
    .requiredOption('-d, --data <path>', chalk.cyan('Path to docs.json file'))
    .requiredOption(
      '-o, --output <path>',
      chalk.cyan('Output directory for generated files'),
      'public/link'
    )
    .option('-b, --base-url <url>', chalk.cyan('Base URL for your site'), DEFAULT_CONFIG.baseUrl)
    .option('-a, --author <n>', chalk.cyan('Author name'), DEFAULT_CONFIG.author)
    .option('-i, --image <url>', chalk.cyan('Default image URL'), DEFAULT_CONFIG.defaultImage)
    .option('-g, --ga-id <id>', chalk.cyan('Google Analytics ID'))
    .option('-l, --language <lang>', chalk.cyan('Default language'), DEFAULT_CONFIG.language)
    .option('--no-robots', chalk.cyan('Disable robots.txt generation'))
    .option('--no-sitemap', chalk.cyan('Disable sitemap.xml generation'))
    .option('--no-cache', chalk.cyan('Disable template caching'))
    .option('--no-parallel', chalk.cyan('Disable parallel processing'))
    .action(async (options: Partial<SEOConfig>) => {
      try {
        printInfo('Starting SEO template generation...');
        printInfo(`Reading data from ${chalk.bold(options.data)}`);

        const config = { ...DEFAULT_CONFIG, ...options } as SEOConfig;
        const generator = new JengaSEO(config);
        await generator.generate(config.data, config.output);

        printSuccess('SEO templates generated successfully!');
        printInfo(`Output directory: ${chalk.bold(config.output)}`);
        printInfo(`Base URL: ${chalk.bold(config.baseUrl)}`);
        if (config.gaId) {
          printInfo(`Google Analytics ID: ${chalk.bold(config.gaId)}`);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        printError(errorMessage);
        process.exit(1);
      }
    });

  program.parse(process.argv);
};

// Only run the CLI when this file is executed directly
if (require.main === module) {
  cli().catch((error) => {
    printError(error.message);
    process.exit(1);
  });
}
