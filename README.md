# Jenga-SEO

A powerful TypeScript-based static HTML template generator designed to create SEO-friendly pages that serve as a bridge between search engines and your Single Page Application (SPA). The name "Jenga" comes from the Swahili word meaning "to build", reflecting its purpose of building SEO solutions.

## Features

1. Generates SEO-optimized static HTML templates
2. Mobile-friendly and responsive design
3. Rich structured data for better search engine visibility
4. Google Analytics integration
5. Social media meta tags (Open Graph)
6. Performance optimized with resource hints
7. Automatic redirects to SPA content
8. TypeScript support with full type definitions
9. Configurable through command line arguments

## Installation

```bash
npm install jenga-seo
```

## Usage

### Basic Usage

```typescript
import { JengaSEO } from 'jenga-seo';

const generator = new JengaSEO({
  data: 'src/data/docs.json',
  output: 'public/seo',
  baseUrl: 'https://example.com',
  author: 'Your Name',
  image: 'https://example.com/images/banner.jpg',
  gaId: 'UA-XXXXX-Y', // Optional
});

generator.generate();
```

### CLI Usage

```bash
npx jenga-seo --data src/data/docs.json --output public/seo --base-url https://example.com --author "Your Name" --image https://example.com/images/banner.jpg --ga-id UA-XXXXX-Y
```

### Integration with Build Process

Add to your project's package.json:

```json
{
  "scripts": {
    "prebuild:seo": "echo 'Starting SEO template generation...'",
    "build:seo": "jenga-seo --data src/data/docs.json --output public/seo --base-url https://example.com --author \"Your Name\" --image https://example.com/images/banner.jpg --ga-id UA-XXXXX-Y || (echo 'Error: SEO template generation failed' && exit 1)",
    "postbuild:seo": "echo 'SEO template generation completed successfully!'",
    "build": "npm run build:seo && react-scripts build"
  }
}
```

### Input Data Format

Your data file (e.g., docs.json) should be an array of objects with this structure:

```json
[
  {
    "title": "Page Title",
    "description": "Page description for SEO",
    "content": "Main content of the page"
  }
]
```

### Command Line Arguments

| Argument         | Description                          | Required | Default                                   |
| ---------------- | ------------------------------------ | -------- | ----------------------------------------- |
| `-d, --data`     | Path to docs.json file               | Yes      | -                                         |
| `-o, --output`   | Output directory for generated files | Yes      | -                                         |
| `-b, --base-url` | Base URL for your site               | No       | https://your-domain.com                   |
| `-a, --author`   | Author name                          | No       | Your Name                                 |
| `-i, --image`    | Default image URL                    | No       | https://your-domain.com/images/banner.jpg |
| `-g, --ga-id`    | Google Analytics ID                  | No       | null                                      |

## Generated SEO Features

### Meta Tags

1. Basic meta tags (charset, viewport)
2. SEO meta tags (title, description)
3. Social media meta tags (Open Graph)
4. Author information

### Performance Optimizations

1. Minimal inline CSS
2. Fast redirects to SPA
3. Optimized HTML structure

## TypeScript Support

The package includes TypeScript definitions out of the box. You can import types:

```typescript
import { JengaSEO, TemplateOptions, DocData } from 'jenga-seo';

const options: TemplateOptions = {
  data: 'src/data/docs.json',
  output: 'public/seo',
  baseUrl: 'https://example.com',
  author: 'Your Name',
  image: 'https://example.com/images/banner.jpg',
};

const generator = new JengaSEO(options);
```

## Error Handling

The generator includes comprehensive error handling:

1. Validates input arguments
2. Checks file existence
3. Handles directory creation
4. Provides clear error messages
5. Type-safe error handling with TypeScript

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build

# Type checking
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Make sure to:

1. Write tests for new features
2. Update documentation
3. Follow the existing code style
4. Run tests and linting before submitting

## License

This project is licensed under the MIT License - see the LICENSE file for details.
