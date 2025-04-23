import { DocData, SEOConfig } from './config';

export const generateStructuredData = (doc: DocData, config: SEOConfig): Record<string, any> => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: doc.title,
  description: doc.description,
  url: `${config.baseUrl}${doc.path}`,
  author: {
    '@type': 'Person',
    name: config.author,
  },
  image: doc.image || config.defaultImage,
  ...(doc.structuredData || {}),
});
