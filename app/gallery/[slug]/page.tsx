'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { galleryService } from '../../../src/lib/services';
import { Gallery, GalleryImage } from '../../../src/types';
import {
  Download, ChevronLeft, ChevronRight, X,
  ArrowLeft, Calendar, MapPin, ZoomIn, ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────── */
export default function GalleryView() {
  const router  = useRouter();
  const params  = useParams();
  const slug    = params.slug as string;

  const [loading,          setLoading]          = useState(true);
  const [gallery,          setGallery]          = useState<Gallery | null>(null);
  const [images,           setImages]           = useState<GalleryImage[]>([]);
  const [lightboxIndex,    setLightboxIndex]    = useState<number | null>(null);
  const [lightboxLoaded,   setLightboxLoaded]   = useState(false);
  const [lightboxClosing,  setLightboxClosing]  = useState(false);
  const [coverLoaded,      setCoverLoaded]      = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);

  /* ── Data ── */
  useEffect(() => {
    (async () => {
      try {
        const record = await galleryService.getGallery(slug);
        if (!record) { router.push('/'); return; }
        setGallery(record);
        setImages(await galleryService.getGalleryImages(record.id));
      } catch { router.push('/'); }
      finally  { setLoading(false); }
    })();
  }, [slug, router]);

  /* ── Lightbox helpers ── */
  const openLightbox = useCallback((idx: number) => {
    setLightboxClosing(false);
    setLightboxLoaded(false);
    setLightboxIndex(idx);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxClosing(true);
    setTimeout(() => {
      setLightboxIndex(null);
      setLightboxClosing(false);
      document.body.style.overflow = '';
    }, 340);
  }, []);

  const goPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxLoaded(false);
    setLightboxIndex(p => p !== null ? (p > 0 ? p - 1 : images.length - 1) : null);
  }, [images.length]);

  const goNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxLoaded(false);
    setLightboxIndex(p => p !== null ? (p < images.length - 1 ? p + 1 : 0) : null);
  }, [images.length]);

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, goPrev, goNext, closeLightbox]);

  /* ── Auto-scroll filmstrip ── */
  useEffect(() => {
    if (lightboxIndex === null || !thumbRef.current) return;
    const strip = thumbRef.current;
    const thumb = strip.children[lightboxIndex] as HTMLElement;
    if (thumb) {
      strip.scrollTo({
        left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [lightboxIndex]);

  /* ── Download ── */
  const handleDownload = async (url: string, name: string) => {
    try {
      const blob = await fetch(url).then(r => r.blob());
      const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob), download: name,
      });
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch { window.open(url, '_blank'); }
  };

  /* ── Scroll to grid ── */
  const scrollToGrid = () => {
    document.getElementById('gal-grid-anchor')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Loading state ── */
  if (loading) return (
    <div className="gal-fs-loading">
      <div className="gal-fs-spin" />
      <p>Loading gallery…</p>
    </div>
  );

  if (!gallery) return null;

  /* ── 3-col distribution ── */
  const col1 = images.filter((_, i) => i % 3 === 0);
  const col2 = images.filter((_, i) => i % 3 === 1);
  const col3 = images.filter((_, i) => i % 3 === 2);
  const isOpen = lightboxIndex !== null;

  return (
    <>
      {/* ══════════════════════════════════════════════════
          MAIN CANVAS  (blurs behind lightbox)
      ══════════════════════════════════════════════════ */}
      <div
        className="gal-canvas"
        style={{
          filter:        isOpen ? 'blur(12px) brightness(0.45) saturate(0.6)' : 'none',
          transition:    'filter 0.45s cubic-bezier(0.4,0,0.2,1)',
          willChange:    'filter',
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
      >

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="gal-hero">
          {/* Cover image */}
          <div className="gal-hero-bg">
            <img
              src={gallery.cover_image || images[0]?.image_url || '/images/bibin-anju/a.jpg'}
              alt={gallery.gallery_name}
              className={`gal-hero-bg-img ${coverLoaded ? 'gal-hero-bg-img--loaded' : ''}`}
              onLoad={() => setCoverLoaded(true)}
              draggable={false}
            />
          </div>

          {/* Gradient overlays */}
          <div className="gal-hero-grad-top"    />
          <div className="gal-hero-grad-bottom" />

          {/* Back link — top-left */}
          <Link href="/gallery" className="gal-hero-back">
            <ArrowLeft size={12} />
            <span>Galleries</span>
          </Link>

          {/* Centre content */}
          <div className="gal-hero-content">
            <p className="gal-hero-label">Private Collection</p>
            <h1 className="gal-hero-title">{gallery.gallery_name}</h1>
            <div className="gal-hero-meta">
              {gallery.event_date && (
                <span className="gal-hero-meta-item">
                  <Calendar size={11} />
                  {new Date(gallery.event_date).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </span>
              )}
              {gallery.venue && (
                <span className="gal-hero-meta-item">
                  <MapPin size={11} />
                  {gallery.venue}
                </span>
              )}
              <span className="gal-hero-meta-item">
                {images.length} Photographs
              </span>
            </div>
          </div>

          {/* Scroll cue */}
          <button className="gal-hero-scroll" onClick={scrollToGrid} aria-label="Scroll to gallery">
            <span>View Gallery</span>
            <ChevronDown size={16} className="gal-hero-scroll-icon" />
          </button>
        </section>

        {/* ── GRID ANCHOR ─────────────────────────────── */}
        <div id="gal-grid-anchor" />

        {/* ── MASONRY GRID ─────────────────────────────── */}
        <section className="gal-grid-section">
          {images.length === 0 ? (
            <div className="gal-empty">No photographs in this gallery yet.</div>
          ) : (
            <div className="gal-grid">
              <div className="gal-col">
                {col1.map(img => (
                  <GalleryCard key={img.id} img={img} idx={images.indexOf(img)}
                    onOpen={() => openLightbox(images.indexOf(img))}
                    onDownload={() => handleDownload(img.image_url, img.file_name)} />
                ))}
              </div>
              <div className="gal-col gal-col--mid">
                {col2.map(img => (
                  <GalleryCard key={img.id} img={img} idx={images.indexOf(img)}
                    onOpen={() => openLightbox(images.indexOf(img))}
                    onDownload={() => handleDownload(img.image_url, img.file_name)} />
                ))}
              </div>
              <div className="gal-col gal-col--late">
                {col3.map(img => (
                  <GalleryCard key={img.id} img={img} idx={images.indexOf(img)}
                    onOpen={() => openLightbox(images.indexOf(img))}
                    onDownload={() => handleDownload(img.image_url, img.file_name)} />
                ))}
              </div>
            </div>
          )}

          {/* Footer strip inside dark section */}
          <div className="gal-grid-footer">
            <span className="gal-grid-footer-brand">Beyond Weddings</span>
            <Link href="/gallery" className="gal-grid-footer-back">
              <ArrowLeft size={10} /> All Galleries
            </Link>
          </div>
        </section>

      </div>{/* /gal-canvas */}

      {/* ══════════════════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════════════════ */}
      {lightboxIndex !== null && (
        <div
          role="dialog" aria-modal="true" aria-label="Image viewer"
          className={`gal-lb ${lightboxClosing ? 'gal-lb--out' : 'gal-lb--in'}`}
          onClick={closeLightbox}
        >
          {/* ── Top bar ── */}
          <div className="gal-lb-bar" onClick={e => e.stopPropagation()}>
            <button
              className="gal-lb-pill"
              onClick={() => handleDownload(images[lightboxIndex].image_url, images[lightboxIndex].file_name)}
            >
              <Download size={13} /> <span>Download</span>
            </button>

            <div className="gal-lb-count">
              <span className="gal-lb-count-cur">{String(lightboxIndex + 1).padStart(2, '0')}</span>
              <span className="gal-lb-count-sep"> / </span>
              <span className="gal-lb-count-tot">{String(images.length).padStart(2, '0')}</span>
            </div>

            <button className="gal-lb-close" onClick={closeLightbox} aria-label="Close">
              <X size={17} />
            </button>
          </div>

          {/* ── Arrows ── */}
          <button className="gal-lb-arrow gal-lb-arrow--l" onClick={goPrev} aria-label="Previous">
            <ChevronLeft size={28} />
          </button>
          <button className="gal-lb-arrow gal-lb-arrow--r" onClick={goNext} aria-label="Next">
            <ChevronRight size={28} />
          </button>

          {/* ── Image ── */}
          <div className="gal-lb-stage" onClick={e => e.stopPropagation()}>
            {!lightboxLoaded && (
              <div className="gal-lb-loader">
                <div className="gal-lb-loader-ring" />
              </div>
            )}
            <img
              key={images[lightboxIndex].id}
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].file_name}
              draggable={false}
              onLoad={() => setLightboxLoaded(true)}
              className={`gal-lb-img ${lightboxLoaded ? 'gal-lb-img--on' : ''}`}
            />
          </div>

          {/* ── Caption ── */}
          <div className="gal-lb-caption" onClick={e => e.stopPropagation()}>
            {gallery.gallery_name} &mdash; {gallery.venue || ''}
          </div>

          {/* ── Filmstrip ── */}
          <div className="gal-lb-strip" ref={thumbRef} onClick={e => e.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={img.id}
                aria-label={`Image ${i + 1}`}
                className={`gal-lb-thumb ${i === lightboxIndex ? 'gal-lb-thumb--on' : ''}`}
                onClick={() => { setLightboxLoaded(false); setLightboxIndex(i); }}
              >
                <img src={img.image_url} alt="" draggable={false} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────
   Gallery Card
───────────────────────────────────────────────────── */
function GalleryCard({
  img, idx, onOpen, onDownload,
}: {
  img: GalleryImage; idx: number;
  onOpen: () => void; onDownload: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* IntersectionObserver reveal */
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`gal-card ${visible ? 'gal-card--vis' : ''}`}
      style={{ transitionDelay: `${(idx % 4) * 55}ms` }}
    >
      <div className="gal-card-inner" onClick={onOpen}>
        {!loaded && <div className="gal-card-skel" />}
        <img
          src={img.image_url}
          alt={img.file_name}
          draggable={false}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`gal-card-img ${loaded ? 'gal-card-img--on' : ''}`}
        />
        <div className="gal-card-ov">
          <ZoomIn size={22} className="gal-card-zoom" />
        </div>
        <button
          className="gal-card-dl"
          onClick={e => { e.stopPropagation(); onDownload(); }}
          aria-label="Download"
        >
          <Download size={12} />
        </button>
      </div>
    </div>
  );
}