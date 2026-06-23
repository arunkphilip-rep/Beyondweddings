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

      // 2. Open WhatsApp link to allow direct messaging
      const waUrl = inquiryService.getWhatsAppUrl({
        bride_name: formData.bride_name,
        groom_name: formData.groom_name,
        wedding_date: formData.wedding_date,
        venue: formData.venue,
        budget: formData.budget
      });

      window.open(waUrl, '_blank');

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
      }, 5000);

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
      <form className="contact-form" onSubmit={handleSubmit}>
        {errorMsg && (
          <div className="text-red-500 text-xs tracking-wider uppercase mb-2">
            {errorMsg}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-xs tracking-wider uppercase mb-2" style={{
            animation: 'fadeUp 0.5s ease forwards'
          }}>
            ✓ Inquiry submitted successfully! Opening WhatsApp...
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
