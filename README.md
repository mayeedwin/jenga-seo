# Jenga-SEO

A powerful SEO template generator for Single Page Applications (SPAs) that helps improve search engine visibility and social sharing capabilities.

## Features

- Fast and lightweight static file generation
- Generates SEO-friendly HTML templates
- Supports structured data (JSON-LD)
- Multi-language support
- Google Analytics integration
- Social media meta tags
- Automatic sitemap generation
- Robots.txt generation
- Parallel processing
- Template caching
- Zero dependencies (except chalk and commander)

## Comparison with SSR Solutions

### Performance (9/10)

- Static file generation
- No server overhead
- Template caching
- Parallel processing
- Zero runtime dependencies

### SEO Capabilities (8/10)

- Meta tags generation
- OpenGraph tags
- Structured data (JSON-LD)
- Automatic sitemap.xml
- Robots.txt generation

### Developer Experience (8/10)

- Simple CLI interface
- Configuration file support
- TypeScript support
- Comprehensive testing
- Clear documentation

### Deployment & Hosting (9/10)

- Static file hosting
- No server costs
- CDN-friendly
- Easy deployment
- Scalable

### Maintenance (7/10)

- Manual regeneration needed
- Simple dependency management
- Easy updates
- Clear versioning

### Flexibility (7/10)

- Limited to static content
- Customizable templates
- Multi-language support

## Best Use Cases

1. Documentation sites
2. Marketing websites
3. Blogs
4. Portfolio sites
5. Small to medium business websites

## When to Choose Jenga-SEO

- When performance is critical
- When hosting costs are a concern
- When content changes infrequently
- When you need simple deployment
- When you want to leverage CDN benefits

## When to Choose SSR Instead

- When you need real-time data
- When content changes frequently
- When you need complex server-side logic
- When you need user-specific content
- When you need advanced server-side features

## Installation

```bash
npm install jenga-seo
```

## Usage

### Basic Usage

```bash
jenga-seo -d docs.json -o public/link
```

### Advanced Usage

```bash
jenga-seo \
  -d docs.json \
  -o public/link \
  -b https://your-domain.com \
  -a "Your Name" \
  -i https://your-domain.com/images/banner.jpg \
  -g G-XXXXXXXXXX \
  -l en \
  --no-robots \
  --no-sitemap \
  --no-cache \
  --no-parallel
```

### Configuration File

Create a `jenga.config.json` file in your project root:

```json
{
  "baseUrl": "https://your-domain.com",
  "author": "Your Name",
  "defaultImage": "https://your-domain.com/images/banner.jpg",
  "gaId": "G-XXXXXXXXXX",
  "language": "en",
  "robots": true,
  "sitemap": true,
  "cache": true,
  "parallel": true
}
```

### Data File Format

```json
[
  {
    "title": "Page Title",
    "description": "Page Description",
    "path": "/page-path",
    "keywords": ["keyword1", "keyword2"],
    "image": "https://your-domain.com/image.jpg",
    "language": "en",
    "structuredData": {
      "@type": "Article"
    }
  }
]
```

## Options

| Option                  | Description                    | Default                                   |
| ----------------------- | ------------------------------ | ----------------------------------------- |
| `-d, --data <path>`     | Path to docs.json file         | Required                                  |
| `-o, --output <path>`   | Output directory               | public/link                               |
| `-b, --base-url <url>`  | Base URL for your site         | https://your-domain.com                   |
| `-a, --author <n>`      | Author name                    | Your Name                                 |
| `-i, --image <url>`     | Default image URL              | https://your-domain.com/images/banner.jpg |
| `-g, --ga-id <id>`      | Google Analytics ID            | -                                         |
| `-l, --language <lang>` | Default language               | en                                        |
| `--no-robots`           | Disable robots.txt generation  | false                                     |
| `--no-sitemap`          | Disable sitemap.xml generation | false                                     |
| `--no-cache`            | Disable template caching       | false                                     |
| `--no-parallel`         | Disable parallel processing    | false                                     |

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Lint
npm run lint

# Format
npm run format
```

## License

MIT
