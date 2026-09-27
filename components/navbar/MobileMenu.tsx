'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ArrowRight, ShieldCheck, Phone, MessageSquare } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Browse Full Catalog', href: '/products' },
    { label: 'Brass Urlis & Floating Bowls', href: '/products?category=brass-urlis' },
    { label: 'Heirloom Pots & Matkas', href: '/products?category=heirloom-pots' },
    { label: 'Wrought Iron & Lanterns', href: '/products?category=iron-brass-lighting' },
    { label: 'Artisan Heritage & Purity', href: '/about' },
    { label: 'Trade Inquiries & Custom Sizes', href: '/contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-stone-950 text-stone-100 p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="flex items-center justify-between pb-5 border-b border-stone-800">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-950 flex items-center justify-center font-serif font-bold text-sm">
            HT
          </div>
          <div>
            <span className="font-serif tracking-widest text-base uppercase font-medium block">
              Homing Thistle
            </span>
            <span className="text-[9px] font-mono tracking-wider text-amber-300 uppercase">
              Handcrafted Metalcraft Catalog
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="py-6 flex flex-col space-y-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center justify-between text-base font-serif tracking-wide py-1.5 transition-all ${
                isActive ? 'text-amber-200 font-semibold pl-2 border-l-2 border-amber-300' : 'text-stone-300 hover:text-white'
              }`}
            >
              <span>{link.label}</span>
              <ArrowRight className="w-4 h-4 opacity-40" />
            </Link>
          );
        })}
      </nav>

      {/* Mobile Client Action Buttons */}
      <div className="pt-6 border-t border-stone-800 space-y-3 mt-auto">
        <a
          href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20reviewing%20the%20Homing%20Thistle%20Artisanal%20Brass%20%26%20Metalcraft%20Catalog."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Client Atelier (+91 98765 43210)</span>
        </a>

        <Link
          href="/admin/login"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 text-xs font-medium transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Curator / Admin Portal</span>
        </Link>
      </div>
    </div>
  );
}
