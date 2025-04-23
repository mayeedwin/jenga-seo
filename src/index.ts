#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export interface TemplateOptions {
  data: string;
  output: string;
  baseUrl: string;
  author: string;
  image: string;
  gaId?: string;
}

export interface DocData {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  [key: string]: any;
}

export class JengaSEO {
  private options: TemplateOptions;

  constructor(options: TemplateOptions) {
    this.options = options;
  }

  private _validateOptions(): void {
    if (!this.options.data) {
      throw new Error('Data file path is required');
    }
    if (!this.options.output) {
      throw new Error('Output directory is required');
    }
  }

  private _validateDocData(doc: DocData): void {
    if (!doc.title) {
      throw new Error('Title is required in document data');
    }
    if (!doc.description) {
      throw new Error('Description is required in document data');
    }
    if (!doc.path) {
      throw new Error('Path is required in document data');
    }
  }

  private _readDataFile(): DocData[] {
    try {
      const dataFilePath = path.resolve(process.cwd(), this.options.data);
      printInfo(`Reading data file from: ${dataFilePath}`);

      if (!fs.existsSync(dataFilePath)) {
        throw new Error(
          `File not found: ${dataFilePath}. Please ensure the path is correct relative to where you're running the command.`
        );
      }

      const data = fs.readFileSync(dataFilePath, 'utf8');
      printInfo(`File content: ${data.substring(0, 100)}...`); // Show first 100 chars for debugging

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
      printError(`Failed to read data file: ${errorMessage}`);
      throw error;
    }
  }

  private _generateTemplate(doc: DocData): string {
    const keywords = doc.keywords ? doc.keywords.join(', ') : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title}</title>
  <meta name="description" content="${doc.description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="${this.options.author}">
  <meta property="og:title" content="${doc.title}">
  <meta property="og:description" content="${doc.description}">
  <meta property="og:image" content="${this.options.image}">
  ${this.options.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${this.options.gaId}"></script>` : ''}
</head>
<body>
  <script>
    window.location.href = '${this.options.baseUrl}${doc.path}';
  </script>
</body>
</html>
    `.trim();
  }

  public generate(): void {
    this._validateOptions();
    const docs = this._readDataFile();

    const outputPath = path.resolve(process.cwd(), this.options.output);
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    docs.forEach((doc) => {
      const template = this._generateTemplate(doc);
      const filePath = path.join(outputPath, doc.path, 'index.html');
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, template);
    });
  }
}

function printBanner(): void {
  console.log('\n' + chalk.bold.cyan('Jenga-SEO') + chalk.gray(' - SEO Template Generator\n'));
}

function printSuccess(message: string): void {
  console.log(chalk.green('✓') + ' ' + message);
}

function printInfo(message: string): void {
  console.log(chalk.blue('ℹ') + ' ' + message);
}

function printError(message: string): void {
  console.error(chalk.red('✖') + ' ' + chalk.red('Error: ') + message);
}

export function cli(): void {
  printBanner();

  const program = new Command();

  program
    .name('jenga-seo')
    .description('Generate SEO-friendly static HTML templates for SPAs')
    .version('1.0.4')
    .requiredOption('-d, --data <path>', chalk.cyan('Path to docs.json file'))
    .requiredOption(
      '-o, --output <path>',
      chalk.cyan('Output directory for generated files'),
      'public/link'
    )
    .option('-b, --base-url <url>', chalk.cyan('Base URL for your site'), 'https://your-domain.com')
    .option('-a, --author <n>', chalk.cyan('Author name'), 'Your Name')
    .option(
      '-i, --image <url>',
      chalk.cyan('Default image URL'),
      'https://your-domain.com/images/banner.jpg'
    )
    .option('-g, --ga-id <id>', chalk.cyan('Google Analytics ID'))
    .action((options: TemplateOptions) => {
      try {
        printInfo('Starting SEO template generation...');
        printInfo(`Reading data from ${chalk.bold(options.data)}`);

        const generator = new JengaSEO(options);
        generator.generate();

        printSuccess('SEO templates generated successfully!');
        printInfo(`Output directory: ${chalk.bold(options.output)}`);
        printInfo(`Base URL: ${chalk.bold(options.baseUrl)}`);
        if (options.gaId) {
          printInfo(`Google Analytics ID: ${chalk.bold(options.gaId)}`);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        printError(errorMessage);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

// Only run the CLI when this file is executed directly
if (require.main === module) {
  cli();
}
