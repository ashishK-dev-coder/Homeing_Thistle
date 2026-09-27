import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyTitle = 'No pieces match your selection',
  emptyDescription = 'Try adjusting your search criteria, clearing category filters, or explore our full collection.',
  onReset,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white rounded-3xl border border-stone-200/80 my-6 max-w-2xl mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-500">
          <Sparkles className="w-6 h-6 text-stone-400" />
        </div>
        <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
          {emptyTitle}
        </h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          {emptyDescription}
        </p>
        {onReset && (
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs uppercase tracking-wider font-semibold transition-all"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx < 4} />
      ))}
    </div>
  );
}
