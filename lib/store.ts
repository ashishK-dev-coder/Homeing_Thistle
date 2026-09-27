'use client';

import { Product, Category, ProductFormData } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { INITIAL_CATEGORIES } from './data/initialCategories';
import { supabase, isSupabaseConfigured } from './supabase/client';
import { generateId, slugify } from './utils';

const STORAGE_KEY_PRODUCTS = 'homing_thistle_products_v2';
const STORAGE_KEY_CATEGORIES = 'homing_thistle_categories_v2';

// In-memory fallback cache
let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;

const listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error notifying store listener:', e);
    }
  });
}

export function subscribeToStore(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

// ------------------------------------------------------------------
// Local Storage Helpers
// ------------------------------------------------------------------
function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') {
    return cachedProducts || INITIAL_PRODUCTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedProducts = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read products from localStorage:', e);
  }
  cachedProducts = INITIAL_PRODUCTS;
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  } catch {}
  return INITIAL_PRODUCTS;
}

function saveStoredProducts(products: Product[]) {
  cachedProducts = products;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Could not save products to localStorage:', e);
    }
  }
  notifyListeners();
}

function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') {
    return cachedCategories || INITIAL_CATEGORIES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCategories = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read categories from localStorage:', e);
  }
  cachedCategories = INITIAL_CATEGORIES;
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  } catch {}
  return INITIAL_CATEGORIES;
}

function saveStoredCategories(categories: Category[]) {
  cachedCategories = categories;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Could not save categories to localStorage:', e);
    }
  }
  notifyListeners();
}

// ------------------------------------------------------------------
// Public API Methods
// ------------------------------------------------------------------

export async function fetchProducts(includeDrafts = false): Promise<Product[]> {
  // If Supabase is configured and online, query Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          images:product_images(*),
          features:product_features(*),
          specifications:product_specifications(*),
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Transform Supabase data to Product model
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          categoryId: item.category_id,
          categoryName: item.category?.name,
          shortDescription: item.short_description,
          description: item.description,
          price: item.price ? Number(item.price) : undefined,
          sku: item.sku,
          status: item.status,
          featured: item.featured ?? false,
          inStock: item.in_stock ?? true,
          leadTime: item.lead_time,
          seoTitle: item.seo_title,
          seoDescription: item.seo_description,
          ogImage: item.og_image,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          images: (item.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => ({
            id: img.id,
            url: img.image_url,
            alt: img.alt_text || item.name,
            sortOrder: img.sort_order,
            isCover: img.is_cover,
          })),
          features: (item.features || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((f: any) => ({
            id: f.id,
            title: f.title,
            description: f.description,
            sortOrder: f.sort_order,
          })),
          specifications: (item.specifications || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((s: any) => ({
            id: s.id,
            key: s.key,
            value: s.value,
            sortOrder: s.sort_order,
          })),
        }));
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local persistent store:', err);
    }
  }

  // Local storage fallback
  const all = getStoredProducts();
  if (includeDrafts) return all;
  return all.filter((p) => p.status === 'published');
}

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          imageUrl: c.image_url,
          createdAt: c.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase categories fetch failed, falling back to local store:', err);
    }
  }

  const categories = getStoredCategories();
  const products = getStoredProducts();
  return categories.map((cat) => ({
    ...cat,
    productCount: products.filter((p) => p.categoryId === cat.id && p.status === 'published').length,
  }));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchProducts(true);
  const found = products.find((p) => p.slug === slug);
  return found || null;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts(true);
  const found = products.find((p) => p.id === id);
  return found || null;
}

