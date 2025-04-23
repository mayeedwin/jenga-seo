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
        keywords: ['test', 'seo'],
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputFiles = fs.readdirSync(mockOptions.output);
    expect(outputFiles.length).toBe(1);

    const template = fs.readFileSync(path.join(mockOptions.output, outputFiles[0]), 'utf8');
    expect(template).toContain(testData[0].title);
    expect(template).toContain(testData[0].description);
    expect(template).toContain(testData[0].keywords?.join(', '));
  });

  it('should handle documents without keywords', () => {
    const testData: DocData[] = [
      {
        title: 'Test Title',
        description: 'Test Description',
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputFiles = fs.readdirSync(mockOptions.output);
    const template = fs.readFileSync(path.join(mockOptions.output, outputFiles[0]), 'utf8');
    expect(template).toContain(testData[0].title);
    expect(template).toContain(testData[0].description);
  });

  it('should handle empty keywords arrays', () => {
    const testData: DocData[] = [
      {
        title: 'Test Title',
        description: 'Test Description',
        keywords: [],
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputFiles = fs.readdirSync(mockOptions.output);
    const template = fs.readFileSync(path.join(mockOptions.output, outputFiles[0]), 'utf8');
    expect(template).toContain(testData[0].title);
    expect(template).toContain(testData[0].description);
  });

  it('should handle missing required fields', () => {
    const testData = [
      {
        description: 'Test Description',
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
        keywords: ['test1'],
      },
      {
        title: 'Test Title 2',
        description: 'Test Description 2',
        keywords: ['test2'],
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    const generator = new JengaSEO(mockOptions);
    generator.generate();

    const outputFiles = fs.readdirSync(mockOptions.output);
    expect(outputFiles.length).toBe(2);
  });

  it('should handle Google Analytics ID presence/absence', () => {
    const testData: DocData[] = [
      {
        title: 'Test Title',
        description: 'Test Description',
      },
    ];

    fs.writeFileSync(mockOptions.data, JSON.stringify(testData));

    // Test without GA ID
    const generatorWithoutGA = new JengaSEO(mockOptions);
    generatorWithoutGA.generate();
    let template = fs.readFileSync(path.join(mockOptions.output, 'page-0.html'), 'utf8');
    expect(template).not.toContain('googletagmanager');

    // Test with GA ID
    const generatorWithGA = new JengaSEO({ ...mockOptions, gaId: 'G-XXXXXXXXXX' });
    generatorWithGA.generate();
    template = fs.readFileSync(path.join(mockOptions.output, 'page-0.html'), 'utf8');
    expect(template).toContain('googletagmanager');
  });
});
