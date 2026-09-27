'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Send,
  Share2,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Hammer,
  MessageSquare,
  Flame,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { fetchProductBySlug, fetchProducts, subscribeToStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { ProductGallery } from '@/components/products/ProductGallery';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { ProductInquiryModal } from '@/components/products/ProductInquiryModal';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      const [found, all] = await Promise.all([
        fetchProductBySlug(slug),
        fetchProducts(true),
      ]);
      setProduct(found);
      setAllProducts(all);
      setIsLoading(false);
    }

    loadProduct();
    return subscribeToStore(loadProduct);
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('Catalog piece link copied to clipboard.', 'success');
    }
  };

  const getWeight = () => {
    return product?.specifications.find((s) =>
      s.key.toLowerCase().includes('weight')
    )?.value;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center font-mono text-stone-400 text-xs">
        Opening atelier archive...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-40 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900">
          Piece Not Found in Catalog
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          The requested brass or metalcraft piece may be in private archive or temporarily withdrawn.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const weightVal = getWeight();
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Namaste, I am reviewing the "${product.name}" (SKU: ${product.sku || 'N/A'}) from the Homing Thistle Metalcraft Catalog. Please share trade availability, custom dimensions, and white-glove delivery details.`
  )}`;

  return (
    <div className="pt-24 sm:pt-36 pb-28 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 sm:space-y-20">
        {/* 1. Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-stone-400 overflow-x-auto pb-1"
        >
          <Link href="/" className="hover:text-stone-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/products" className="hover:text-stone-800 transition-colors">
            Catalog
          </Link>
          {product.categoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link
                href={`/products?category=${product.categoryId}`}
                className="hover:text-stone-800 transition-colors truncate max-w-[140px] sm:max-w-none"
              >
                {product.categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-stone-900 truncate font-medium">
            {product.name}
          </span>
        </nav>

        {/* 2. Primary Showcase Section (Split layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Psychological & Commercial Information */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-3">
              {/* Category & Status badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.categoryName && (
                  <Badge variant="neutral" size="sm" className="bg-stone-100 text-stone-800 border-stone-200">
                    {product.categoryName}
                  </Badge>
                )}
                {product.featured && (
                  <Badge variant="default" size="sm" className="bg-stone-900 text-amber-200 border-amber-900/40 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    Flagship Piece
                  </Badge>
                )}
                {product.status === 'draft' && (
                  <Badge variant="warning" size="sm">
                    Studio Prototype
                  </Badge>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 tracking-normal leading-tight">
                {product.name}
              </h1>

              {/* Price & SKU */}
              <div className="flex items-baseline justify-between border-b border-stone-200 pb-3 pt-1">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-stone-950">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-mono font-medium text-stone-500">
                  Ref: {product.sku || 'Bespoke Forge'}
                </span>
              </div>
            </div>

            {/* Psychological Purity & Weight Callout Banner */}
            {weightVal && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300/60">
                  <Scale className="w-5 h-5 text-amber-800" />
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-amber-950 font-serif text-sm">
                    Heirloom Heft: {weightVal}
                  </p>
                  <p className="text-[11px] text-amber-900 font-mono font-medium">
                    Solid Virgin Metal • Acoustic Chime Resonant • No Sheet Fillers
                  </p>
                </div>
              </div>
            )}

            {/* Short Narrative */}
            <p className="text-sm text-stone-700 font-normal leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Fulfillment Status */}
            <div className="p-4 rounded-2xl bg-stone-100/90 border border-stone-200 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Clock className="w-4 h-4 text-stone-700" />
                <span>Pan-India Dispatch & Atelier Delivery:</span>
              </div>
              <p className="text-stone-700 pl-6 text-xs font-normal">
                {product.leadTime || 'Insured wooden crate shipping across India in 24-48 hours.'}
              </p>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3 pt-1">
              {/* WhatsApp direct inquiry button (Primary for Indian clients) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-lg"
              >
                <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                <span>Inquire on WhatsApp (+91 98765 43210)</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full border border-stone-300 hover:border-stone-900 text-stone-900 text-xs font-bold uppercase tracking-wider transition-colors bg-white shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5 text-stone-600 stroke-[2.5]" />
                  <span>Email Atelier</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full border border-stone-300 hover:border-stone-900 text-stone-900 text-xs font-bold uppercase tracking-wider transition-colors bg-white shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-600 stroke-[2.5]" />
                  <span>Share Piece</span>
                </button>
              </div>
            </div>

            {/* Guarantees / Service Notes */}
            <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Wooden Crate Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Lifetime Metal Purity</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Deep Curatorial Narrative */}
        {product.description && (
          <section className="pt-10 sm:pt-14 border-t border-stone-200 max-w-4xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
              Karigar Craftsmanship Narrative
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-normal">
              Provenance, Metallurgy & Heritage
            </h2>
            <div className="text-stone-700 text-sm sm:text-base leading-relaxed font-normal space-y-3">
              <p>{product.description}</p>
            </div>
          </section>
        )}

        {/* 4. Features Highlights Blocks (Feature 01, 02, 03, 04) */}
        {product.features && product.features.length > 0 && (
          <section className="pt-10 sm:pt-14 border-t border-stone-200 space-y-6 sm:space-y-8">
            <div className="max-w-2xl space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
                Artisanal Hallmarks
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-normal">
                Design & Metal Nuances
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {product.features.map((feature, idx) => (
                <div
                  key={feature.id || idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-2xs space-y-3"
                >
                  <span className="text-[11px] font-mono text-amber-900 block uppercase font-bold tracking-wider">
                    Feature {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-950">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Specifications Table */}
        {product.specifications && product.specifications.length > 0 && (
          <section className="pt-10 sm:pt-14 border-t border-stone-200 space-y-6">
            <div className="max-w-2xl space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
                Technical Archive Sheet
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-normal">
                Specifications, Metal Gauge & Origin
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="divide-y divide-stone-100">
                {product.specifications.map((spec, idx) => (
                  <div
                    key={spec.id || idx}
                    className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 hover:bg-stone-50/70 transition-colors"
                  >
                    <div className="sm:col-span-4 text-xs font-mono uppercase tracking-wider text-stone-600 font-bold">
                      {spec.key}
                    </div>
                    <div className="sm:col-span-8 text-xs sm:text-sm text-stone-900 font-sans mt-0.5 sm:mt-0 font-medium">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          categoryId={product.categoryId}
          allProducts={allProducts}
        />
      </div>

      {/* MOBILE STICKY BOTTOM BAR (Mobile Client Excellence) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 flex items-center justify-between shadow-2xl">
        <div className="min-w-0 pr-3">
          <p className="font-serif font-medium text-stone-900 text-xs truncate">
            {product.name}
          </p>
          <p className="font-mono text-sm font-semibold text-stone-950">
            {formatPrice(product.price)}
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider shadow-md shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp Inquiry</span>
        </a>
      </div>

      {/* Inquiry Dialog Modal */}
      <ProductInquiryModal
        product={product}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </div>
  );
}
