'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Scale,
  Hammer,
  Flame,
  MessageSquare,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { fetchProducts, fetchCategories, subscribeToStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [allProds, allCats] = await Promise.all([
        fetchProducts(false),
        fetchCategories(),
      ]);
      const feat = allProds.filter((p) => p.featured);
      setFeaturedProducts(feat.length > 0 ? feat.slice(0, 4) : allProds.slice(0, 4));
      setCategories(allCats);
      setIsLoading(false);
    }

    loadData();
    return subscribeToStore(loadData);
  }, []);

  return (
    <div className="space-y-20 sm:space-y-32 lg:space-y-40 pb-28 overflow-hidden font-sans">
      {/* 1. HERO SECTION (Airy, Spacious, Crystal-Clear Typography) */}
      <section className="relative pt-28 sm:pt-36 lg:pt-44 pb-4 sm:pb-8 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Text Column: Clean, uncluttered, highly readable */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
            {/* Curatorial Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="font-medium">Pure Virgin Brass • Generational Karigar Guilds</span>
            </div>

            {/* Main Headline: Bold, crystal-clear, readable */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-bold text-stone-950 tracking-normal leading-[1.18]">
                Heirloom Indian Metalcraft, Handcrafted for Regal Spaces.
              </h1>
              <p className="text-base sm:text-lg text-stone-700 font-normal leading-relaxed max-w-xl">
                A curated catalog of solid hand-hammered brass urlis, etched matkas, and blacksmith-forged haveli lanterns. Handcrafted in pure virgin brass by generational karigars of Moradabad and Rajasthan.
              </p>
            </div>

            {/* Clean, high-contrast action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-lg"
              >
                <span>Browse Product Catalog</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <a
                href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20interested%20in%20receiving%20the%20Homing%20Thistle%20Brass%20%26%20Metalcraft%20Catalog%20and%20Trade%20Pricing."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs uppercase tracking-widest font-bold transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                <span>WhatsApp Catalog (+91)</span>
              </a>
            </div>
          </div>

          {/* Right Product Showcase: Clean, uncluttered, focused */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Hero Showcase Image */}
              <div className="relative aspect-4/3 sm:aspect-5/4 rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-100">
                <Image
                  src="/images/brass_urli_hero.jpg"
                  alt="Royal Hand-Hammered Kamal Brass Urli with marigolds and jasmine"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center transform hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent opacity-90" />

                {/* Clean Floating Caption */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl text-stone-900">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-amber-800 font-bold">
                      Flagship Masterpiece
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      5.8 kg Pure Brass
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-stone-950">
                    Royal Hand-Hammered Kamal Urli
                  </h3>
                  <div className="mt-2 pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-950 font-mono text-sm sm:text-base">
                      {formatPrice(12500)}
                    </span>
                    <Link
                      href="/products/royal-hand-hammered-kamal-brass-urli"
                      className="font-bold text-stone-900 hover:text-amber-800 inline-flex items-center gap-1"
                    >
                      <span>Explore Piece</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DEDICATED PROVENANCE & QUALITY STRIP (Spacious horizontal trust bar) */}
        <div className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-stone-200 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-950 font-serif font-bold text-base sm:text-lg">
              <Scale className="w-4 h-4 text-amber-700 shrink-0" />
              <span>5.8 – 8.2 kg Dense Heft</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              100% Solid virgin brass with acoustic chime. Zero hollow sheet or lead fillers.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-950 font-serif font-bold text-base sm:text-lg">
              <Hammer className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Mathar Kaari Craft</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Over 3,000 rhythmic hammer strikes by master metalsmiths creating an organic ripple.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-950 font-serif font-bold text-base sm:text-lg">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Auspicious Vastu Prana</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Traditional entrance water sanctums that radiate calm, welcoming peace and grace.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-950 font-serif font-bold text-base sm:text-lg">
              <Compass className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Heritage Ateliers</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Direct provenance from generational metalsmith quarters of Moradabad and Jaipur.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION (Spacious, Uncluttered Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 pb-5 border-b border-stone-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Curated Masterpieces</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950">
              Flagship Brass & Forged Iron Pieces
            </h2>
            <p className="text-sm text-stone-600 max-w-xl font-normal leading-relaxed">
              Individually weighed, hand-chiseled artifacts designed as focal points for luxury living spaces.
            </p>
          </div>

          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 hover:border-stone-900 text-xs uppercase tracking-wider font-bold text-stone-900 hover:text-stone-950 transition-all whitespace-nowrap"
            >
              <span>View All 8 Pieces</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Product Grid with generous spacing */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} priority={idx === 0} />
            ))}
          </div>
        )}
      </section>

      {/* 4. DESIGN DISCIPLINES (Clean, Spacious Category Cards) */}
      <section className="bg-stone-50/80 border-y border-stone-200 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
              Artisanal Craft Disciplines
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950">
              Explore by Metalcraft Category
            </h2>
            <p className="text-sm text-stone-600 font-normal leading-relaxed">
              Select an artisanal discipline to discover hand-hammered urlis, royal pots, and wrought iron lighting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 shadow-md transition-all duration-300 hover:shadow-xl"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center opacity-80 transition-transform duration-700 group-hover:scale-106 group-hover:opacity-90"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/35 to-transparent" />

                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 font-bold mb-1">
                    Discipline
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-normal leading-snug">
                    {cat.name}
                  </h3>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-amber-200">
                    <span>View Collection</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PSYCHOLOGICAL HERITAGE & KARIGAR PILLARS (Uncongested, airy, high contrast) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-6 border-b border-stone-200">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
                Why Connoisseurs Choose Homing Thistle
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 leading-tight">
                The Psychological Purity of Real Heavyweight Metalcraft.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm text-stone-600 font-normal leading-relaxed">
                Most commercial market decor is hollow pressed scrap with synthetic chemical golden spray that peels within months. We forge only solid virgin brass (*kora peetal*) and high-carbon wrought iron that grows more majestic with every decade.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200 shadow-2xs space-y-4 hover:border-stone-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200/60">
                <Scale className="w-5 h-5 text-amber-800" />
              </div>
              <span className="text-xs font-mono text-amber-800 block uppercase font-bold tracking-wider">
                Heft & Density
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-950">
                Genuine Weight in Your Hands
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                When you hold a Homing Thistle piece, the dense physical mass (5-8 kilograms) instantly communicates heirloom authenticity. No hollow cavities. No sheet metal wobbles.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200 shadow-2xs space-y-4 hover:border-stone-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200/60">
                <Hammer className="w-5 h-5 text-amber-800" />
              </div>
              <span className="text-xs font-mono text-amber-800 block uppercase font-bold tracking-wider">
                Generational Thikana
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-950">
                Master Mathar Kaari Craft
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Shaped by fourth-generation metalsmith families across Moradabad, Jaipur, and Thanjavur who beat red-hot ingots by hand to forge organic ripples that catch natural sunlight.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200 shadow-2xs space-y-4 hover:border-stone-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200/60">
                <Sparkles className="w-5 h-5 text-amber-800" />
              </div>
              <span className="text-xs font-mono text-amber-800 block uppercase font-bold tracking-wider">
                Auspicious Harmony
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-950">
                Vastu & Sacred Space Alignment
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                In Vedic traditions, virgin brass and copper harmonize energy fields. Placing our floating water urlis at living entrances brings tranquility, welcoming grace, and peaceful prana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ARCHITECTURAL / TRADE CONCIERGE BANNER (Spacious & Grand) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 text-white min-h-[420px] flex items-center p-8 sm:p-14 lg:p-16 shadow-2xl">
          <Image
            src="/images/brass_pooja_thali.jpg"
            alt="Royal Heritage Courtyard"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-25"
          />
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
              Trade & Private Client Concierge
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight text-white">
              Bespoke Scales for Haveli, Villa, & Hotel Projects.
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              We collaborate with premier interior design studios and residential architects across India and globally. Commission custom urli diameters up to 36 inches, custom brass patinas, and wrought iron lighting fixtures.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20an%20interior%20designer%2Farchitect%20looking%20for%20the%20Homing%20Thistle%20Trade%20Catalog."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-bold transition-all shadow-lg flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                <span>WhatsApp Trade Desk</span>
              </a>
              <Link
                href="/products"
                className="px-6 py-3.5 rounded-full border border-stone-600 hover:border-white text-stone-100 text-xs uppercase tracking-wider font-bold transition-all"
              >
                Browse All 8 Pieces
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
