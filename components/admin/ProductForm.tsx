'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Save,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Product, Category, ProductFormData } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { useToast } from '../ui/Toast';
import { useAdminTheme } from '@/lib/adminThemeContext';

interface ProductFormProps {
  initialProduct?: Product;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProductForm({
  initialProduct,
  categories,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [autoSlug, setAutoSlug] = useState(!initialProduct);
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || categories[0]?.id || ''
  );
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ''
  );
  const [description, setDescription] = useState(
    initialProduct?.description || ''
  );
  const [price, setPrice] = useState<string>(
    initialProduct?.price !== undefined ? String(initialProduct.price) : ''
  );
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [status, setStatus] = useState<'published' | 'draft'>(
    initialProduct?.status || 'published'
  );
  const [featured, setFeatured] = useState(initialProduct?.featured || false);
  const [inStock, setInStock] = useState(initialProduct?.inStock ?? true);
  const [leadTime, setLeadTime] = useState(
    initialProduct?.leadTime || 'In Stock • Dispatches in 24-48 hours across India'
  );

  // Images state
  const [images, setImages] = useState<
    { url: string; alt: string; isCover?: boolean }[]
  >(
    initialProduct?.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      isCover: img.isCover,
    })) || [
      {
        url: '/images/brass_urli_hero.jpg',
        alt: 'Primary product perspective',
        isCover: true,
      },
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Features state
  const [features, setFeatures] = useState<{ title: string; description: string }[]>(
    initialProduct?.features.map((f) => ({
      title: f.title,
      description: f.description,
    })) || [
      {
        title: 'Authentic Mathar Kaari (Hand-Hammered)',
        description: 'Over 3,000 rhythmic hammer strikes by master metalsmiths creating an organic lustrous texture.',
      },
      {
        title: '100% Solid Virgin Brass (5.8 kg)',
        description: 'Dense heavyweight construction. Resonant chime when struck, with zero hollow filler or toxic lead.',
      },
    ]
  );

  // Specifications state
  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >(
    initialProduct?.specifications.map((s) => ({
      key: s.key,
      value: s.value,
    })) || [
      { key: 'Material', value: '100% Solid Heavy-Gauge Virgin Brass (Peetal)' },
      { key: 'Weight', value: '5.8 kg (Heirloom Dense Mass)' },
      { key: 'Dimensions', value: '18" Diameter × 5.5" Height' },
      { key: 'Origin', value: 'Moradabad & Jaipur Karigar Ateliers' },
      { key: 'Care', value: 'Clean with natural pitambari/lemon for shine or allow natural golden oxidation' },
    ]
  );

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(
    initialProduct?.seoDescription || ''
  );

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        url: newImageUrl.trim(),
        alt: `${name || 'Product'} perspective ${prev.length + 1}`,
        isCover: prev.length === 0,
      },
    ]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      toast('At least one image is required for the catalog.', 'error');
      return;
    }
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index].isCover && updated.length > 0) {
        updated[0].isCover = true;
      }
      return updated;
    });
  };

  const handleSetCover = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isCover: i === index,
      }))
    );
  };

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, { title: '', description: '' }]);
  };

  const handleUpdateFeature = (
    index: number,
    field: 'title' | 'description',
    val: string
  ) => {
    setFeatures((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSpecification = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleUpdateSpec = (
    index: number,
    field: 'key' | 'value',
    val: string
  ) => {
    setSpecifications((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast('Product Name is required.', 'error');
      return;
    }

    if (!shortDescription.trim()) {
      toast('Short Description is required.', 'error');
      return;
    }

    const payload: ProductFormData = {
      name: name.trim(),
      slug: slugify(slug || name),
      categoryId,
      shortDescription: shortDescription.trim(),
      description: description.trim() || shortDescription.trim(),
      price: price ? parseFloat(price) : undefined,
      sku: sku.trim() || undefined,
      status,
      featured,
      inStock,
      leadTime: leadTime.trim() || undefined,
      images,
      features: features.filter((f) => f.title.trim()),
      specifications: specifications.filter((s) => s.key.trim() && s.value.trim()),
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-16 font-sans">
      {/* 1. Core Nomenclature & Classification */}
      <section
        className={`rounded-2xl border p-5 sm:p-7 space-y-5 transition-colors ${
          isDark
            ? 'bg-[#151514] border-[#262624] shadow-xs'
            : 'bg-white border-stone-200 shadow-2xs'
        }`}
      >
        <div className={`border-b pb-3.5 ${isDark ? 'border-[#262624]' : 'border-stone-200'}`}>
          <h2
            className={`text-base sm:text-lg font-sans font-semibold ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}
          >
            1. Core Nomenclature & Classification
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            Specify the formal name, category, and curatorial narrative.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="sm:col-span-2">
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Piece Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Royal Hand-Hammered Kamal Brass Urli"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 focus:bg-[#20201d] text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 focus:bg-white text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                  isDark ? 'text-amber-300' : 'text-stone-700'
                }`}
              >
                URL Slug *
              </label>
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className={`text-[11px] transition-colors ${
                  isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {autoSlug ? 'Manual Edit' : 'Auto-Generate'}
              </button>
            </div>
            <div
              className={`flex items-center border rounded-xl px-3 transition-colors ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus-within:border-amber-400'
                  : 'bg-stone-50 border-stone-300 focus-within:border-stone-900'
              }`}
            >
              <span className={`text-xs font-mono ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                /products/
              </span>
              <input
                type="text"
                required
                value={slug}
                disabled={autoSlug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className={`w-full py-2.5 px-1 bg-transparent text-sm font-mono focus:outline-none ${
                  isDark
                    ? 'text-white disabled:text-stone-400'
                    : 'text-stone-900 disabled:text-stone-500'
                }`}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Metalcraft Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900'
              }`}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className={isDark ? 'bg-[#151514]' : 'bg-white'}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Short Description */}
          <div className="sm:col-span-2">
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Short Summary Description *
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Masterpiece 5.8 kg virgin brass urli with continuous hand-hammered mathar texture..."
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Full Narrative */}
          <div className="sm:col-span-2">
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Curatorial Narrative & Karigar Lineage
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the karigar guild, metallurgy, hammer technique, and vastu significance..."
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors leading-relaxed resize-none ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>
        </div>
      </section>

      {/* 2. Attributes & Commercial Status */}
      <section
        className={`rounded-2xl border p-5 sm:p-7 space-y-5 transition-colors ${
          isDark
            ? 'bg-[#151514] border-[#262624] shadow-xs'
            : 'bg-white border-stone-200 shadow-2xs'
        }`}
      >
        <div className={`border-b pb-3.5 ${isDark ? 'border-[#262624]' : 'border-stone-200'}`}>
          <h2
            className={`text-base sm:text-lg font-sans font-semibold ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}
          >
            2. Commercial Attributes & Availability
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            Pricing in INR (₹), catalog SKU, and publication state.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Price */}
          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Price (INR ₹, Optional)
            </label>
            <div className="relative">
              <span
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm ${
                  isDark ? 'text-amber-400' : 'text-stone-500'
                }`}
              >
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="12500"
                className={`w-full pl-8 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors font-mono ${
                  isDark
                    ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                    : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
                }`}
              />
            </div>
          </div>

          {/* SKU */}
          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Catalog SKU
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. HT-URL-001"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors font-mono uppercase ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Status */}
          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Publish Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900'
              }`}
            >
              <option value="published" className={isDark ? 'bg-[#151514]' : 'bg-white'}>
                Published (Visible on site)
              </option>
              <option value="draft" className={isDark ? 'bg-[#151514]' : 'bg-white'}>
                Draft (Private in studio)
              </option>
            </select>
          </div>

          {/* Lead time */}
          <div className="sm:col-span-3">
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Fulfillment Timeline & Dispatch Note
            </label>
            <input
              type="text"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              placeholder="e.g. In Stock • Dispatches in 24-48 hours across India"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          {/* Toggles */}
          <div className="sm:col-span-3 flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 border-stone-300 focus:ring-amber-400"
              />
              <span
                className={`text-sm font-medium ${
                  isDark ? 'text-stone-200' : 'text-stone-800'
                }`}
              >
                Feature in Homepage Curated Showcase
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 border-stone-300 focus:ring-amber-400"
              />
              <span
                className={`text-sm font-medium ${
                  isDark ? 'text-stone-200' : 'text-stone-800'
                }`}
              >
                Immediate Foundry Stock Available
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* 3. Photographic Imagery */}
      <section
        className={`rounded-2xl border p-5 sm:p-7 space-y-5 transition-colors ${
          isDark
            ? 'bg-[#151514] border-[#262624] shadow-xs'
            : 'bg-white border-stone-200 shadow-2xs'
        }`}
      >
        <div className={`border-b pb-3.5 ${isDark ? 'border-[#262624]' : 'border-stone-200'}`}>
          <h2
            className={`text-base sm:text-lg font-sans font-semibold ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}
          >
            3. Photographic Imagery & Angles
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            Add high-resolution image paths or URLs. Set the cover image for catalog cards.
          </p>
        </div>

        {/* Existing images list */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden border-2 group ${
                img.isCover
                  ? isDark
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : 'border-stone-900 ring-2 ring-stone-900/10'
                  : isDark
                  ? 'border-[#2e2e2a] bg-[#1b1b19]'
                  : 'border-stone-200 bg-stone-100'
              }`}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={img.url}
                  alt={img.alt || `Photo ${idx + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>

              {img.isCover && (
                <div
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 shadow-md ${
                    isDark
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-900 text-white'
                  }`}
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                  Cover
                </div>
              )}

              <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {!img.isCover && (
                  <button
                    type="button"
                    onClick={() => handleSetCover(idx)}
                    className="w-full py-1 text-[11px] font-semibold rounded bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors"
                  >
                    Set as Cover
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add image URL input */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste image path (e.g. /images/brass_urli_hero.jpg or URL)..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={handleAddImage}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
              isDark
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            Add Image
          </button>
        </div>
      </section>

      {/* 4. Features & Craft Highlights */}
      <section
        className={`rounded-2xl border p-5 sm:p-7 space-y-5 transition-colors ${
          isDark
            ? 'bg-[#151514] border-[#262624] shadow-xs'
            : 'bg-white border-stone-200 shadow-2xs'
        }`}
      >
        <div className={`flex items-center justify-between border-b pb-3.5 ${
          isDark ? 'border-[#262624]' : 'border-stone-200'
        }`}>
          <div>
            <h2
              className={`text-base sm:text-lg font-sans font-semibold ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}
            >
              4. Features & Craft Highlights
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              Highlight karigar techniques, weight, or vastu energy nuances.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddFeature}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isDark
                ? 'border-[#33332e] hover:border-amber-400 text-amber-200'
                : 'border-stone-300 hover:border-stone-900 text-stone-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Feature</span>
          </button>
        </div>

        <div className="space-y-3.5">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-2.5 ${
                isDark
                  ? 'border-[#282825] bg-[#1a1a18]'
                  : 'border-stone-200 bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-mono uppercase font-semibold ${
                    isDark ? 'text-amber-300' : 'text-stone-600'
                  }`}
                >
                  Feature {String(idx + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-stone-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={feature.title}
                onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                placeholder="Feature headline (e.g. Authentic Mathar Kaari)"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  isDark
                    ? 'bg-[#151514] border-[#2e2e2a] focus:border-amber-400 text-white'
                    : 'bg-white border-stone-300 focus:border-stone-900 text-stone-900'
                }`}
              />

              <textarea
                rows={2}
                value={feature.description}
                onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                placeholder="Detailed craft explanation..."
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none resize-none leading-relaxed ${
                  isDark
                    ? 'bg-[#151514] border-[#2e2e2a] focus:border-amber-400 text-stone-200'
                    : 'bg-white border-stone-300 focus:border-stone-900 text-stone-800'
                }`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Technical Specifications */}
      <section
        className={`rounded-2xl border p-5 sm:p-7 space-y-5 transition-colors ${
          isDark
            ? 'bg-[#151514] border-[#262624] shadow-xs'
            : 'bg-white border-stone-200 shadow-2xs'
        }`}
      >
        <div className={`flex items-center justify-between border-b pb-3.5 ${
          isDark ? 'border-[#262624]' : 'border-stone-200'
        }`}>
          <div>
            <h2
              className={`text-base sm:text-lg font-sans font-semibold ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}
            >
              5. Technical Specifications & Weight
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              Key-value pairs for Weight, Material, Diameter, Height, and Origin.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddSpecification}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isDark
                ? 'border-[#33332e] hover:border-amber-400 text-amber-200'
                : 'border-stone-300 hover:border-stone-900 text-stone-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Spec Row</span>
          </button>
        </div>

        <div className="space-y-3">
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                placeholder="Key (e.g. Weight)"
                className={`w-1/3 px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none ${
                  isDark
                    ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-amber-200'
                    : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-800'
                }`}
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                placeholder="Value (e.g. 5.8 kg Solid Virgin Brass)"
                className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none ${
                  isDark
                    ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white'
                    : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900'
                }`}
              />
              <button
                type="button"
                onClick={() => handleRemoveSpec(idx)}
                className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SEO Metadata */}
      <section
        className={`rounded-2xl border p-5 sm:p-7 space-y-5 transition-colors ${
          isDark
            ? 'bg-[#151514] border-[#262624] shadow-xs'
            : 'bg-white border-stone-200 shadow-2xs'
        }`}
      >
        <div className={`border-b pb-3.5 ${isDark ? 'border-[#262624]' : 'border-stone-200'}`}>
          <h2
            className={`text-base sm:text-lg font-sans font-semibold ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}
          >
            6. Search Engine Optimization (SEO)
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            Meta tags for Google and catalog share links.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5 ${
                isDark ? 'text-amber-300' : 'text-stone-700'
              }`}
            >
              Meta Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={`${name || 'Product'} | Homing Thistle Heritage`}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors ${
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
              Meta Description
            </label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="High-end summary tailored for search results..."
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors resize-none ${
                isDark
                  ? 'bg-[#1b1b19] border-[#2e2e2a] focus:border-amber-400 text-white placeholder-stone-500'
                  : 'bg-stone-50 border-stone-300 focus:border-stone-900 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>
        </div>
      </section>

      {/* Form Submission Actions */}
      <div className={`flex items-center justify-between pt-4 border-t ${
        isDark ? 'border-[#262624]' : 'border-stone-200'
      }`}>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className={`px-5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
            isDark
              ? 'border-[#33332f] hover:border-[#4d4d46] text-stone-300 hover:text-white'
              : 'border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-950'
          }`}
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {initialProduct && (
            <a
              href={`/products/${initialProduct.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                isDark
                  ? 'border-[#33332f] text-stone-300 hover:text-white hover:bg-[#1a1a18]'
                  : 'border-stone-300 text-stone-700 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Piece</span>
            </a>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 ${
              isDark
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-400/10'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Preserving...' : initialProduct ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
