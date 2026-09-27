-- ====================================================================
-- HOMING THISTLE - SUPABASE DATABASE SCHEMA
-- Phase 1 Product Showcase & Admin Catalog
-- ====================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2),
  sku TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  lead_time TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Product Features Table
CREATE TABLE IF NOT EXISTS product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 5. Create Product Specifications Table
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_features_product ON product_features(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specifications_product ON product_specifications(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public categories are viewable by everyone" 
  ON categories FOR SELECT USING (true);

CREATE POLICY "Published products are viewable by everyone" 
  ON products FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public product images are viewable by everyone" 
  ON product_images FOR SELECT USING (true);

CREATE POLICY "Public product features are viewable by everyone" 
  ON product_features FOR SELECT USING (true);

CREATE POLICY "Public product specifications are viewable by everyone" 
  ON product_specifications FOR SELECT USING (true);

-- Authenticated Admin Policies (Full Access)
CREATE POLICY "Admins have full access to categories" 
  ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to products" 
  ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to product images" 
  ON product_images FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to product features" 
  ON product_features FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to product specifications" 
  ON product_specifications FOR ALL USING (auth.role() = 'authenticated');
