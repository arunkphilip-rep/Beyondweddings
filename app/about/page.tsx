import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About | BEYOND WEDDINGS",
  description:
    "Beyond Weddings is a story-driven wedding photography studio crafting fine art editorial images with emotion and elegance.",
};

export default function AboutPage() {
  return (
    <main className="flex-grow bg-bg min-h-screen pt-32 pb-24 px-6 select-none">
      <div className="max-w-[1200px] mx-auto">
        {/* About Hero */}
        <header className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-serif tracking-[3px] uppercase text-text">
            About the Studio
          </h1>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4 mb-6" />
          <p className="text-xs text-text-muted tracking-wide max-w-2xl mx-auto leading-relaxed">
            {""}
            A premium wedding photography experience built on emotion, elegance, and story-driven storytelling.
          </p>
        </header>

        {/* Brand Story */}
        <section className="mb-16 border-t border-[#E8E3DC] pt-12">
          <div className="max-w-[900px] mx-auto">
            <div className="section-label">Brand Story</div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              Crafted like an editorial album—frame by frame.
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              Beyond Weddings was created for couples who want more than photographs. We believe every love story has
              a rhythm—small gestures, quiet glances, and the feeling of a moment that deserves to be remembered
              beautifully.
            </p>
            <p className="text-text-muted text-sm leading-relaxed mt-4">
              Our approach blends fine art composition with contemporary editorial styling. From candid emotion to
              cinematic lighting, we craft timeless images with a refined, minimal aesthetic.
            </p>
            <p className="text-text-muted text-sm leading-relaxed mt-4">
              Based in Kerala/Europe (as applicable), available worldwide for destination weddings across India and beyond.
              Our mission is simple: create galleries that feel intimate, authentic, and unforgettable.
            </p>
          </div>
        </section>

        {/* Photography Philosophy */}
        <section className="mb-16 border-t border-[#E8E3DC] pt-12">
          <div className="max-w-[900px] mx-auto">
            <div className="section-label">Photography Philosophy</div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              How We Capture Stories
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              We guide gently, let the day breathe, and capture what feels real. Every session is designed to protect
              spontaneity while producing editorial-level quality.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-text-muted">
              <li>• Natural light and cinematic color grading</li>
              <li>• Timeless editorial composition (never overly “posed”)</li>
              <li>• Direction with comfort—so you can feel present</li>
              <li>• A gallery that tells a full narrative, not just highlights</li>
            </ul>
          </div>
        </section>

        {/* FAQ (simple inline; Home already has FAQ) */}
        <section className="mb-16 border-t border-[#E8E3DC] pt-12">
          <div className="max-w-[900px] mx-auto">
            <div className="section-label">FAQ</div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              Common Questions
            </h2>

            <div className="text-sm text-text-muted leading-relaxed space-y-6">
              <div>
                <strong className="text-text">How far in advance should we book?</strong>
                <div>We recommend 8–12 months for peak dates. If you’re closer, contact us—we’ll check availability.</div>
              </div>
              <div>
                <strong className="text-text">Do you travel for weddings?</strong>
                <div>Yes. Destination weddings are part of what we love—worldwide coverage with seamless planning.</div>
              </div>
              <div>
                <strong className="text-text">How many photos will we receive?</strong>
                <div>Typically 600–800+ images for a full day, carefully edited and delivered via an online gallery.</div>
              </div>
              <div>
                <strong className="text-text">When will photos be delivered?</strong>
                <div>Delivery timelines depend on season and coverage. We’ll share the expected schedule during inquiry.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Availability / Contact CTA */}
        <section className="text-center border-t border-[#E8E3DC] pt-12">
          <h2 className="section-title" style={{ marginBottom: 10 }}>
            Ready to tell your story?
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-[700px] mx-auto">
            Share your wedding details and we’ll respond with availability, a tailored plan, and next steps.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-4 border border-text text-text text-[10px] tracking-[3px] uppercase hover:bg-text hover:text-white transition-all duration-300 rounded-xl"
            >
              Contact Us
            </a>
            <a
              href="https://wa.me/918714003230"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-accent text-text text-[10px] tracking-[3px] uppercase hover:bg-accent hover:text-white transition-all duration-300 rounded-xl"
            >
              WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

