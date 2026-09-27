'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles, Scale } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const coverImage =
    product.images.find((img) => img.isCover)?.url ||
    product.images[0]?.url ||
    '/images/brass_urli_hero.jpg';

  // Look for weight in specifications
  const weightSpec = product.specifications.find(
    (s) => s.key.toLowerCase().includes('weight')
  )?.value;

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-amber-900/30 transition-all duration-300">
      {/* Image Container with Zoom effect */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block w-full aspect-4/3 sm:aspect-4/5 overflow-hidden bg-stone-100"
      >
        <Image
          src={coverImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.featured && (
              <Badge variant="default" size="sm" className="bg-stone-950/90 text-amber-200 border-amber-900/40 backdrop-blur-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                Featured Piece
              </Badge>
            )}
            {product.leadTime?.includes('In Stock') && (
              <Badge variant="success" size="sm" className="bg-emerald-600/90 text-white border-transparent text-[10px]">
                Ready to Dispatch
              </Badge>
            )}
          </div>
          {product.categoryName && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/90 text-stone-800 backdrop-blur-xs shadow-2xs border border-stone-200">
              {product.categoryName.split('&')[0]}
            </span>
          )}
        </div>

        {/* Weight Psychological Badge */}
        {weightSpec && (
          <div className="absolute bottom-3 left-3 py-1 px-2.5 rounded-lg bg-stone-950/80 backdrop-blur-md text-amber-200 text-[10px] font-mono flex items-center gap-1 border border-amber-900/30">
            <Scale className="w-3 h-3 text-amber-300" />
            <span>{weightSpec.split('(')[0].trim()}</span>
          </div>
        )}

        {/* Quick tap CTA banner on hover */}
        <div className="hidden sm:flex absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end p-3">
          <span className="w-full py-2 px-3 rounded-xl bg-white/95 text-stone-900 text-xs font-semibold uppercase tracking-wider text-center shadow-lg backdrop-blur-xs flex items-center justify-center gap-1">
            <span>View Specifications</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-amber-900 font-bold">
              {product.sku || 'Heirloom Edition'}
            </span>
            <span className="text-sm sm:text-base font-bold text-stone-950 font-mono">
              {formatPrice(product.price)}
            </span>
          </div>

          <h3 className="font-serif text-base sm:text-lg text-stone-950 group-hover:text-amber-800 transition-colors line-clamp-1 font-bold">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Footer info: lead time & mobile quick explore */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono text-[10px] truncate max-w-[170px]">
            {product.leadTime || 'Solid virgin brass metal'}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-stone-900 hover:text-amber-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
