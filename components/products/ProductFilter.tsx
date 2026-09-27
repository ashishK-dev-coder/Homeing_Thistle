'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Category } from '@/lib/types';

interface ProductFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: any) => void;
  totalResults: number;
}

export function ProductFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResults,
}: ProductFilterProps) {
  return (
    <div className="space-y-6 pb-6 border-b border-stone-200">
      {/* Top Bar: Search + Sort + Count */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, material, or keyword..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side: Sort + Results counter */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <span className="text-xs text-stone-500 font-mono">
            {totalResults} {totalResults === 1 ? 'piece' : 'pieces'} found
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-stone-500 font-medium hidden sm:inline-flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-stone-400" />
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white border border-stone-200 text-stone-800 text-xs font-medium rounded-xl py-2 px-3 focus:outline-none focus:border-stone-800 transition-colors shadow-2xs cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Recently Introduced</option>
              <option value="price-asc">Price: Ascending</option>
              <option value="price-desc">Price: Descending</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium border ${
            selectedCategory === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-900'
          }`}
        >
          All Pieces
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-900'
              }`}
            >
              <span>{cat.name}</span>
              {typeof cat.productCount === 'number' && cat.productCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {cat.productCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
