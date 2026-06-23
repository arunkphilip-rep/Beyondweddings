'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { galleryService } from '../../src/lib/services';
import { Gallery } from '../../src/types';

export default function GalleryList() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-bg min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] tracking-[2px] uppercase text-text-muted">Loading client galleries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-bg min-h-screen pt-48 pb-24 px-6 select-none">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-serif tracking-[3px] uppercase text-text">Client Galleries</h1>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4 mb-4" />
          <p className="text-xs text-text-muted tracking-wide max-w-md mx-auto leading-relaxed">
            Welcome to the client portal. Select a wedding story below to view, share, and download the full-resolution editorial files.
          </p>
        </div>

        {galleries.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#E8E3DC] rounded-2xl bg-white/50">
            <p className="text-sm text-text-muted tracking-wide uppercase">No galleries published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {galleries.map((gallery) => (
              <Link 
                key={gallery.id} 
                href={`/gallery/${gallery.slug}`}
                className="group block border border-[#E8E3DC] bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500"
                style={{ transform: 'translateZ(0)', willChange: 'transform, box-shadow' }}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#E8E3DC] relative" style={{ transform: 'translateZ(0)' }}>
                  <img
                    src={gallery.cover_image || '/images/bibin-anju/a.jpg'}
                    alt={gallery.gallery_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-serif uppercase tracking-[1px] text-text group-hover:text-accent transition-colors">
                    {gallery.gallery_name}
                  </h2>
                  
                  <div className="flex flex-col gap-2 mt-4 text-[11px] text-text-muted tracking-wide">
                    {gallery.event_date && (
                      <div className="flex items-center gap-2 font-light">
                        <Calendar size={12} className="text-accent" />
                        <span>{new Date(gallery.event_date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                      </div>
                    )}
                    {gallery.venue && (
                      <div className="flex items-center gap-2 font-light">
                        <MapPin size={12} className="text-accent" />
                        <span>{gallery.venue}</span>
                      </div>
                    )}
                  </div>

                  <div 
                    className="flex items-center gap-2 mt-6 text-[10px] tracking-[2.5px] uppercase font-medium text-text group-hover:translate-x-1.5 transition-transform duration-300"
                    style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                  >
                    <span>Explore Gallery</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 border-t border-[#E8E3DC] pt-8 text-center">
          <p className="text-[10px] text-text-muted tracking-[1.5px] uppercase leading-relaxed max-w-sm mx-auto">
            Can&apos;t find your wedding gallery? Contact the studio at{' '}
            <a href="mailto:beyondweddingss@gmail.com" className="text-text font-semibold underline">
              beyondweddingss@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
