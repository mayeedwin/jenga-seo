import { JengaSEO, DocData } from '../index';
import fs from 'fs';
import path from 'path';

describe('JengaSEO', () => {
  const mockOptions = {
    data: 'test-data.json',
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
    if (fs.existsSync(mockOptions.data)) {
      fs.unlinkSync(mockOptions.data);
    }
  });

  it('should generate templates with required fields', () => {
    const testData: DocData[] = [
      {
        title: 'Test Title',
        description: 'Test Description',
        path: '/test-page',
        keywords: ['test', 'seo'],
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputPath = path.join(mockOptions.output, 'test-page', 'index.html');
    expect(fs.existsSync(outputPath)).toBe(true);

    const template = fs.readFileSync(outputPath, 'utf8');
    expect(template).toContain(testData[0].title);
    expect(template).toContain(testData[0].description);
    expect(template).toContain(testData[0].keywords?.join(', '));
    expect(template).toContain(`${mockOptions.baseUrl}${testData[0].path}`);
  });

  it('should handle documents without keywords', () => {
    const testData: DocData[] = [
      {
        title: 'Test Title',
        description: 'Test Description',
        path: '/test-page',
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputPath = path.join(mockOptions.output, 'test-page', 'index.html');
    const template = fs.readFileSync(outputPath, 'utf8');
    expect(template).toContain(testData[0].title);
    expect(template).toContain(testData[0].description);
    expect(template).toContain(`${mockOptions.baseUrl}${testData[0].path}`);
  });

  it('should handle empty keywords arrays', () => {
    const testData: DocData[] = [
      {
        title: 'Test Title',
        description: 'Test Description',
        path: '/test-page',
        keywords: [],
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputPath = path.join(mockOptions.output, 'test-page', 'index.html');
    const template = fs.readFileSync(outputPath, 'utf8');
    expect(template).toContain(testData[0].title);
    expect(template).toContain(testData[0].description);
    expect(template).toContain(`${mockOptions.baseUrl}${testData[0].path}`);
  });

  it('should handle missing required fields', () => {
    const testData = [
      {
        description: 'Test Description',
        path: '/test-page',
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    expect(() => generator.generate()).toThrow('Title is required in document data');
  });

  it('should handle invalid data structures', () => {
    const testData = { notAnArray: true };
    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    expect(() => generator.generate()).toThrow('Data file must contain an array of documents');
  });

  it('should handle multiple documents', () => {
    const testData: DocData[] = [
      {
        title: 'Test Title 1',
        description: 'Test Description 1',
        path: '/page-1',
        keywords: ['test1'],
      },
      {
        title: 'Test Title 2',
        description: 'Test Description 2',
        path: '/page-2',
        keywords: ['test2'],
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    expect(fs.existsSync(path.join(mockOptions.output, 'page-1', 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(mockOptions.output, 'page-2', 'index.html'))).toBe(true);
  });

  it('should handle Google Analytics ID presence/absence', () => {
    const testData: DocData[] = [
      {
        title: 'Test Title',
        description: 'Test Description',
        path: '/test-page',
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    // Test without GA ID
    const generatorWithoutGA = new JengaSEO(mockOptions);
    generatorWithoutGA.generate();
    let template = fs.readFileSync(
      path.join(mockOptions.output, 'test-page', 'index.html'),
      'utf8'
    );
    expect(template).not.toContain('googletagmanager');

    // Test with GA ID
    const generatorWithGA = new JengaSEO({ ...mockOptions, gaId: 'G-XXXXXXXXXX' });
    generatorWithGA.generate();
    template = fs.readFileSync(path.join(mockOptions.output, 'test-page', 'index.html'), 'utf8');
    expect(template).toContain('googletagmanager');
  });
});
