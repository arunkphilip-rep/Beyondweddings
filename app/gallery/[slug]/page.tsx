'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { galleryService } from '../../../src/lib/services';
import { Gallery, GalleryImage } from '../../../src/types';
import { Download, ChevronLeft, ChevronRight, X, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function GalleryView() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        const record = await galleryService.getGallery(slug);
        if (!record) {
          router.push('/');
          return;
        }

        setGallery(record);
        const imgList = await galleryService.getGalleryImages(record.id);
        setImages(imgList);
      } catch (err) {
        console.error(err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadGalleryData();
  }, [slug, router]);

  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback if fetch fails (e.g. CORS)
      window.open(imgUrl, '_blank');
    }
  };

  const handlePrevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrevLightbox();
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'Escape') setLightboxIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-bg min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] tracking-[2px] uppercase text-text-muted">Loading private gallery...</p>
        </div>
      </div>
    );
  }

  if (!gallery) return null;

  // Split gallery images into 3 columns for local masonry
  const col1 = images.filter((_, idx) => idx % 3 === 0);
  const col2 = images.filter((_, idx) => idx % 3 === 1);
  const col3 = images.filter((_, idx) => idx % 3 === 2);

  return (
    <div className="flex-grow bg-bg min-h-screen pt-48 pb-24 px-6 select-none">
      <div className="max-w-[1300px] mx-auto">

        {/* Navigation & Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8E3DC] pb-8 mb-12 gap-6">
          <div>
            <Link href="/gallery" className="inline-flex items-center gap-2 text-[10px] text-text-muted tracking-[2px] uppercase hover:text-accent mb-4 transition-colors">
              <ArrowLeft size={10} />
              <span>Back to galleries</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif tracking-[1.5px] uppercase text-text">
              {gallery.gallery_name}
            </h1>
            <div className="flex flex-wrap gap-6 text-xs text-text-muted mt-3">
              {gallery.event_date && (
                <div className="flex items-center gap-1.5 font-light">
                  <Calendar size={13} className="text-accent" />
                  <span>{new Date(gallery.event_date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                </div>
              )}
              {gallery.venue && (
                <div className="flex items-center gap-1.5 font-light">
                  <MapPin size={13} className="text-accent" />
                  <span>{gallery.venue}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              // Download all images in a batch or loop (MVP downloads single files, button is placeholder/informational here)
              alert('Click download on individual photos to get full-resolution files.');
            }}
            className="flex items-center gap-2 self-start md:self-auto px-5 py-3 border border-text text-text text-[10px] tracking-[2.5px] uppercase hover:bg-text hover:text-white transition-colors rounded-xl"
          >
            <Download size={12} />
            <span>Download Instructions</span>
          </button>
        </div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#E8E3DC] rounded-2xl bg-white/50">
            <p className="text-sm text-text-muted tracking-wide uppercase">No images uploaded in this gallery yet.</p>
          </div>
        ) : (
          <div className="grid-container">
            {/* Column 1 */}
            <div className="grid-col flex-1 flex flex-col gap-6">
              {col1.map((img) => {
                const idx = images.indexOf(img);
                return (
                  <div 
                    key={img.id} 
                    className="relative group cursor-pointer overflow-hidden rounded-2xl bg-[#E8E3DC] aspect-auto"
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <img
                      src={img.image_url}
                      alt={img.file_name}
                      onClick={() => setLightboxIndex(idx)}
                      className="w-full h-auto object-cover transition-transform duration-700 hover:scale-102"
                      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img.image_url, img.file_name);
                      }}
                      className="absolute bottom-4 right-4 bg-white/90 text-text p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-105"
                      style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
                      aria-label="Download Image"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="grid-col flex-1 flex flex-col gap-6">
              {col2.map((img) => {
                const idx = images.indexOf(img);
                return (
                  <div 
                    key={img.id} 
                    className="relative group cursor-pointer overflow-hidden rounded-2xl bg-[#E8E3DC] aspect-auto"
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <img
                      src={img.image_url}
                      alt={img.file_name}
                      onClick={() => setLightboxIndex(idx)}
                      className="w-full h-auto object-cover transition-transform duration-700 hover:scale-102"
                      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img.image_url, img.file_name);
                      }}
                      className="absolute bottom-4 right-4 bg-white/90 text-text p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-105"
                      style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
                      aria-label="Download Image"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Column 3 */}
            <div className="grid-col flex-1 flex flex-col gap-6">
              {col3.map((img) => {
                const idx = images.indexOf(img);
                return (
                  <div 
                    key={img.id} 
                    className="relative group cursor-pointer overflow-hidden rounded-2xl bg-[#E8E3DC] aspect-auto"
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <img
                      src={img.image_url}
                      alt={img.file_name}
                      onClick={() => setLightboxIndex(idx)}
                      className="w-full h-auto object-cover transition-transform duration-700 hover:scale-102"
                      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img.image_url, img.file_name);
                      }}
                      className="absolute bottom-4 right-4 bg-white/90 text-text p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-105"
                      style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
                      aria-label="Download Image"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Fullscreen Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Controls */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
            aria-label="Close Lightbox"
          >
            <X size={20} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(images[lightboxIndex].image_url, images[lightboxIndex].file_name);
            }}
            className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase bg-white/10 px-4 py-2 rounded-full"
            aria-label="Download Image"
          >
            <Download size={12} />
            <span>Download</span>
          </button>

          <button
            onClick={handlePrevLightbox}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4"
            aria-label="Previous Image"
          >
            <ChevronLeft size={36} className="font-light" />
          </button>

          <button
            onClick={handleNextLightbox}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4"
            aria-label="Next Image"
          >
            <ChevronRight size={36} className="font-light" />
          </button>

          {/* Image slide */}
          <div className="max-w-[85vw] max-h-[75vh] relative flex items-center justify-center">
            <img
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].file_name}
              className="max-w-full max-h-[75vh] object-contain rounded shadow-lg"
            />
          </div>

          {/* Index indicator */}
          <div className="absolute bottom-8 text-white/50 text-[10px] tracking-[2px] uppercase">
            {lightboxIndex + 1} / {images.length} — {images[lightboxIndex].file_name}
          </div>
        </div>
      )}
    </div>
  );
}
