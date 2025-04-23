import { JengaSEO, DocData } from '../index';
import fs from 'fs';
import path from 'path';

describe('JengaSEO', () => {
  const mockOptions = {
    data: path.join(__dirname, 'test-data.json'),
    output: 'test-output',
    baseUrl: 'https://example.com',
    author: 'Test Author',
    image: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    // Create test output directory
    if (!fs.existsSync(mockOptions.output)) {
      fs.mkdirSync(mockOptions.output, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(mockOptions.output)) {
      fs.rmSync(mockOptions.output, { recursive: true });
    }
  });

  it('should handle non-existent data file', () => {
    const invalidOptions = { ...mockOptions, data: 'non-existent.json' };
    const generator = new JengaSEO(invalidOptions);
    const expectedPath = path.resolve(process.cwd(), 'non-existent.json');
    expect(() => generator.generate()).toThrow(`File not found: ${expectedPath}`);
  });

  it('should generate templates with required fields', () => {
    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputPath = path.join(mockOptions.output, 'test-page-1', 'index.html');
    expect(fs.existsSync(outputPath)).toBe(true);

    const template = fs.readFileSync(outputPath, 'utf8');
    expect(template).toContain('Test Page 1');
    expect(template).toContain('This is a test page for SEO');
    expect(template).toContain('test, seo, page1');
    expect(template).toContain(`${mockOptions.baseUrl}/test-page-1`);
  });

  it('should handle documents without keywords', () => {
    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputPath = path.join(mockOptions.output, 'test-page-3', 'index.html');
    const template = fs.readFileSync(outputPath, 'utf8');
    expect(template).toContain('Test Page 3');
    expect(template).toContain('Test page without keywords');
    expect(template).toContain(`${mockOptions.baseUrl}/test-page-3`);
  });

  it('should handle multiple documents', () => {
    const generator = new JengaSEO(mockOptions);
    generator.generate();

    expect(fs.existsSync(path.join(mockOptions.output, 'test-page-1', 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(mockOptions.output, 'test-page-2', 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(mockOptions.output, 'test-page-3', 'index.html'))).toBe(true);
  });

  it('should handle Google Analytics ID presence/absence', () => {
    // Test without GA ID
    const generatorWithoutGA = new JengaSEO(mockOptions);
    generatorWithoutGA.generate();
    let template = fs.readFileSync(
      path.join(mockOptions.output, 'test-page-1', 'index.html'),
      'utf8'
    );
    expect(template).not.toContain('googletagmanager');

    // Test with GA ID
    const generatorWithGA = new JengaSEO({ ...mockOptions, gaId: 'G-XXXXXXXXXX' });
    generatorWithGA.generate();
    template = fs.readFileSync(path.join(mockOptions.output, 'test-page-1', 'index.html'), 'utf8');
    expect(template).toContain('googletagmanager');
  });
});