export async function saveProduct(formData: ProductFormData, existingId?: string): Promise<Product> {
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.id === formData.categoryId);

  const cleanSlug = formData.slug ? slugify(formData.slug) : slugify(formData.name);

  // If Supabase is active, handle persistence in Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: any = {
        name: formData.name,
        slug: cleanSlug,
        category_id: formData.categoryId || null,
        short_description: formData.shortDescription,
        description: formData.description,
        price: formData.price || null,
        sku: formData.sku || null,
        status: formData.status,
        featured: formData.featured,
        lead_time: formData.leadTime || null,
        in_stock: formData.inStock ?? true,
        seo_title: formData.seoTitle || null,
        seo_description: formData.seoDescription || null,
        updated_at: new Date().toISOString(),
      };

      let productId = existingId;

      if (existingId) {
        await supabase.from('products').update(payload).eq('id', existingId);
        // Clean and re-insert child relations
        await supabase.from('product_images').delete().eq('product_id', existingId);
        await supabase.from('product_features').delete().eq('product_id', existingId);
        await supabase.from('product_specifications').delete().eq('product_id', existingId);
      } else {
        payload.created_at = new Date().toISOString();
        const { data: created, error } = await supabase.from('products').insert(payload).select().single();
        if (error) throw error;
        productId = created.id;
      }

      if (productId) {
        if (formData.images.length > 0) {
          const imageRows = formData.images.map((img, idx) => ({
            product_id: productId,
            image_url: img.url,
            alt_text: img.alt || formData.name,
            sort_order: idx,
            isCover: idx === 0 || img.isCover,
          }));
          await supabase.from('product_images').insert(imageRows);
        }

        if (formData.features.length > 0) {
          const featureRows = formData.features.map((f, idx) => ({
            product_id: productId,
            title: f.title,
            description: f.description,
            sort_order: idx,
          }));
          await supabase.from('product_features').insert(featureRows);
        }

        if (formData.specifications.length > 0) {
          const specRows = formData.specifications.map((s, idx) => ({
            product_id: productId,
            key: s.key,
            value: s.value,
            sort_order: idx,
          }));
          await supabase.from('product_specifications').insert(specRows);
        }
      }
    } catch (err) {
      console.warn('Supabase save failed, proceeding with local store save:', err);
    }
  }

  // Update local store
  const all = [...getStoredProducts()];
  const now = new Date().toISOString();

  const formattedProduct: Product = {
    id: existingId || generateId(),
    name: formData.name,
    slug: cleanSlug,
    categoryId: formData.categoryId,
    categoryName: cat?.name || 'Uncategorized',
    shortDescription: formData.shortDescription,
    description: formData.description,
    price: formData.price,
    sku: formData.sku,
    status: formData.status,
    featured: formData.featured,
    leadTime: formData.leadTime,
    inStock: formData.inStock ?? true,
    seoTitle: formData.seoTitle,
    seoDescription: formData.seoDescription,
    createdAt: existingId ? (all.find((p) => p.id === existingId)?.createdAt || now) : now,
    updatedAt: now,
    images: formData.images.map((img, idx) => ({
      id: generateId(),
      url: img.url,
      alt: img.alt || formData.name,
      sortOrder: idx,
      isCover: idx === 0 || img.isCover,
    })),
    features: formData.features.map((f, idx) => ({
      id: generateId(),
      title: f.title,
      description: f.description,
      sortOrder: idx,
    })),
    specifications: formData.specifications.map((s, idx) => ({
      id: generateId(),
      key: s.key,
      value: s.value,
      sortOrder: idx,
    })),
  };

  if (existingId) {
    const index = all.findIndex((p) => p.id === existingId);
    if (index !== -1) {
      all[index] = formattedProduct;
    } else {
      all.unshift(formattedProduct);
    }
  } else {
    all.unshift(formattedProduct);
  }

  saveStoredProducts(all);
  return formattedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    }
  }

  const all = getStoredProducts().filter((p) => p.id !== id);
  saveStoredProducts(all);
  return true;
}

export async function toggleProductStatus(id: string): Promise<Product | null> {
  const all = [...getStoredProducts()];
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = all[index];
  const newStatus = current.status === 'published' ? 'draft' : 'published';
  const updated: Product = {
    ...current,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  saveStoredProducts(all);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.warn('Supabase toggle status failed:', e);
    }
  }

  return updated;
}

export async function createCategory(name: string, description?: string, imageUrl?: string): Promise<Category> {
  const cleanSlug = slugify(name);
  const newCat: Category = {
    id: generateId(),
    name,
    slug: cleanSlug,
    description,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    productCount: 0,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').insert({
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        image_url: newCat.imageUrl,
      });
    } catch (e) {
      console.warn('Supabase createCategory failed:', e);
    }
  }

  const categories = [...getStoredCategories(), newCat];
  saveStoredCategories(categories);
  return newCat;
}

export function resetCatalogToDefaults() {
  saveStoredProducts(INITIAL_PRODUCTS);
  saveStoredCategories(INITIAL_CATEGORIES);
}
