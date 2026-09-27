'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Product, Category, ProductFormData } from '@/lib/types';
import { fetchProductById, fetchCategories, saveProduct } from '@/lib/store';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductForm } from '@/components/admin/ProductForm';
import { useToast } from '@/components/ui/Toast';
import { useAdminTheme } from '@/lib/adminThemeContext';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!productId) return;
      const [prod, cats] = await Promise.all([
        fetchProductById(productId),
        fetchCategories(),
      ]);
      setProduct(prod);
      setCategories(cats);
      setIsLoading(false);
    }
    loadData();
  }, [productId]);

  const handleSubmit = async (formData: ProductFormData) => {
    if (!product) return;
    setIsSubmitting(true);
    try {
      const updated = await saveProduct(formData, product.id);
      setProduct(updated);
      toast(`"${updated.name}" revisions preserved.`, 'success');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      toast('Failed to preserve changes.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans">
      <AdminHeader
        title={product ? `Edit: ${product.name}` : 'Edit Piece'}
        subtitle="Update karigar provenance, photography, metal weight, and availability"
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/products"
            className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium transition-colors ${
              isDark ? 'text-stone-400 hover:text-amber-300' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Product Management</span>
          </Link>

          {product && (
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className={`inline-flex items-center gap-1 text-xs font-mono font-medium transition-colors ${
                isDark ? 'text-amber-300 hover:text-amber-200' : 'text-stone-900 hover:text-stone-600'
              }`}
            >
              <span>View Live Piece</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div
            className={`p-16 text-center text-xs font-mono rounded-2xl border ${
              isDark
                ? 'text-stone-400 bg-[#151514] border-[#262624]'
                : 'text-stone-500 bg-white border-stone-200 shadow-2xs'
            }`}
          >
            Retrieving piece specifications from archive...
          </div>
        ) : !product ? (
          <div
            className={`p-16 text-center space-y-3 rounded-2xl border ${
              isDark
                ? 'bg-[#151514] border-[#262624] text-white'
                : 'bg-white border-stone-200 text-stone-900 shadow-2xs'
            }`}
          >
            <h3 className="font-sans font-semibold text-lg">Piece Not Found</h3>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              The requested metalcraft product does not exist in the database.
            </p>
            <Link
              href="/admin/products"
              className={`inline-flex items-center px-4 py-2 rounded-xl font-bold text-xs ${
                isDark
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              Return to Catalog List
            </Link>
          </div>
        ) : (
          <ProductForm
            initialProduct={product}
            categories={categories}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
