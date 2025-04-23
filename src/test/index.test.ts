import { JengaSEO } from '../index';
import { SEOConfig, DocData } from '../config';
import fs from 'fs/promises';

describe('JengaSEO', () => {
  const testConfig: SEOConfig = {
    data: 'test-data.json',
    output: 'test-output',
    baseUrl: 'https://test.com',
    author: 'Test Author',
    defaultImage: 'https://test.com/image.jpg',
    language: 'en',
    robots: true,
    sitemap: true,
    cache: true,
    parallel: true,
  };

  const testDocs: DocData[] = [
    {
      title: 'Test Page',
      description: 'Test Description',
      path: '/test',
      keywords: ['test', 'seo'],
      image: 'https://test.com/test.jpg',
      language: 'en',
      structuredData: {
        '@type': 'Article',
      },
    },
  ];

  beforeEach(async () => {
    // Create test output directory
    await fs.mkdir('test-output', { recursive: true });
  });

  afterEach(async () => {
    // Clean up test output directory
    await fs.rm('test-output', { recursive: true, force: true });
  });

  it('should generate SEO templates with all features', async () => {
    const generator = new JengaSEO(testConfig);
    await generator.generate(testConfig.data, testConfig.output);

    // Check if files were generated
    const files = await fs.readdir('test-output');
    expect(files).toContain('test/index.html');
    expect(files).toContain('sitemap.xml');
    expect(files).toContain('robots.txt');

    // Check HTML content
    const html = await fs.readFile('test-output/test/index.html', 'utf8');
    expect(html).toContain(testDocs[0].title);
    expect(html).toContain(testDocs[0].description);
    expect(html).toContain('application/ld+json');
    expect(html).toContain('og:url');

    // Check sitemap content
    const sitemap = await fs.readFile('test-output/sitemap.xml', 'utf8');
    expect(sitemap).toContain(testConfig.baseUrl + testDocs[0].path);

    // Check robots.txt content
    const robots = await fs.readFile('test-output/robots.txt', 'utf8');
    expect(robots).toContain('Sitemap: ' + testConfig.baseUrl + '/sitemap.xml');
  });

  it('should handle parallel processing', async () => {
    const config = { ...testConfig, parallel: true };
    const generator = new JengaSEO(config);
    await generator.generate(config.data, config.output);

    // Verify files were generated
    const files = await fs.readdir('test-output');
    expect(files).toContain('test/index.html');
  });

  it('should handle caching', async () => {
    const config = { ...testConfig, cache: true };
    const generator = new JengaSEO(config);
    await generator.generate(config.data, config.output);

    // Verify files were generated
    const files = await fs.readdir('test-output');
    expect(files).toContain('test/index.html');
  });
});
