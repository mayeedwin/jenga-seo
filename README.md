# Jenga-SEO-Lite - SEO Template Generator for SPAs

Jenga-SEO-Lite is a powerful static HTML template generator designed to create SEO-friendly pages that serve as a bridge between search engines and your Single Page Application (SPA). The name "Jenga" comes from the Swahili word meaning "to build", reflecting its purpose of building SEO solutions.

## Features

1. Generates SEO-optimized static HTML templates
2. Mobile-friendly and responsive design
3. Rich structured data for better search engine visibility
4. Google Analytics integration
5. Social media meta tags
6. Performance optimized with resource hints
7. Automatic redirects to SPA content
8. Configurable through command line arguments

## Installation

### As an npm package

```bash
npm install jenga-seo-lite
```

### Local Development

If you're working with the local version:

```bash
# In your project's root directory
npm install ./jenga
```

## Usage

### As a Local Package

When using the local version, you can run the generator directly:

```bash
node jenga/index.js --data src/data/docs.json --output public/link --base-url https://example.com --author "John Doe" --image https://example.com/images/banner.jpg --ga-id UA-XXXXX-Y
```

### As an npm Package

When installed as a package, you can run it using:

```bash
npx jenga-seo-lite --data src/data/docs.json --output public/link --base-url https://example.com --author "John Doe" --image https://example.com/images/banner.jpg --ga-id UA-XXXXX-Y
```

### Integration with Build Process

Add to your project's package.json:

```json
{
  "scripts": {
    "prebuild:seo": "echo 'Starting SEO template generation...'",
    "build:seo": "jenga-seo-lite --data src/data/docs.json --output public/link --base-url https://example.com --author \"John Doe\" --image https://example.com/images/banner.jpg --ga-id UA-XXXXX-Y || (echo 'Error: SEO template generation failed' && exit 1)",
    "postbuild:seo": "echo 'SEO template generation completed successfully!'",
    "build": "npm run build:seo && react-scripts build"
  }
}
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

1. Basic meta tags (charset, viewport, etc.)
2. SEO meta tags (title, description, keywords)
3. Social media meta tags (Open Graph, Twitter Cards)
4. Canonical URLs

### Structured Data

1. API Reference schema
2. Breadcrumb navigation schema
3. Author information
4. Publication dates

### Performance Optimizations

1. Resource hints (preconnect, dns-prefetch)
2. Image preloading
3. Minimal inline CSS
4. Fast redirects

## Error Handling

The generator includes comprehensive error handling:

1. Validates input arguments
2. Checks file existence
3. Handles directory creation
4. Provides clear error messages
5. Exits with appropriate status codes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
