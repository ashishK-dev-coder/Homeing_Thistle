export type ProductStatus = 'published' | 'draft';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isCover?: boolean;
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface ProductSpecification {
  id: string;
  key: string;
  value: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  shortDescription: string;
  description: string;
  price?: number;
  sku?: string;
  status: ProductStatus;
  featured: boolean;
  leadTime?: string;
  inStock?: boolean;
  images: ProductImage[];
  features: ProductFeature[];
  specifications: ProductSpecification[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price?: number;
  sku?: string;
  status: ProductStatus;
  featured: boolean;
  leadTime?: string;
  inStock?: boolean;
  images: { url: string; alt: string; isCover?: boolean }[];
  features: { title: string; description: string }[];
  specifications: { key: string; value: string }[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface FilterState {
  category: string;
  search: string;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name';
  status?: string;
}
