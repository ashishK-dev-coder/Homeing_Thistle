'use client';

import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [subject, setSubject] = useState('Trade Account / Designer Catalog');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast('Dhanyavaad! Your inquiry has been received by our atelier curator.', 'success');
    }, 600);
  };

  return (
    <div className="pt-24 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-8 space-y-12 sm:space-y-16">
      {/* Intro */}
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block">
          Client Services & Trade Commissions
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-950 tracking-normal">
          Connect With Our Atelier
        </h1>
        <p className="text-sm sm:text-base text-stone-700 font-normal leading-relaxed">
          Whether you are commissioning a bespoke 36-inch brass urli for a farm villa entrance, requesting trade pricing for architectural projects, or visiting our foundry workshops.
        </p>

        {/* WhatsApp Highlight Box */}
        <div className="pt-2">
          <a
            href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20contacting%20Homing%20Thistle%20Atelier%20for%20a%20private%20metalcraft%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Direct WhatsApp Desk (+91 98765 43210)</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-2xs">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-stone-900">Inquiry Transmitted</h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                Thank you, {name}. Our client liaison team will connect with you via WhatsApp/Phone at <span className="font-mono text-stone-900">{phone || email}</span> within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-serif font-medium text-stone-900">
                Direct Atelier Dispatch
              </h2>

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
                    placeholder="Aditya Verma"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white font-mono"
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
                    placeholder="New Delhi / Mumbai / Jaipur"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Nature of Inquiry
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white cursor-pointer"
                  >
                    <option value="Trade Account / Designer Catalog">Architect / Interior Trade Pricing</option>
                    <option value="Custom Size Urli Commission">Custom Urli Dimensions (24'' to 36'')</option>
                    <option value="Atelier Visit Appointment">Atelier Visit (Delhi / Moradabad / Jaipur)</option>
                    <option value="Corporate / Festive Gifting">Corporate & Royal Festive Gifting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Message / Project Scope
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your requirements, residence type, or desired metalcraft pieces..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-800 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs uppercase tracking-widest font-semibold transition-all shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Studio Locations in India */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-900">
              Indian Ateliers & Workshops
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Showrooms open for private viewing by trade and private commission appointment.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold">National Capital Region</span>
              <h4 className="font-serif text-base font-medium text-stone-900">New Delhi Gallery & Trade Desk</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Gallery 14, The Design Street, MG Road / Sultanpur<br />
                New Delhi 110030, India
              </p>
              <p className="text-[11px] text-emerald-700 font-mono pt-0.5">delhi@homingthistle.in</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold">Heritage Brass Hub</span>
              <h4 className="font-serif text-base font-medium text-stone-900">Moradabad Foundry & Karigar Atelier</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pital Nagri Artisan Guild, Sambhal Road<br />
                Moradabad 244001, Uttar Pradesh, India
              </p>
              <p className="text-[11px] text-emerald-700 font-mono pt-0.5">foundry@homingthistle.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
