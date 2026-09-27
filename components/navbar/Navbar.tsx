'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ArrowUpRight, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/products' },
    { label: 'Artisan Heritage', href: '/about' },
    { label: 'Trade & Inquiries', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200/90 py-3 shadow-xs'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Brand Monogram & Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-sm font-semibold transition-transform duration-300 group-hover:scale-105 border border-amber-900/20">
              HT
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-wider text-base sm:text-lg font-bold text-stone-950 uppercase">
                Homing Thistle
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-stone-500 font-mono -mt-0.5 sm:-mt-1">
                Indian Artisanal Metalcraft
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors relative py-1 ${
                    isActive
                      ? 'text-stone-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full animate-in fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action on Mobile & Desktop */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick WhatsApp direct link */}
            <a
              href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20reviewing%20the%20Homing%20Thistle%20Artisanal%20Brass%20%26%20Metalcraft%20Catalog."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline font-mono">WhatsApp Atelier</span>
              <span className="sm:hidden font-mono">WhatsApp</span>
            </a>

            <Link
              href="/admin/login"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-200/70 hover:bg-stone-200 border border-stone-300/60 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
              <span>Admin</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 text-stone-800 hover:text-stone-950 hover:bg-stone-200/60 rounded-xl md:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
