'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ProductImage } from '@/lib/types';
import { Modal } from '../ui/Modal';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const displayImages =
    images.length > 0
      ? images
      : [
          {
            id: 'fallback',
            url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1400&q=85',
            alt: productName,
            sortOrder: 0,
          },
        ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Focal Main Image */}
      <div className="relative aspect-4/3 sm:aspect-5/4 lg:aspect-4/3 w-full bg-stone-100 rounded-3xl overflow-hidden border border-stone-200/80 group">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-center transition-all duration-500 group-hover:scale-103"
        />

        {/* Counter Badge */}
        <div className="absolute bottom-4 left-4 py-1 px-2.5 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-100 text-xs font-mono">
          {String(selectedIndex + 1).padStart(2, '0')} / {String(displayImages.length).padStart(2, '0')}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreenOpen(true)}
          aria-label="View full resolution image"
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev / Next buttons if multi-image */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-1">
          {displayImages.map((img, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={img.id || index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-stone-100 ${
                  isSelected
                    ? 'border-stone-900 ring-2 ring-stone-900/10 scale-98'
                    : 'border-stone-200/80 hover:border-stone-400 opacity-75 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} angle ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      <Modal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        maxWidth="2xl"
        title={productName}
        description={currentImage.alt}
      >
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-950 mt-2">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || productName}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </Modal>
    </div>
  );
}
