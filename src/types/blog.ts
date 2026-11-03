export interface IBlogImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface IAuthor {
  name: string;
  id?: string;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ISEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export type BlogStatus = 'draft' | 'published' | 'publish' | 'private' | 'scheduled';

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: IBlogImage;
  coverImage?: IBlogImage;
  mainImage?: IBlogImage;
  images?: string;
  metaTitle?: string;
  metaDesc?: string;
  content: any; // Tiptap JSON Document or HTML string
  category: string;
  tags: string[];
  author: IAuthor;
  faqs: IFAQ[];
  seo: ISEO;
  status: BlogStatus;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: IBlogImage;
  coverImage?: IBlogImage;
  mainImage?: IBlogImage;
  content: any;
  category: string;
  tags: string[];
  author: IAuthor;
  faqs: IFAQ[];
  seo: ISEO;
  status: BlogStatus;
  publishedAt?: string;
  scheduledAt?: string;
}
