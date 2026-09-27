'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, FolderTree, ArrowRight, ExternalLink } from 'lucide-react';
import { Category, Product } from '@/lib/types';
import {
  fetchCategories,
  fetchProducts,
  createCategory,
  subscribeToStore,
} from '@/lib/store';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAdminTheme } from '@/lib/adminThemeContext';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New category form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts(true),
      ]);
      setCategories(cats);
      setProducts(prods);
      setIsLoading(false);
    }

    loadData();
    return subscribeToStore(loadData);
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      const created = await createCategory(
        name.trim(),
        description.trim() || undefined,
        imageUrl.trim() || undefined
      );
      toast(`Design discipline "${created.name}" established.`, 'success');
      setName('');
      setDescription('');
      setImageUrl('');
      setIsModalOpen(false);
    } catch (err) {
      toast('Failed to create category.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="font-sans">
      <AdminHeader
        title="Design Disciplines & Categories"
        subtitle="Manage metalcraft taxonomy, spatial categories, and collection photography"
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
        {/* Top action bar */}
        <div className="flex items-center justify-between">
          <p
            className={`text-xs font-mono uppercase tracking-wider font-semibold ${
              isDark ? 'text-amber-300' : 'text-stone-700'
            }`}
          >
            {categories.length} Registered Disciplines
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs ${
              isDark
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-400/10'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div
            className={`p-16 text-center text-xs font-mono rounded-2xl border ${
              isDark
                ? 'text-stone-400 bg-[#151514] border-[#262624]'
                : 'text-stone-500 bg-white border-stone-200 shadow-2xs'
            }`}
          >
            Loading metalcraft categories...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              const img = cat.imageUrl || '/images/brass_urli_hero.jpg';

              return (
                <div
                  key={cat.id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                    isDark
                      ? 'bg-[#151514] border-[#262624] shadow-xs hover:border-[#383834]'
                      : 'bg-white border-stone-200 shadow-2xs hover:border-stone-300'
                  }`}
                >
                  <div className="relative aspect-16/9 w-full bg-stone-100">
                    <Image
                      src={img}
                      alt={cat.name}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-stone-950/25" />
                    <div
                      className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-mono border backdrop-blur-xs ${
                        isDark
                          ? 'bg-stone-950/85 text-amber-200 border-amber-900/30'
                          : 'bg-white/90 text-stone-900 border-stone-200 shadow-xs'
                      }`}
                    >
                      {count} {count === 1 ? 'Piece' : 'Pieces'}
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-mono ${
                            isDark ? 'text-stone-400' : 'text-stone-500'
                          }`}
                        >
                          /products?category={cat.slug}
                        </span>
                      </div>
                      <h3
                        className={`font-sans font-semibold text-lg ${
                          isDark ? 'text-white' : 'text-stone-900'
                        }`}
                      >
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p
                          className={`text-xs line-clamp-2 mt-1 leading-relaxed ${
                            isDark ? 'text-stone-300' : 'text-stone-600'
                          }`}
                        >
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div
                      className={`pt-3 border-t flex items-center justify-between ${
                        isDark ? 'border-[#262624]' : 'border-stone-100'
                      }`}
                    >
                      <a
                        href={`/products?category=${cat.slug}`}
                        target="_blank"
                        className={`text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                          isDark
                            ? 'text-amber-300 hover:text-amber-200'
                            : 'text-stone-900 hover:text-stone-600'
                        }`}
                      >
                        <span>View Public Listing</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Establish New Design Discipline"
        description="Add a new category to group architectural metalcraft artifacts."
      >
        <form onSubmit={handleCreateCategory} className="space-y-4 pt-2 font-sans">
          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sculptural Pooja Mandir Artifacts"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Cover Image Path or URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/brass_urli_hero.jpg"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Curatorial Scope / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the pieces encompassed by this discipline..."
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors resize-none leading-relaxed ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          <div
            className={`pt-3 border-t flex items-center justify-end gap-3 ${
              isDark ? 'border-[#262624]' : 'border-stone-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
                isDark
                  ? 'border-[#33332e] text-stone-300 hover:text-white'
                  : 'border-stone-300 text-stone-700 hover:text-stone-950'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                isDark
                  ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {isCreating ? 'Saving...' : 'Establish Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
