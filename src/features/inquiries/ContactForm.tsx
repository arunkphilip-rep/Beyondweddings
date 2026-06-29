'use client';

import React, { useState } from 'react';
import { inquiryService } from '../../lib/services';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    bride_name: '',
    groom_name: '',
    phone: '',
    email: '',
    wedding_date: '',
    venue: '',
    budget: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Submit lead details to database / localStorage
      await inquiryService.submitInquiry({
        bride_name: formData.bride_name,
        groom_name: formData.groom_name || undefined,
        phone: formData.phone,
        email: formData.email || undefined,
        wedding_date: formData.wedding_date || undefined,
        venue: formData.venue || undefined,
        budget: formData.budget || undefined,
        message: formData.message || undefined
      });

      setSuccess(true);

      // Reset form fields
      setFormData({
        bride_name: '',
        groom_name: '',
        phone: '',
        email: '',
        wedding_date: '',
        venue: '',
        budget: '',
        message: ''
      });

      setTimeout(() => {
        setSuccess(false);
      }, 7000);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please check fields.';
      console.error(err);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-col">
      {success && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#FAF8F5] w-full max-w-md p-10 rounded-xl shadow-2xl text-center relative" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
            <button onClick={() => setSuccess(false)} className="absolute top-4 right-5 text-xl text-text-muted hover:text-text transition-colors">
              ✕
            </button>
            <h3 className="font-serif text-2xl mb-4 text-[#1C1C1C] uppercase tracking-widest">Thank You</h3>
            <div className="w-12 h-[1px] bg-[#B08D57] mx-auto mb-6" />
            <p className="text-[#6B6B6B] text-sm tracking-wide leading-relaxed">
              Your inquiry has been successfully sent. We will review your details and be in touch soon.
            </p>
          </div>
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        {errorMsg && (
          <div className="text-red-500 text-xs tracking-wider uppercase mb-4">
            {errorMsg}
          </div>
        )}

        <div className="form-row">
          <input
            type="text"
            name="bride_name"
            placeholder="Bride's Name *"
            value={formData.bride_name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="text"
            name="groom_name"
            placeholder="Groom's Name"
            value={formData.groom_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="wedding_date"
            placeholder="Wedding Date (if applicable)"
            value={formData.wedding_date}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue / Location"
            value={formData.venue}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <input
          type="text"
          name="budget"
          placeholder="Estimated Budget (e.g. 1.5L, 3L+)"
          value={formData.budget}
          onChange={handleChange}
          disabled={loading}
          className="mb-4"
        />

        <textarea
          name="message"
          placeholder="Tell us about your vision..."
          rows={5}
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
        />

        <button
          type="submit"
          className="form-submit transition-opacity duration-300"
          style={{ opacity: loading || success ? 0.6 : 1 }}
          disabled={loading || success}
        >
          {loading ? 'SENDING...' : success ? '✓ THANK YOU' : 'SEND INQUIRY'}
        </button>
      </form>
    </div>
  );
}
