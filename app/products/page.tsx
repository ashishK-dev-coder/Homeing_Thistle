'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import { fetchProducts, fetchCategories, subscribeToStore } from '@/lib/store';
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductGrid } from '@/components/products/ProductGrid';
import { MessageSquare, Sparkles } from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState(sortParam);

  useEffect(() => {
    async function loadData() {
      const [allProds, allCats] = await Promise.all([
        fetchProducts(false),
        fetchCategories(),
      ]);
      setProducts(allProds);
      setCategories(allCats);
      setIsLoading(false);
    }

    loadData();
    return subscribeToStore(loadData);
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [categoryParam, queryParam]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    router.replace('/products', { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      const targetCat = categories.find((c) => c.slug === selectedCategory);
      if (targetCat) {
        result = result.filter((p) => p.categoryId === targetCat.id);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          p.specifications.some((s) => s.value.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-desc') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [products, categories, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 sm:pt-36 pb-20 space-y-8 sm:space-y-12">
      {/* Header with Indian English tone */}
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-900 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>The Artisanal Metalcraft Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-950 tracking-normal">
          Explore Our Brass & Iron Collection
        </h1>
        <p className="text-sm sm:text-base text-stone-700 font-normal leading-relaxed">
          Heavyweight virgin brass vessels, hand-chiseled pots, and architectural wrought iron lanterns. Each piece crafted by master karigars for lasting vastu prana and timeless dignity.
        </p>

        {/* Quick mobile client WhatsApp prompt */}
        <div className="pt-2 sm:hidden">
          <a
            href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20reviewing%20the%20Homing%20Thistle%20Product%20Catalog%20and%20would%20like%20trade%20pricing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Need Custom Sizes or Trade Pricing? Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Filter controls */}
      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalResults={filteredProducts.length}
      />

      {/* Products Grid */}
      <ProductGrid
        products={filteredProducts}
        isLoading={isLoading}
        onReset={handleResetFilters}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-40 text-center text-xs font-mono text-stone-400">
          Loading metalcraft catalog...
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
