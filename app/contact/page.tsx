import type { Metadata } from 'next';
import ContactForm from '../../src/features/inquiries/ContactForm';

export const metadata: Metadata = {
  title: "Contact | BEYOND WEDDINGS",
  description: "Send an inquiry to Beyond Weddings for wedding photography and films. We respond with availability and next steps.",
};

export default function ContactPage() {

  return (
    <main className="flex-grow bg-bg min-h-screen pt-32 pb-24 px-6 select-none">
      <div className="max-w-[1200px] mx-auto">
        {/* Contact Hero */}
        <header className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-serif tracking-[3px] uppercase text-text">Let’s Tell Your Story</h1>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4 mb-6" />
          <p className="text-xs text-text-muted tracking-wide max-w-2xl mx-auto leading-relaxed">
            Share your wedding details and we’ll respond with availability, a tailored plan, and next steps.
          </p>
        </header>

        {/* Inquiry Form + Contact Methods */}
        <section className="border-t border-[#E8E3DC] pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-label">Inquiry Form</div>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 2.7vw, 2.2rem)', marginBottom: 14 }}>
                Plan Your Wedding Consultation
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                Fill in your details. We’ll review your request and get back to you shortly.
              </p>
              <ContactForm />
            </div>

            <aside>
              <div className="section-label">Contact Information</div>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 2.7vw, 2.2rem)', marginBottom: 14 }}>
                Direct Ways to Reach Us
              </h2>

              <div className="space-y-8">
                <div>
                  <div className="contact-item-label">WhatsApp</div>
                  <a
                    href="https://wa.me/918714003230"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text hover:text-accent font-light text-sm"
                  >
                    +91 87140 03230
                  </a>
                </div>

                <div>
                  <div className="contact-item-label">Phone</div>
                  <a href="tel:+918714003230" className="text-text hover:text-accent font-light text-sm block">+91 87140 03230</a>
                </div>

                <div>
                  <div className="contact-item-label">Instagram</div>
                  <a
                    href="https://www.instagram.com/beyond_weddingss/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text hover:text-accent font-light text-sm"
                  >
                    @beyondweddings
                  </a>
                </div>

                <div>
                  <div className="contact-item-label">Email</div>
                  <a href="mailto:beyondweddingss@gmail.com" className="text-text hover:text-accent font-light text-sm">
                    beyondweddingss@gmail.com
                  </a>
                </div>
              </div>

            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

