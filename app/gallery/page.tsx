'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface GalleryListItem {
  title: string;
  slug: string;
  cover: string;
  date: string;
  venue: string;
}

const clientGalleries: GalleryListItem[] = [
  {
    title: 'Rahul & Sneha Wedding',
    slug: 'rahul-sneha',
    cover: '/images/4/a.JPEG',
    date: 'May 18, 2026',
    venue: 'Palakkad, Kerala'
  },
  {
    title: 'Demo Wedding Story',
    slug: 'demo',
    cover: '/images/1/a.jpg',
    date: 'January 15, 2026',
    venue: 'Kochi, Kerala'
  }
];

export default function GalleryList() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {clientGalleries.map((gallery) => (
            <Link 
              key={gallery.slug} 
              href={`/gallery/${gallery.slug}`}
              className="group block border border-[#E8E3DC] bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#E8E3DC] relative">
                <img
                  src={gallery.cover}
                  alt={gallery.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
              </div>

              <div className="p-6 md:p-8">
                <h2 className="text-xl font-serif uppercase tracking-[1px] text-text group-hover:text-accent transition-colors">
                  {gallery.title}
                </h2>
                
                <div className="flex flex-col gap-2 mt-4 text-[11px] text-text-muted tracking-wide">
                  <div className="flex items-center gap-2 font-light">
                    <Calendar size={12} className="text-accent" />
                    <span>{gallery.date}</span>
                  </div>
                  <div className="flex items-center gap-2 font-light">
                    <MapPin size={12} className="text-accent" />
                    <span>{gallery.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6 text-[10px] tracking-[2.5px] uppercase font-medium text-text group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>Explore Gallery</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 border-t border-[#E8E3DC] pt-8 text-center">
          <p className="text-[10px] text-text-muted tracking-[1.5px] uppercase leading-relaxed max-w-sm mx-auto">
            Can&apos;t find your wedding gallery? Contact the studio at{' '}
            <a href="mailto:info@beyondweddings.com" className="text-text font-semibold underline">
              info@beyondweddings.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
