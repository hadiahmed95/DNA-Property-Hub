export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  posts_count: number;
  published_posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  reading_time: string;
  category_id: number;
  featured_image?: string | null;
  is_featured: boolean;
  published_at: string | null;
  status: 'draft' | 'published' | 'archived';
  views_count: number;
  slug?: string;
  seo_title: string;
  seo_keywords: string[];
  seo_description: string;
  created_at?: string;
  updated_at?: string;

  category?: BlogCategory;
  tags?: BlogTag[];
}