import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

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
  content: string;
  [key: string]: any;
}

export class JengaSEO {
  private options: TemplateOptions;

  constructor(options: TemplateOptions) {
    this.options = options;
  }

  private validateOptions(): void {
    if (!this.options.data) {
      throw new Error('Data file path is required');
    }
    if (!this.options.output) {
      throw new Error('Output directory is required');
    }
  }

  private readDataFile(): DocData[] {
    try {
      const data = fs.readFileSync(this.options.data, 'utf8');
      return JSON.parse(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to read data file: ${errorMessage}`);
    }
  }

  private generateTemplate(doc: DocData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title}</title>
  <meta name="description" content="${doc.description}">
  <meta name="author" content="${this.options.author}">
  <meta property="og:title" content="${doc.title}">
  <meta property="og:description" content="${doc.description}">
  <meta property="og:image" content="${this.options.image}">
  ${this.options.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${this.options.gaId}"></script>` : ''}
</head>
<body>
  <h1>${doc.title}</h1>
  <div>${doc.content}</div>
  <script>
    window.location.href = '${this.options.baseUrl}';
  </script>
</body>
</html>
    `.trim();
  }

  public generate(): void {
    this.validateOptions();
    const docs = this.readDataFile();

    if (!fs.existsSync(this.options.output)) {
      fs.mkdirSync(this.options.output, { recursive: true });
    }

    docs.forEach((doc, index) => {
      const template = this.generateTemplate(doc);
      const outputPath = path.join(this.options.output, `page-${index}.html`);
      fs.writeFileSync(outputPath, template);
    });
  }
}

export function cli(): void {
  const program = new Command();

  program
    .name('jenga-seo')
    .description('Generate SEO-friendly static HTML templates for SPAs')
    .version('1.0.0')
    .requiredOption('-d, --data <path>', 'Path to docs.json file')
    .requiredOption('-o, --output <path>', 'Output directory for generated files')
    .option('-b, --base-url <url>', 'Base URL for your site', 'https://your-domain.com')
    .option('-a, --author <name>', 'Author name', 'Your Name')
    .option('-i, --image <url>', 'Default image URL', 'https://your-domain.com/images/banner.jpg')
    .option('-g, --ga-id <id>', 'Google Analytics ID')
    .action((options: TemplateOptions) => {
      try {
        const generator = new JengaSEO(options);
        generator.generate();
        console.log('SEO templates generated successfully!');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error:', errorMessage);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

// Only run the CLI when this file is executed directly
if (require.main === module) {
  cli();
}
