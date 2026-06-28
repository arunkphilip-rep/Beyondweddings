'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

  // IntersectionObserver — stagger each card
  useEffect(() => {
    if (galleries.length === 0) return;
    const items = gridRef.current?.querySelectorAll('.gal-list-card');
    if (!items) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const id = el.dataset.id as string;
            setVisibleIds((prev) => ({ ...prev, [id]: true }));
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [galleries]);

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
        background: '#080706', color: 'rgba(255,255,255,0.45)',
        fontFamily: 'var(--font-sans)', fontSize: '0.66rem',
        letterSpacing: '3px', textTransform: 'uppercase', zIndex: 9990,
      }}>
        <div style={{
          width: 32, height: 32,
          border: '1.5px solid rgba(255,255,255,0.12)',
          borderTopColor: 'rgba(255,255,255,0.7)',
          borderRadius: '50%',
          animation: 'galSpin 0.75s linear infinite',
        }} />
        <p>Loading galleries…</p>
      </div>
    );
  }

  return (
    <div className="gal-canvas select-none" style={{ minHeight: '100dvh', background: '#0A0908' }}>
      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="gal-hero" style={{
        position: 'relative', width: '100%', height: '100dvh', minHeight: 600,
        overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}>
        {/* Background image montage — uses first gallery cover */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src={galleries[0]?.cover_image || '/images/bibin-anju/a.jpg'}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
            draggable={false}
          />
        </div>

        {/* Gradients */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 260,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 1, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0) 100%)',
          zIndex: 1, pointerEvents: 'none',
        }} />

        {/* Centre content */}
        <div className="gal-hero-content" style={{
          position: 'relative', zIndex: 2, textAlign: 'center',
          padding: '0 clamp(20px, 6vw, 80px) clamp(80px, 12vh, 140px)', width: '100%',
        }}>
          <p className="gal-hero-label" style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.58rem', fontWeight: 500,
            letterSpacing: '5px', textTransform: 'uppercase',
            color: 'var(--color-accent)', marginBottom: 14,
          }}>
            Client Galleries
          </p>
          <h1 className="gal-hero-title" style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 7vw, 6rem)',
            fontWeight: 300, letterSpacing: 'clamp(0.06em, 1.5vw, 0.22em)',
            textTransform: 'uppercase', color: '#fff', lineHeight: 1.06,
            marginBottom: 'clamp(16px, 3vh, 28px)',
            textShadow: '0 4px 32px rgba(0,0,0,0.4)',
          }}>
            Wedding Stories
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.58rem, 1vw, 0.7rem)',
            fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7,
          }}>
            Select a story below to view, share, and download the full-resolution editorial photographs.
          </p>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => document.getElementById('gal-list-anchor')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            position: 'absolute', bottom: 'clamp(24px, 5vh, 40px)', left: '50%',
            transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.45)',
            fontFamily: 'var(--font-sans)', fontSize: '0.55rem', letterSpacing: '3px',
            textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          aria-label="Scroll to galleries"
        >
          <span>Browse Stories</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'galBounce 2s ease-in-out infinite' }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </section>
      {/* ══════════════════════════════════════════════════
          GALLERY LIST GRID
      ══════════════════════════════════════════════════ */}
      <div id="gal-list-anchor" />

      <section style={{
        background: '#0A0908',
        padding: 'clamp(28px, 4vw, 48px) clamp(16px, 3vw, 40px)',
      }}>
        {galleries.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase',
          }}>
            No galleries published yet.
          </div>
        ) : (
          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
              gap: 'clamp(16px, 2.5vw, 32px)',
              maxWidth: 1100,
              margin: '0 auto',
            }}
          >
            {galleries.map((gallery, idx) => (
              <Link
                key={gallery.id}
                data-id={String(gallery.id)}
                href={`/gallery/${gallery.slug}`}
                className="gal-list-card"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  opacity: visibleIds[gallery.id] ? 1 : 0,
                  transform: visibleIds[gallery.id] ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.7s cubic-bezier(0.215,0.61,0.355,1) ${idx * 80}ms, transform 0.7s cubic-bezier(0.215,0.61,0.355,1) ${idx * 80}ms`,
                  willChange: 'opacity, transform',
                }}
              >
                <div
                  className="gal-list-card-inner"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 6,
                    background: '#131110',
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                    transition: 'transform 0.5s cubic-bezier(0.215,0.61,0.355,1), box-shadow 0.5s cubic-bezier(0.215,0.61,0.355,1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateZ(0) scale(1.015)'; e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateZ(0) scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Image */}
                  <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                    <img
                      src={gallery.cover_image || '/images/bibin-anju/a.jpg'}
                      alt={gallery.gallery_name}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.75s cubic-bezier(0.215,0.61,0.355,1)',
                        willChange: 'transform', display: 'block',
                      }}
                      className="gal-list-card-img"
                      loading={idx < 3 ? 'eager' : 'lazy'}
                      draggable={false}
                    />
                  </div>

                  {/* Overlay gradient */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
                    pointerEvents: 'none', zIndex: 1,
                  }} />

                  {/* Content on image */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: 'clamp(16px, 3vw, 28px)', zIndex: 2,
                  }}>
                    <h2 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 300,
                      letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff',
                      marginBottom: 10, textShadow: '0 2px 16px rgba(0,0,0,0.5)',
                    }}>
                      {gallery.gallery_name}
                    </h2>


                    {/* Explore CTA */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginTop: 14,
                      fontFamily: 'var(--font-sans)', fontSize: '0.55rem', fontWeight: 500,
                      letterSpacing: '2.5px', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.6)',
                      transition: 'color 0.3s ease, transform 0.3s ease',
                    }}
                      className="gal-list-card-cta"
                    >
                      <span>Explore Gallery</span>
                      <ArrowRight size={10} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(32px, 5vh, 48px) clamp(16px, 3vw, 40px)',
          marginTop: 'clamp(16px, 3vw, 32px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.55rem',
            letterSpacing: '2px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.8,
          }}>
            Can&apos;t find your wedding gallery?{' '}
            <a href="mailto:beyondweddingss@gmail.com"
              style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', transition: 'color 0.25s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              Contact the studio
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
