'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import {
  fetchProducts,
  fetchCategories,
  deleteProduct,
  toggleProductStatus,
  subscribeToStore,
} from '@/lib/store';
import { formatDate, formatPrice } from '@/lib/utils';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { useAdminTheme } from '@/lib/adminThemeContext';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [allProds, allCats] = await Promise.all([
        fetchProducts(true),
        fetchCategories(),
      ]);
      setProducts(allProds);
      setCategories(allCats);
      setIsLoading(false);
    }

    loadData();
    return subscribeToStore(loadData);
  }, []);

  const handleToggleStatus = async (product: Product) => {
    const updated = await toggleProductStatus(product.id);
    if (updated) {
      toast(
        `"${product.name}" is now ${updated.status === 'published' ? 'published to public catalog' : 'moved to private drafts'}.`,
        'success'
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    await deleteProduct(productToDelete.id);
    setIsDeleting(false);
    toast(`"${productToDelete.name}" has been permanently purged from archive.`, 'info');
    setProductToDelete(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && p.categoryId !== cat.id) return false;
      }

      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku?.toLowerCase().includes(q);
        const matchesCat = p.categoryName?.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCat) return false;
      }

      return true;
    });
  }, [products, categories, selectedCategory, statusFilter, search]);

  return (
    <div className="font-sans">
      <AdminHeader
        title="Product Catalog Management"
        subtitle={`Managing ${products.length} archival pieces across all metalcraft disciplines`}
        onOpenSidebar={() => setSidebarOpen(true)}
        action={{
          label: 'Add Product',
          href: '/admin/products/new',
        }}
      />

      <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 max-w-7xl">
        {/* Controls Bar: Search, Category, Status */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors ${
            isDark
              ? 'bg-[#151514] border-[#262624] shadow-xs'
              : 'bg-white border-stone-200 shadow-2xs'
          }`}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by piece title, SKU, or category..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`border text-xs font-medium rounded-xl py-2.5 px-3 focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-stone-200'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-800'
              }`}
            >
              <option value="all">All Disciplines</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug} className={isDark ? 'bg-[#151514]' : 'bg-white'}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Pills */}
            <div
              className={`flex items-center border p-1 rounded-xl text-xs ${
                isDark ? 'bg-[#1b1b19] border-[#2e2e2a]' : 'bg-stone-100 border-stone-200'
              }`}
            >
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? isDark
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === 'published'
                    ? isDark
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === 'draft'
                    ? isDark
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div
          className={`rounded-2xl border overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#151514] border-[#262624] shadow-xs'
              : 'bg-white border-stone-200 shadow-2xs'
          }`}
        >
          {isLoading ? (
            <div className="p-16 text-center text-xs font-mono text-stone-400">
              Retrieving catalog archive...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div
                className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto ${
                  isDark
                    ? 'bg-[#1b1b19] border-[#2a2a27] text-amber-300'
                    : 'bg-stone-100 border-stone-200 text-stone-600'
                }`}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <h3
                className={`font-sans font-semibold text-lg ${
                  isDark ? 'text-white' : 'text-stone-900'
                }`}
              >
                No matching pieces found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No metalcraft items match your current search or filter criteria.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                    setStatusFilter('all');
                  }}
                  className={`px-4 py-2 rounded-xl border text-xs font-medium ${
                    isDark
                      ? 'border-[#33332e] text-stone-300 hover:text-white'
                      : 'border-stone-300 text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Clear Filters
                </button>
                <Link
                  href="/admin/products/new"
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    isDark
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  Add Product
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                      isDark
                        ? 'bg-[#1a1a18] border-[#262624] text-stone-400'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <th className="py-3.5 px-5 sm:px-6">Piece Image & Nomenclature</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price (INR)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Catalog Date</th>
                    <th className="py-3.5 px-5 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y text-sm ${
                    isDark ? 'divide-[#242422]' : 'divide-stone-100'
                  }`}
                >
                  {filteredProducts.map((p) => {
                    const cover =
                      p.images[0]?.url ||
                      '/images/brass_urli_hero.jpg';
                    return (
                      <tr
                        key={p.id}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-[#1a1a18]/70' : 'hover:bg-stone-50/70'
                        }`}
                      >
                        <td className="py-3.5 px-5 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border ${
                                isDark ? 'bg-[#1e1e1c] border-[#2e2e2a]' : 'bg-stone-100 border-stone-200'
                              }`}
                            >
                              <Image
                                src={cover}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p
                                className={`font-sans font-semibold truncate text-sm ${
                                  isDark ? 'text-white' : 'text-stone-900'
                                }`}
                              >
                                {p.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span
                                  className={`text-[11px] font-mono ${
                                    isDark ? 'text-stone-400' : 'text-stone-500'
                                  }`}
                                >
                                  {p.sku || 'No SKU'}
                                </span>
                                {p.featured && (
                                  <span
                                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                      isDark
                                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                                        : 'bg-amber-100 text-amber-900 border-amber-300'
                                    }`}
                                  >
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          className={`py-3.5 px-4 text-xs ${
                            isDark ? 'text-stone-300' : 'text-stone-700'
                          }`}
                        >
                          {p.categoryName || 'Unassigned'}
                        </td>

                        <td
                          className={`py-3.5 px-4 text-xs font-semibold font-mono ${
                            isDark ? 'text-amber-300' : 'text-stone-900'
                          }`}
                        >
                          {formatPrice(p.price)}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            title="Click to toggle publish status"
                            className="cursor-pointer group flex items-center gap-1.5"
                          >
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium font-sans border transition-opacity group-hover:opacity-80 ${
                                p.status === 'published'
                                  ? isDark
                                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : isDark
                                  ? 'bg-amber-950/70 text-amber-300 border-amber-800/80'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {p.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </button>
                        </td>

                        <td
                          className={`py-3.5 px-4 text-xs font-mono ${
                            isDark ? 'text-stone-400' : 'text-stone-500'
                          }`}
                        >
                          {formatDate(p.createdAt)}
                        </td>

                        <td className="py-3.5 px-5 sm:px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              title="Inspect Live Public Page"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark
                                  ? 'text-stone-400 hover:text-white hover:bg-[#242422]'
                                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                              }`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              title="Edit Piece"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark
                                  ? 'text-amber-300 hover:text-amber-200 hover:bg-[#242422]'
                                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                              }`}
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => setProductToDelete(p)}
                              title="Purge Piece"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark
                                  ? 'text-stone-400 hover:text-rose-400 hover:bg-rose-950/30'
                                  : 'text-stone-500 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {productToDelete && (
        <DeleteConfirmModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
          productName={productToDelete.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
