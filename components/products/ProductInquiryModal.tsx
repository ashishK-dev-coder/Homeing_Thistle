'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Product } from '@/lib/types';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

interface ProductInquiryModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductInquiryModal({
  product,
  isOpen,
  onClose,
}: ProductInquiryModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [projectType, setProjectType] = useState('Private Residence / Villa');
  const [message, setMessage] = useState(
    `Namaste, I am interested in commissioning "${product.name}" (SKU: ${product.sku || 'Bespoke'}). Please share trade pricing, custom sizes, and dispatch timeline.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast(`Inquiry for "${product.name}" received. Our studio team will connect within 24 hours.`, 'success');
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const whatsappDirectUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Namaste, I am inquiring about "${product.name}" from Homing Thistle. My Name: ${name || 'Client'}. City: ${city || 'India'}. ${message}`
  )}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="Private Client & Trade Commission"
      description={`Regarding ${product.name} (Ref: ${product.sku || 'Heirloom'})`}
      maxWidth="lg"
    >
      {isSubmitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-xl text-stone-900">Inquiry Transmitted</h4>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
            Thank you, {name || 'esteemed client'}. Our atelier curator will review your requirements and reach out via WhatsApp/Phone at <span className="font-mono text-stone-900">{phone || email}</span> shortly.
          </p>
          <button
            onClick={handleResetAndClose}
            className="mt-3 px-6 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors"
          >
            Close Window
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Quick WhatsApp option banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <span className="text-emerald-900 font-medium">
              Prefer instant WhatsApp reply?
            </span>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vikramaditya Singhania"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                WhatsApp / Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New Delhi / Mumbai / Bangalore"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Project Category
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white cursor-pointer"
              >
                <option value="Private Residence / Villa">Private Residence / Villa / Farmhouse</option>
                <option value="Interior Designer / Architect Trade">Interior Designer / Architect Project</option>
                <option value="Heritage Hotel / Resort">Heritage Hotel / Luxury Hospitality</option>
                <option value="Temple / Sacred Pooja Sanctuary">Mandir / Sacred Pooja Room Sanctuary</option>
                <option value="Custom Size Urli Commission">Custom Diameter Commission (24'' to 36'')</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Custom Requirements or Notes
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting...' : 'Submit Inquiry'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
