#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Default configuration
let config = {
  HTML_FILES_PATH: path.join(process.cwd(), 'public/link'),
  AUTHOR: 'Your Name',
  BASE_URL: 'https://your-domain.com',
  IMAGE_URL: 'https://your-domain.com/images/banner.jpg',
  GA_ID: null,
  TEMPLATE_PATH: null,
};

// Parse command line arguments
program
  .name('seo-spa-bridge')
  .description('Generate SEO-friendly static HTML templates for SPAs')
  .requiredOption('-d, --data <path>', 'Path to docs.json file')
  .requiredOption('-o, --output <path>', 'Output directory for generated files')
  .option('-b, --base-url <url>', 'Base URL for your site', config.BASE_URL)
  .option('-a, --author <name>', 'Author name', config.AUTHOR)
  .option('-i, --image <url>', 'Default image URL', config.IMAGE_URL)
  .option('-g, --ga-id <id>', 'Google Analytics ID')
  .option('-t, --template <path>', 'Path to template file')
  .parse(process.argv);

const options = program.opts();

// Update configuration
config = {
  ...config,
  HTML_FILES_PATH: path.resolve(process.cwd(), options.output),
  AUTHOR: options.author,
  BASE_URL: options.baseUrl,
  IMAGE_URL: options.image,
  GA_ID: options.gaId,
  TEMPLATE_PATH: options.template ? path.resolve(process.cwd(), options.template) : null,
};

// Utility function to create directory if it doesn't exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Generate meta tags
const generateMetaTags = (title, description, keywords, canonicalUrl, imageUrl) => `
  <!-- Basic Meta -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="${config.AUTHOR}">
  <meta name="robots" content="index, follow">
  <meta name="language" content="English">
  <meta name="copyright" content="${config.AUTHOR}">
  <meta name="canonical" content="${canonicalUrl}">

  <!-- Theme -->
  <meta name="theme-color" content="#000000">
  <meta name="msapplication-TileColor" content="#000000">
  <meta name="apple-mobile-web-app-status-bar-style" content="#000000">

  <!-- Social Meta -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@pwafire">
  <meta name="twitter:creator" content="@pwafire">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${title}">

  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="PWAFire Documentation">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="en_US">
`;

// Generate structured data
const generateStructuredData = (title, description, path, canonicalUrl) => `
  <!-- API Reference Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "APIReference",
    "name": "${title}",
    "description": "${description}",
    "url": "${canonicalUrl}",
    "mainEntityOfPage": {
    "applicationCategory": "Web API",
    "operatingSystem": "Web",
    "author": {
      "@type": "Person",
      "name": "${config.AUTHOR}",
      "url": "${config.BASE_URL}"
    },
    "datePublished": "${new Date().toISOString()}",
    "dateModified": "${new Date().toISOString()}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonicalUrl}"
    }
  }
  </script>

  <!-- Breadcrumb Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "PWAFire",
      "item": "${config.BASE_URL}"
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": "Documentation",
      "item": "${config.BASE_URL}/docs"
    }, {
      "@type": "ListItem",
      "position": 3,
      "name": "${title}",
      "item": "${canonicalUrl}"
    }]
  }
  </script>
`;

// Generate HTML content
const generateHtml = (item) => {
  const canonicalUrl = `${config.BASE_URL}${item.path}`;
  const keywords = Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords;

  // If template is provided, use it
  if (config.TEMPLATE_PATH && fs.existsSync(config.TEMPLATE_PATH)) {
    let template = fs.readFileSync(config.TEMPLATE_PATH, 'utf8');

    // Validate template has required variables
    const requiredVariables = [
      'title',
      'description',
      'content',
      'keywords',
      'path',
      'baseUrl',
      'lastUpdated',
    ];
    const missingVariables = requiredVariables.filter(
      (variable) => !template.includes(`{{${variable}}}`)
    );

    if (missingVariables.length > 0) {
      throw new Error(
        `Invalid template: missing required variables: ${missingVariables.join(', ')}`
      );
    }

    // Replace template variables
    template = template
      .replace(/{{title}}/g, item.title)
      .replace(/{{description}}/g, item.description)
      .replace(/{{content}}/g, item.content)
      .replace(/{{keywords}}/g, keywords)
      .replace(/{{path}}/g, item.path)
      .replace(/{{baseUrl}}/g, config.BASE_URL)
      .replace(/{{lastUpdated}}/g, item.lastUpdated || new Date().toISOString().split('T')[0]);

    return template;
  }

  // Default HTML generation if no template
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${generateMetaTags(item.title, item.description, keywords, canonicalUrl, config.IMAGE_URL)}
  ${generateStructuredData(item.title, item.description, item.path, canonicalUrl)}
</head>
<body>
  <header>
    <h1>${item.title}</h1>
    <p>${item.description}</p>
  </header>
  <main>
    <article>
      ${item.content}
    </article>
  </main>
  <footer>
    <p>Last updated: ${item.lastUpdated || new Date().toISOString().split('T')[0]}</p>
  </footer>
</body>
</html>`;
};

// Create HTML files
const createHtml = async () => {
  try {
    // Read docs.json
    const docsPath = path.resolve(process.cwd(), options.data);
    if (!fs.existsSync(docsPath)) {
      throw new Error(`Docs file not found: ${docsPath}`);
    }

    // Verify template if provided
    if (config.TEMPLATE_PATH && !fs.existsSync(config.TEMPLATE_PATH)) {
      throw new Error(`Template file not found: ${config.TEMPLATE_PATH}`);
    }

    const { items } = JSON.parse(fs.readFileSync(docsPath, 'utf8'));
    if (!Array.isArray(items)) {
      throw new Error("Invalid data format: 'items' must be an array");
    }

    // Process all items in parallel
    await Promise.all(
      items.map(async (item) => {
        // Remove leading slash and create full path
        const relativePath = item.path.startsWith('/') ? item.path.slice(1) : item.path;
        const outputDir = path.join(config.HTML_FILES_PATH, relativePath);
        const filePath = path.join(outputDir, 'index.html');

        // Create directory structure
        ensureDirectoryExists(outputDir);

        try {
          const html = generateHtml(item);
          fs.writeFileSync(filePath, html);
          console.log(`Generated: ${filePath}`);
        } catch (error) {
          throw new Error(`Failed to generate HTML for ${item.path}: ${error.message}`);
        }
      })
    );

    console.log('SEO template generation completed successfully!');
  } catch (error) {
    console.error('Error generating SEO templates:', error.message);
    process.exit(1);
  }
};

// Run the generator
createHtml().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
