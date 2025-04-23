# Jenga SEO

A simple SEO template generator for Single Page Applications (SPAs).

## Features

- Generates SEO-friendly HTML templates for your SPA routes
- Supports meta tags and Open Graph tags
- Optional Google Analytics integration
- Customizable author and image metadata
- Keywords support for better search engine optimization

## Installation

```bash
npm install jenga-seo
```

## Quick Start

1. Create a JSON file with your page data (e.g., `docs.json`):

```json
[
  {
    "title": "Welcome to My App",
    "description": "A great app that does amazing things",
    "path": "/",
    "keywords": ["app", "welcome", "homepage"]
  }
]
```

2. Run the generator:

```bash
npx jenga-seo --data docs.json --output public/link --base-url https://example.com --author "Your Name"
```

## Command Line Arguments

| Argument         | Description                 | Required | Example Value                      |
| ---------------- | --------------------------- | -------- | ---------------------------------- |
| `-d, --data`     | Path to your data JSON file | Yes      | `docs.json`                        |
| `-o, --output`   | Output directory            | Yes      | `public/link`                      |
| `-b, --base-url` | Your website's base URL     | No       | `https://example.com`              |
| `-a, --author`   | Content author              | No       | `"John Doe"`                       |
| `-i, --image`    | Default OG image URL        | No       | `https://example.com/og-image.jpg` |
| `-g, --ga-id`    | Google Analytics ID         | No       | `G-XXXXXXXXXX`                     |

## Example Usage

```bash
jenga-seo \
  --data docs.json \
  --output public/link \
  --base-url https://example.com \
  --author "John Doe" \
  --image https://example.com/og-image.jpg \
  --ga-id G-XXXXXXXXXX
```

## Data File Format

Your JSON data file should contain an array of objects with the following structure:

```json
[
  {
    "title": "Page Title",
    "description": "Page description for SEO",
    "path": "/page-path",
    "keywords": ["keyword1", "keyword2"]
  }
]
```

## License

MIT
