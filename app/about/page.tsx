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
              At Beyond Weddings, we believe every love story is a masterpiece waiting to be told with elegance, grace, and cinematic artistry. Our lenses do not just take pictures; they catch the quiet whispers, the unscripted laughter, and the timeless poetry written between two souls.
            </p>
            <p className="text-text-muted text-sm leading-relaxed mt-4">
              With a deep passion for the art of emotion, we trace the gentle unfolding of your promise. We capture the sweet anticipation of your Save the Date, follow the rising joy of your celebrations, and immortalize the breathtaking magic of your Wedding day. Every frame is painted with natural light, woven with soft shadows, and crafted with the deepest intention to keep your memories forever young.
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

