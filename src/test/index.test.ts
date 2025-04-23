import fs from 'fs';
import path from 'path';
import { JengaSEO } from '../index';

describe('jenga-seo', () => {
  const mockOptions = {
    data: 'test/mock/data.json',
    output: 'test/mock/output',
    baseUrl: 'https://example.com',
    author: 'Test Author',
    image: 'https://example.com/image.jpg',
    gaId: 'UA-XXXXX-Y',
  };

  beforeEach(() => {
    // Create mock data file
    const mockData = [
      {
        title: 'Test Page',
        description: 'Test Description',
        content: 'Test Content',
        keywords: ['test', 'seo', 'template'],
      },
    ];
    fs.mkdirSync(path.dirname(mockOptions.data), { recursive: true });
    fs.writeFileSync(mockOptions.data, JSON.stringify(mockData));
  });

  afterEach(() => {
    // Clean up
    if (fs.existsSync(mockOptions.data)) {
      fs.unlinkSync(mockOptions.data);
    }
    if (fs.existsSync(mockOptions.output)) {
      fs.rmSync(mockOptions.output, { recursive: true });
    }
  });

  it('should generate SEO templates with correct structure', () => {
    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputFiles = fs.readdirSync(mockOptions.output);
    expect(outputFiles.length).toBe(1);

    const content = fs.readFileSync(path.join(mockOptions.output, outputFiles[0]), 'utf8');
    expect(content).toContain('<title>Test Page</title>');
    expect(content).toContain('Test Description');
    expect(content).toContain('Test Content');
    expect(content).toContain('UA-XXXXX-Y');
    expect(content).toContain('<meta name="keywords" content="test, seo, template">');
  });

  it('should handle documents without keywords', () => {
    const mockData = [
      {
        title: 'Test Page',
        description: 'Test Description',
        content: 'Test Content',
      },
    ];
    fs.writeFileSync(mockOptions.data, JSON.stringify(mockData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputFiles = fs.readdirSync(mockOptions.output);
    const content = fs.readFileSync(path.join(mockOptions.output, outputFiles[0]), 'utf8');
    expect(content).toContain('<meta name="keywords" content="">');
  });

  it('should handle documents with keywords array', () => {
    const mockData = [
      {
        title: 'Test Page',
        description: 'Test Description',
        content: 'Test Content',
        keywords: ['seo', 'template', 'generator', 'static site'],
      },
    ];
    fs.writeFileSync(mockOptions.data, JSON.stringify(mockData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputFiles = fs.readdirSync(mockOptions.output);
    const content = fs.readFileSync(path.join(mockOptions.output, outputFiles[0]), 'utf8');
    expect(content).toContain(
      '<meta name="keywords" content="seo, template, generator, static site">'
    );
  });

  it('should handle missing template file', () => {
    const options = { ...mockOptions, data: 'nonexistent.json' };
    const generator = new JengaSEO(options);
    expect(() => generator.generate()).toThrow('Failed to read data file');
  });

  it('should handle invalid template file', () => {
    fs.writeFileSync(mockOptions.data, 'invalid json');
    const generator = new JengaSEO(mockOptions);
    expect(() => generator.generate()).toThrow('Failed to read data file');
  });

  it('should handle missing required arguments', () => {
    const options = { ...mockOptions, data: '' };
    const generator = new JengaSEO(options);
    expect(() => generator.generate()).toThrow('Data file path is required');
  });

  it('should handle invalid data file', () => {
    fs.writeFileSync(mockOptions.data, JSON.stringify({ invalid: 'data' }));
    const generator = new JengaSEO(mockOptions);
    expect(() => generator.generate()).toThrow();
  });

  it('should handle non-existent data file', () => {
    const options = { ...mockOptions, data: 'nonexistent.json' };
    const generator = new JengaSEO(options);
    expect(() => generator.generate()).toThrow('Failed to read data file');
  });
});
