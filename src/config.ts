export interface SEOConfig {
  data: string;
  output: string;
  baseUrl: string;
  author: string;
  defaultImage: string;
  gaId?: string;
  language?: string;
  template?: string;
  structuredData?: Record<string, any>;
  robots?: boolean;
  sitemap?: boolean;
  cache?: boolean;
  parallel?: boolean;
}

export interface DocData {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  language?: string;
  structuredData?: Record<string, any>;
  [key: string]: any;
}

export const DEFAULT_CONFIG: Partial<SEOConfig> = {
  baseUrl: 'https://your-domain.com',
  author: 'Your Name',
  defaultImage: 'https://your-domain.com/images/banner.jpg',
  language: 'en',
  robots: true,
  sitemap: true,
  cache: true,
  parallel: true,
};
