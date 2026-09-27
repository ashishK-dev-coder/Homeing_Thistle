'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  CheckCircle2,
  FileEdit,
  FolderTree,
  Plus,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import {
  fetchProducts,
  fetchCategories,
  subscribeToStore,
  resetCatalogToDefaults,
} from '@/lib/store';
import { formatDate, formatPrice } from '@/lib/utils';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { useToast } from '@/components/ui/Toast';
import { useAdminTheme } from '@/lib/adminThemeContext';

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const totalCount = products.length;
  const publishedCount = products.filter((p) => p.status === 'published').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;
  const categoriesCount = categories.length;

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5);

  const handleResetCatalog = () => {
    if (confirm('Reset catalog to the default curated Indian brass & iron pieces? Any local additions will be restored.')) {
      resetCatalogToDefaults();
      toast('Catalog restored to default curated metalcraft editions.', 'info');
    }
  };

  return (
    <div className="font-sans">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Catalog inventory analytics, active disciplines, and atelier status"
        onOpenSidebar={() => setSidebarOpen(true)}
        action={{
          label: 'Add Product',
          href: '/admin/products/new',
        }}
      />

      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Catalog Pieces"
            value={totalCount}
            description="Active metalcraft artifacts"
            icon={Package}
            badge={`${publishedCount} active`}
          />
          <StatCard
            title="Published on Site"
            value={publishedCount}
            description="Live for clients to explore"
            icon={CheckCircle2}
            badge="Live"
          />
          <StatCard
            title="Atelier Drafts"
            value={draftCount}
            description="Unreleased forge prototypes"
            icon={FileEdit}
            badge={draftCount > 0 ? 'Pending' : 'Zero drafts'}
          />
          <StatCard
            title="Design Disciplines"
            value={categoriesCount}
            description="Brass & iron categories"
            icon={FolderTree}
          />
        </div>

        {/* Quick Operations Bar */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 transition-colors ${
            isDark
              ? 'bg-[#151514] border-[#262624] shadow-xs'
              : 'bg-white border-stone-200 shadow-2xs'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`text-xs font-mono uppercase tracking-wider font-semibold mr-1 ${
                isDark ? 'text-amber-300' : 'text-amber-900'
              }`}
            >
              Atelier Actions:
            </span>
            <Link
              href="/admin/products/new"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs ${
                isDark
                  ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Commission New Piece</span>
            </Link>
            <Link
              href="/admin/categories"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? 'bg-[#1f1f1d] hover:bg-[#292926] text-stone-200 border-[#2e2e2a]'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-stone-400" />
              <span>Manage Categories</span>
            </Link>
          </div>

          <button
            onClick={handleResetCatalog}
            className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors ${
              isDark ? 'text-stone-400 hover:text-amber-300' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Catalog</span>
          </button>
        </div>

        {/* Recently Updated Products Table */}
        <section
          className={`rounded-2xl border overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#151514] border-[#262624] shadow-xs'
              : 'bg-white border-stone-200 shadow-2xs'
          }`}
        >
          <div
            className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              isDark ? 'border-[#262624]' : 'border-stone-200'
            }`}
          >
            <div>
              <h2
                className={`text-base sm:text-lg font-sans font-semibold ${
                  isDark ? 'text-white' : 'text-stone-900'
                }`}
              >
                Recently Updated Metalcraft Pieces
              </h2>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                Latest revisions, additions, and status changes in database.
              </p>
            </div>
            <Link
              href="/admin/products"
              className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-amber-300 hover:text-amber-200' : 'text-stone-900 hover:text-stone-600'
              }`}
            >
              <span>View All ({totalCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr
                  className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                    isDark
                      ? 'bg-[#1a1a18] border-[#262624] text-stone-400'
                      : 'bg-stone-50 border-stone-200 text-stone-500'
                  }`}
                >
                  <th className="py-3 px-5 sm:px-6">Piece & Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (INR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Modified</th>
                  <th className="py-3 px-5 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-sm ${
                  isDark ? 'divide-[#242422]' : 'divide-stone-100'
                }`}
              >
                {recentProducts.map((p) => {
                  const cover = p.images[0]?.url || '/images/brass_urli_hero.jpg';
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
                            <p
                              className={`text-[11px] font-mono ${
                                isDark ? 'text-stone-400' : 'text-stone-500'
                              }`}
                            >
                              {p.sku || 'No SKU'}
                            </p>
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
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium font-sans border ${
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
                      </td>
                      <td
                        className={`py-3.5 px-4 text-xs font-mono ${
                          isDark ? 'text-stone-400' : 'text-stone-500'
                        }`}
                      >
                        {formatDate(p.updatedAt || p.createdAt)}
                      </td>
                      <td className="py-3.5 px-5 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            title="View Public Details"
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
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                              isDark
                                ? 'bg-[#222220] text-amber-200 hover:bg-[#2c2c28] border-[#33332e]'
                                : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border-stone-200'
                            }`}
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Categories Distribution */}
        <section
          className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-colors ${
            isDark
              ? 'bg-[#151514] border-[#262624] shadow-xs'
              : 'bg-white border-stone-200 shadow-2xs'
          }`}
        >
          <h2
            className={`text-base sm:text-lg font-sans font-semibold ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}
          >
            Catalog Balance by Discipline
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 transition-colors ${
                    isDark
                      ? 'border-[#262624] bg-[#1a1a18]'
                      : 'border-stone-200 bg-stone-50'
                  }`}
                >
                  <span
                    className={`text-xs font-medium font-sans ${
                      isDark ? 'text-stone-200' : 'text-stone-800'
                    }`}
                  >
                    {cat.name}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-2xl font-sans font-bold ${
                        isDark ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      {count}
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        isDark ? 'text-amber-300/80' : 'text-stone-500'
                      }`}
                    >
                      {count === 1 ? 'piece' : 'pieces'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
