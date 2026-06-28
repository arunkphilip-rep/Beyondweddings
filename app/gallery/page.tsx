'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import { galleryService } from '../../src/lib/services';
import { Gallery } from '../../src/types';

export default function GalleryList() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const list = await galleryService.getAllGalleries();
        setGalleries(list);
      } catch (err) {
        console.error('Failed to fetch galleries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (loading || galleries.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setVisibleIds((prev) => ({ ...prev, [id]: true }));
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = document.querySelectorAll('.gal-list-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [loading, galleries]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#0A0908] min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] tracking-[2px] uppercase text-zinc-500">Loading client galleries...</p>
        </div>
      </div>
    );
  }

  // Get the first gallery cover for hero background
  const heroBg = galleries[0]?.cover_image || '/images/bibin-anju/a.jpg';

  const handleScrollToGrid = () => {
    if (gridRef.current) {
      const lenis = (window as any).lenisInstance;
      if (lenis) {
        lenis.scrollTo(gridRef.current);
      } else {
        gridRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex-grow bg-[#0A0908] text-white min-h-screen select-none">
      {/* Cinematic Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105"
          style={{ 
            backgroundImage: `url('${heroBg}')`,
            animation: 'heroPan 20s ease-in-out infinite alternate',
            willChange: 'transform'
          }}
        />
        {/* Sleek Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-black/45 to-black/30" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <span className="text-[10px] tracking-[4px] uppercase text-accent font-medium mb-3 block animate-fade-in">
            Client Galleries
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-[2px] uppercase mb-4 animate-fade-in-up">
            Wedding Stories
          </h1>
          <p className="text-xs md:text-sm text-zinc-300 tracking-wide font-light leading-relaxed mb-8 max-w-lg mx-auto">
            Welcome to your private portal. Select a wedding story below to view, share, and download the full-resolution editorial files.
          </p>
          
          <button 
            onClick={handleScrollToGrid}
            className="inline-flex flex-col items-center gap-2 text-[9px] tracking-[3px] uppercase text-zinc-400 hover:text-white transition-colors duration-300 mt-4 cursor-pointer"
          >
            <span>Browse Stories</span>
            <ChevronDown size={14} className="animate-bounce mt-1" />
          </button>
        </div>
      </section>

      {/* Gallery Cards Container */}
      <div 
        ref={gridRef}
        className="max-w-[1200px] mx-auto px-6 py-24 scroll-mt-10"
      >
        {galleries.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-white/[0.02]">
            <p className="text-sm text-zinc-500 tracking-wide uppercase">No galleries published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {galleries.map((gallery, idx) => (
              <Link 
                key={gallery.id} 
                data-id={String(gallery.id)}
                href={`/gallery/${gallery.slug}`}
                className="gal-list-card group block"
                style={{ 
                  willChange: 'transform, opacity',
                  opacity: visibleIds[gallery.id] ? 1 : 0,
                  transform: visibleIds[gallery.id] ? 'translateY(0) translateZ(0)' : 'translateY(30px) translateZ(0)',
                  transition: `opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${idx * 60}ms, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${idx * 60}ms`
                }}
              >
                <div className="gal-list-card-inner aspect-[16/10] w-full overflow-hidden bg-zinc-900 relative rounded-2xl border border-zinc-800/40 shadow-2xl">
                  {/* Gallery Image */}
                  <img
                    src={gallery.cover_image || '/images/bibin-anju/a.jpg'}
                    alt={gallery.gallery_name}
                    className="gal-list-card-img w-full h-full object-cover"
                    style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                    loading={idx < 2 ? 'eager' : 'lazy'}
                  />
                  {/* Gradient bottom overlay for metadata readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

                  {/* Card Info Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
                    <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-[1px] text-white group-hover:text-accent transition-colors duration-300 mb-3">
                      {gallery.gallery_name}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 text-[10px] text-zinc-400 tracking-wider">
                      {gallery.event_date && (
                        <div className="flex items-center gap-1.5 font-light">
                          <Calendar size={11} className="text-accent" />
                          <span>{new Date(gallery.event_date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                        </div>
                      )}
                      {gallery.venue && (
                        <div className="flex items-center gap-1.5 font-light">
                          <MapPin size={11} className="text-accent" />
                          <span>{gallery.venue}</span>
                        </div>
                      )}
                    </div>

                    <div 
                      className="gal-list-card-cta flex items-center gap-2 mt-5 text-[9px] tracking-[3px] uppercase font-semibold text-accent"
                    >
                      <span>Explore Gallery</span>
                      <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Cinematic Footer for Portal */}
        <div className="mt-24 border-t border-zinc-800/60 pt-12 text-center">
          <p className="text-[9px] text-zinc-500 tracking-[2px] uppercase leading-relaxed max-w-sm mx-auto">
            Can&apos;t find your wedding gallery? Contact the studio at{' '}
            <a href="mailto:beyondweddingss@gmail.com" className="text-white font-semibold underline hover:text-accent transition-colors duration-300">
              beyondweddingss@gmail.com
            </a>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes heroPan {
          0% { transform: scale(1.03) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1%, -1%); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
