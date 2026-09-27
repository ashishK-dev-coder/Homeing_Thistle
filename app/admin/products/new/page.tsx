'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Category, ProductFormData } from '@/lib/types';
import { fetchCategories, saveProduct } from '@/lib/store';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductForm } from '@/components/admin/ProductForm';
import { useToast } from '@/components/ui/Toast';
import { useAdminTheme } from '@/lib/adminThemeContext';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchCategories();
      setCategories(cats);
    }
    loadCategories();
  }, []);

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const created = await saveProduct(formData);
      toast(`"${created.name}" successfully commissioned into catalog archive.`, 'success');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      toast('Failed to save product. Please check required fields.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans">
      <AdminHeader
        title="Commission New Piece"
        subtitle="Catalog a new handcrafted brass urli, pot, or wrought iron artifact"
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
        <Link
          href="/admin/products"
          className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium transition-colors ${
            isDark ? 'text-stone-400 hover:text-amber-300' : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Management</span>
        </Link>

        {categories.length > 0 ? (
          <ProductForm
            categories={categories}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div
            className={`p-12 text-center text-xs font-mono rounded-2xl border ${
              isDark
                ? 'text-stone-400 bg-[#151514] border-[#262624]'
                : 'text-stone-500 bg-white border-stone-200 shadow-2xs'
            }`}
          >
            Retrieving metalcraft categories...
          </div>
        )}
      </div>
    </div>
  );
}
