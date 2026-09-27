'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '../ui/Toast';

export function Footer() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    toast('Dhanyavaad. You have been added to our private catalog circulation.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-950 flex items-center justify-center font-serif text-sm font-semibold border border-amber-400">
                HT
              </div>
              <span className="font-serif tracking-widest text-lg font-medium text-stone-100 uppercase">
                Homing Thistle
              </span>
            </Link>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Artisanal hand-hammered brass urlis, royal chiseled matka pots, and blacksmith-forged lanterns. Conceived for architectural residences, havelis, and luxury sanctuaries.
            </p>
            <div className="space-y-1.5 text-xs text-stone-400 font-mono pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Ateliers: Moradabad • Jaipur • Jodhpur • New Delhi</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>atelier@homingthistle.in</span>
              </div>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-mono text-amber-300 font-semibold">
              Metalcraft Catalog
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=brass-urlis" className="hover:text-white transition-colors">
                  Brass Urlis & Floating Bowls
                </Link>
              </li>
              <li>
                <Link href="/products?category=heirloom-pots" className="hover:text-white transition-colors">
                  Heirloom Pots & Matkas
                </Link>
              </li>
              <li>
                <Link href="/products?category=iron-brass-lighting" className="hover:text-white transition-colors">
                  Forged Iron & Lanterns
                </Link>
              </li>
              <li>
                <Link href="/products?category=vases-accents" className="hover:text-white transition-colors">
                  Sculpted Vases & Accents
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-amber-200 hover:text-white transition-colors font-medium">
                  View Full 8-Piece Catalog →
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-mono text-amber-300 font-semibold">
              Heritage & Atelier
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Thathera Karigar Lineage
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Solid Virgin Brass Purity
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Architect & Trade Catalog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Bespoke Dimensions Commission
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors pt-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Curator / Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-mono text-amber-300 font-semibold">
              Trade Circulation
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Receive limited forge batch notifications and festive collection previews directly.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 bg-stone-900 rounded-xl text-xs text-emerald-300 border border-stone-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are on our private catalog list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full bg-stone-900 border border-stone-800 focus:border-stone-500 rounded-xl py-2 pl-3 pr-9 text-xs text-white placeholder-stone-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1 top-1 bottom-1 px-2 bg-stone-100 hover:bg-white text-stone-900 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  Confidential communication. No spam.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Homing Thistle Heritage Metalcraft Pvt Ltd. Handcrafted in India.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-stone-300">
              Purity Protocol
            </Link>
            <Link href="/contact" className="hover:text-stone-300">
              Trade Terms
            </Link>
            <Link href="/admin/login" className="hover:text-stone-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
