const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('jenga-seo', () => {
  const testOutputDir = path.join(__dirname, 'mock/output');
  const testDataFile = path.join(__dirname, 'mock/data/docs.json');
  const testTemplateDir = path.join(__dirname, 'mock/templates');
  const indexJsPath = path.join(__dirname, '../index.js');

  beforeAll(() => {
    // Create mock directories
    const mockDirs = [
      path.join(__dirname, 'mock'),
      path.join(__dirname, 'mock/data'),
      path.join(__dirname, 'mock/output'),
      path.join(__dirname, 'mock/templates'),
    ];

    mockDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Create mock data if it doesn't exist
    if (!fs.existsSync(testDataFile)) {
      fs.writeFileSync(
        testDataFile,
        JSON.stringify({
          items: [
            {
              path: '/api/copy-text',
              title: 'Copy Text API',
              description: 'A simple API for copying text to clipboard',
              content: "The copyText API allows you to easily copy text to the user's clipboard.",
              keywords: ['clipboard', 'copy', 'text'],
              lastUpdated: '2024-03-20',
            },
            {
              path: '/api/web-share',
              title: 'Web Share API',
              description: 'Share content using the Web Share API',
              content: 'The webShare API enables sharing content using the native share dialog.',
              keywords: ['share', 'web-share', 'social'],
              lastUpdated: '2024-03-21',
            },
          ],
        })
      );
    }

    // Create base template if it doesn't exist
    const baseTemplatePath = path.join(testTemplateDir, 'base.html');
    if (!fs.existsSync(baseTemplatePath)) {
      fs.writeFileSync(
        baseTemplatePath,
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - API Documentation</title>
    <meta name="description" content="{{description}}">
    <meta name="keywords" content="{{keywords}}">
    <link rel="canonical" href="{{baseUrl}}{{path}}">
</head>
<body>
    <header>
        <h1>{{title}}</h1>
        <p>{{description}}</p>
    </header>
    <main>
        <article>
            {{content}}
        </article>
    </main>
    <footer>
        <p>Last updated: {{lastUpdated}}</p>
    </footer>
</body>
</html>`
      );
    }
  });

  afterAll(() => {
    // Cleanup mock directories
    if (fs.existsSync(path.join(__dirname, 'mock'))) {
      fs.rmSync(path.join(__dirname, 'mock'), { recursive: true });
    }
  });

  test('should generate SEO templates with correct structure', () => {
    const command = `node ${indexJsPath} --data ${testDataFile} --output ${testOutputDir} --base-url https://test.com --author "Test Author" --image https://test.com/image.jpg --template ${path.join(testTemplateDir, 'base.html')}`;

    expect(() => {
      execSync(command, { stdio: 'pipe' });
    }).not.toThrow();

    // Verify output files and directories
    expect(fs.existsSync(path.join(testOutputDir, 'api/copy-text'))).toBe(true);
    expect(fs.existsSync(path.join(testOutputDir, 'api/web-share'))).toBe(true);

    // Verify HTML files
    expect(fs.existsSync(path.join(testOutputDir, 'api/copy-text/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(testOutputDir, 'api/web-share/index.html'))).toBe(true);

    // Verify HTML content and template variables
    const copyTextContent = fs.readFileSync(
      path.join(testOutputDir, 'api/copy-text/index.html'),
      'utf8'
    );
    expect(copyTextContent).toContain('Copy Text API - API Documentation');
    expect(copyTextContent).toContain('A simple API for copying text to clipboard');
    expect(copyTextContent).toContain(
      "The copyText API allows you to easily copy text to the user's clipboard."
    );
    expect(copyTextContent).toContain('clipboard, copy, text');
    expect(copyTextContent).toContain('Last updated: 2024-03-20');
    expect(copyTextContent).toContain('https://test.com/api/copy-text');

    const webShareContent = fs.readFileSync(
      path.join(testOutputDir, 'api/web-share/index.html'),
      'utf8'
    );
    expect(webShareContent).toContain('Web Share API - API Documentation');
    expect(webShareContent).toContain('Share content using the Web Share API');
    expect(webShareContent).toContain(
      'The webShare API enables sharing content using the native share dialog.'
    );
    expect(webShareContent).toContain('share, web-share, social');
    expect(webShareContent).toContain('Last updated: 2024-03-21');
    expect(webShareContent).toContain('https://test.com/api/web-share');
  });

  test('should handle missing template file', () => {
    const nonExistentTemplate = path.join(testTemplateDir, 'non-existent.html');
    const command = `node ${indexJsPath} --data ${testDataFile} --output ${testOutputDir} --base-url https://test.com --author "Test Author" --image https://test.com/image.jpg --template ${nonExistentTemplate}`;

    expect(() => {
      execSync(command, { stdio: 'pipe' });
    }).toThrow();
  });

  test('should handle invalid template file', () => {
    const invalidTemplatePath = path.join(testTemplateDir, 'invalid.html');
    fs.writeFileSync(invalidTemplatePath, 'Invalid template content without any variables');

    const command = `node ${indexJsPath} --data ${testDataFile} --output ${testOutputDir} --base-url https://test.com --author "Test Author" --image https://test.com/image.jpg --template ${invalidTemplatePath}`;

    expect(() => {
      execSync(command, { stdio: 'pipe' });
    }).toThrow();

    // Cleanup
    fs.unlinkSync(invalidTemplatePath);
  });

  test('should handle missing required arguments', () => {
    const command = `node ${indexJsPath}`;
    expect(() => {
      execSync(command, { stdio: 'pipe' });
    }).toThrow();
  });

  test('should handle invalid data file', () => {
    const invalidDataFile = path.join(__dirname, 'mock/invalid-data.json');
    fs.writeFileSync(invalidDataFile, JSON.stringify({ invalid: 'data' }));

    const command = `node ${indexJsPath} --data ${invalidDataFile} --output ${testOutputDir} --base-url https://test.com --author "Test Author" --image https://test.com/image.jpg --template ${path.join(testTemplateDir, 'base.html')}`;

    expect(() => {
      execSync(command, { stdio: 'pipe' });
    }).toThrow();

    // Cleanup
    fs.unlinkSync(invalidDataFile);
  });

  test('should handle non-existent data file', () => {
    const nonExistentFile = path.join(__dirname, 'mock/non-existent.json');
    const command = `node ${indexJsPath} --data ${nonExistentFile} --output ${testOutputDir} --base-url https://test.com --author "Test Author" --image https://test.com/image.jpg --template ${path.join(testTemplateDir, 'base.html')}`;

    expect(() => {
      execSync(command, { stdio: 'pipe' });
    }).toThrow();
  });
});
