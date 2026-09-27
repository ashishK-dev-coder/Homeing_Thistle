import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
  allProducts: Product[];
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  allProducts,
}: RelatedProductsProps) {
  // Filter for products in same category or fallback to any other published products
  const related = allProducts
    .filter((p) => p.id !== currentProductId && p.status === 'published')
    .sort((a, b) => {
      if (a.categoryId === categoryId && b.categoryId !== categoryId) return -1;
      if (b.categoryId === categoryId && a.categoryId !== categoryId) return 1;
      return 0;
    })
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="pt-20 pb-12 border-t border-stone-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block mb-2">
            Harmonious Pairings
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-medium">
            Related Architectural Pieces
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md">
          Explore complementary silhouettes, materiality, and craftsmanship from our curated portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
