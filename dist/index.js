"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JengaSEO = void 0;
exports.cli = cli;
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
class JengaSEO {
    constructor(options) {
        this.options = options;
    }
    validateOptions() {
        if (!this.options.data) {
            throw new Error('Data file path is required');
        }
        if (!this.options.output) {
            throw new Error('Output directory is required');
        }
    }
    readDataFile() {
        try {
            const data = fs_1.default.readFileSync(this.options.data, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to read data file: ${errorMessage}`);
        }
    }
    generateTemplate(doc) {
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
    generate() {
        this.validateOptions();
        const docs = this.readDataFile();
        if (!fs_1.default.existsSync(this.options.output)) {
            fs_1.default.mkdirSync(this.options.output, { recursive: true });
        }
        docs.forEach((doc, index) => {
            const template = this.generateTemplate(doc);
            const outputPath = path_1.default.join(this.options.output, `page-${index}.html`);
            fs_1.default.writeFileSync(outputPath, template);
        });
    }
}
exports.JengaSEO = JengaSEO;
function printBanner() {
    console.log('\n' + chalk_1.default.bold.cyan('Jenga-SEO') + chalk_1.default.gray(' - SEO Template Generator'));
    console.log(chalk_1.default.dim('Version: 1.0.0\n'));
}
function printSuccess(message) {
    console.log(chalk_1.default.green('✓') + ' ' + message);
}
function printInfo(message) {
    console.log(chalk_1.default.blue('ℹ') + ' ' + message);
}
function printError(message) {
    console.error(chalk_1.default.red('✖') + ' ' + chalk_1.default.red('Error: ') + message);
}
function cli() {
    printBanner();
    const program = new commander_1.Command();
    program
        .name('jenga-seo')
        .description('Generate SEO-friendly static HTML templates for SPAs')
        .version('1.0.0')
        .requiredOption('-d, --data <path>', chalk_1.default.cyan('Path to docs.json file'))
        .requiredOption('-o, --output <path>', chalk_1.default.cyan('Output directory for generated files'))
        .option('-b, --base-url <url>', chalk_1.default.cyan('Base URL for your site'), 'https://your-domain.com')
        .option('-a, --author <name>', chalk_1.default.cyan('Author name'), 'Your Name')
        .option('-i, --image <url>', chalk_1.default.cyan('Default image URL'), 'https://your-domain.com/images/banner.jpg')
        .option('-g, --ga-id <id>', chalk_1.default.cyan('Google Analytics ID'))
        .action((options) => {
        try {
            printInfo('Starting SEO template generation...');
            printInfo(`Reading data from ${chalk_1.default.bold(options.data)}`);
            const generator = new JengaSEO(options);
            generator.generate();
            printSuccess('SEO templates generated successfully!');
            printInfo(`Output directory: ${chalk_1.default.bold(options.output)}`);
            printInfo(`Base URL: ${chalk_1.default.bold(options.baseUrl)}`);
            if (options.gaId) {
                printInfo(`Google Analytics ID: ${chalk_1.default.bold(options.gaId)}`);
            }
        }
        catch (error) {
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
