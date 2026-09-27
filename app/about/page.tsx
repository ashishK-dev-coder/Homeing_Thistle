import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Hammer, Sparkles, Scale, ShieldCheck, Flame, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Artisan Lineage & Metal Purity | Homing Thistle',
  description: 'The ancient art of Indian metalcraft: solid virgin brass urlis, mathar hammering, and blacksmith-forged lanterns.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 sm:pt-36 pb-20 space-y-14 sm:space-y-20 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Intro */}
      <section className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
          Artisanal Heritage & Purity
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-950 tracking-normal leading-[1.2]">
          Centuries of Royal Metalcraft, Reimagined for Contemporary Living.
        </h1>
        <p className="text-sm sm:text-base text-stone-700 font-normal leading-relaxed">
          Homing Thistle was born to preserve the sacred lineages of Indian metalsmithing — the Thatheras of Moradabad and the iron-forgers of Rajasthan. We reject lightweight, disposable electroplated decor in favor of 100% solid virgin brass, authentic mathar kaari, and eternal metal permanence.
        </p>
      </section>

      {/* Visual story banner */}
      <section className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden shadow-xl bg-stone-950">
        <Image
          src="/images/brass_pooja_thali.jpg"
          alt="Master metalsmith courtyard in royal Rajasthan"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 text-white max-w-md">
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">Generational Karigar Guilds</p>
          <p className="font-serif text-lg sm:text-2xl mt-0.5 font-bold">Hand-Chiseled Nakashi & Heavy Virgin Brass</p>
        </div>
      </section>

      {/* Narrative grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 items-start">
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
            01 • The Purity of Virgin Peetal
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-950 font-bold tracking-normal">
            Solid Metal Heavyweight Density (No Sheet Metal).
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed">
            In traditional Indian homes, metal was never bought lightly. It was weighed. The heavier the vessel, the purer and more auspicious the brass. We uphold this exact discipline. Our urlis and matka vessels weigh between 4 and 8 kilograms of dense solid virgin brass, ensuring they never dent, wobble, or lose their grounding presence.
          </p>
          <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed">
            Our brass contains zero toxic lead or recycled battery scrap. When you tap our bell-metal pieces, you hear a clean, resonant chime that clears the home of negative vibration.
          </p>
        </div>

        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
            02 • The Thathera Lineage
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-950 font-bold tracking-normal">
            Hand-Beaten Mathar Kaari & Wrought Iron.
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed">
            Every dimple on our vessels is beaten by hand with polished brass hammers while the metal is held over wooden anvils. This hand-hammering (*mathar*) compacts the molecular crystalline structure of the metal, making it virtually indestructible.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hello%2C%20I%20would%20like%20to%20learn%20more%20about%20the%20Homing%20Thistle%20Artisan%20Lineage."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
