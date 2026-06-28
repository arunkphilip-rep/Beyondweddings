'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface Project {
  id: string | number;
  title: string;
  cover: string;
  images: string[];
}

interface StackingGalleryProps {
  project: Project | null;
  onClose: () => void;
}

export default function StackingGallery({ project, onClose }: StackingGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [renderedImages, setRenderedImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Smooth lerp scroll state
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const indexRef = useRef(0);
  // Unlock logic: lock fires on first wheel event, unlocks only after
  // animation is done (ANIM_MS) AND wheel has been idle for IDLE_MS.
  const lockedRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const ANIM_MS = 400;
  const IDLE_MS = 220;

  const getCardWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector('.stack-card') as HTMLElement | null;
    if (!card) return 0;
    const style = getComputedStyle(card);
    const marginRight = parseFloat(style.marginRight) || 0;
    return card.offsetWidth + marginRight;
  }, []);

  const getTargetXForIndex = useCallback((idx: number) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return 0;
    const cards = Array.from(track.querySelectorAll('.stack-card')) as HTMLElement[];
    if (cards.length === 0 || idx >= cards.length) return 0;

    // Center the target card in the viewport
    const card = cards[idx];
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const viewportCenter = viewport.offsetWidth / 2;
    return Math.max(0, cardCenter - viewportCenter);
  }, []);

  const snapToIndex = useCallback((idx: number, totalImages: number) => {
    const clamped = Math.max(0, Math.min(totalImages - 1, idx));
    indexRef.current = clamped;
    setCurrentIndex(clamped);
    targetXRef.current = getTargetXForIndex(clamped);

    // Lock immediately
    lockedRef.current = true;

    // After animation completes, poll until wheel has been idle for IDLE_MS.
    const tryUnlock = () => {
      const idleFor = performance.now() - lastWheelTimeRef.current;
      if (idleFor >= IDLE_MS) {
        lockedRef.current = false;
      } else {
        // Not idle yet — check again after remaining idle gap
        setTimeout(tryUnlock, IDLE_MS - idleFor + 8);
      }
    };
    setTimeout(tryUnlock, ANIM_MS);
  }, [getTargetXForIndex, ANIM_MS, IDLE_MS]);

  // Click handler: if clicking centered card, open lightbox; else, snap-to
  const handleCardClick = (idx: number) => {
    if (idx === currentIndex) {
      setLightboxIndex(idx);
    } else {
      snapToIndex(idx, renderedImages.length);
    }
  };

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
      window.open(imgUrl, '_blank');
    }
  };

  // Keyboard navigation & Close support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const totalImages = renderedImages.length;

      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : totalImages - 1));
        } else if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev !== null && prev < totalImages - 1 ? prev + 1 : 0));
        } else if (e.key === 'Escape') {
          setLightboxIndex(null);
        }
      } else {
        if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && !lockedRef.current) {
          snapToIndex(indexRef.current + 1, totalImages);
        } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && !lockedRef.current) {
          snapToIndex(indexRef.current - 1, totalImages);
        } else if (e.key === 'Escape') {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lightboxIndex, renderedImages, snapToIndex]);

  // Touch swiping inside lightbox
  let lightboxTouchStartX = 0;
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartX = e.touches[0].clientX;
  };
  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxIndex === null) return;
    const diff = lightboxTouchStartX - e.changedTouches[0].clientX;
    if (diff > 50) {
      // Swipe left -> Next image
      setLightboxIndex((prev) => (prev !== null && prev < renderedImages.length - 1 ? prev + 1 : 0));
    } else if (diff < -50) {
      // Swipe right -> Prev image
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : renderedImages.length - 1));
    }
  };

  // RAF animation loop — runs only when gallery is open
  useEffect(() => {
    if (!isOpen) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(50, now - lastTime) / 16.666;
      lastTime = now;

      // Adaptive lerp factor tuned for high refresh rates (60/90/120/144 Hz)
      const lerpFactor = 1 - Math.pow(1 - 0.10, dt);
      const diff = targetXRef.current - currentXRef.current;
      currentXRef.current += diff * lerpFactor;

      // Stop tiny residual drift
      if (Math.abs(diff) < 0.05) {
        currentXRef.current = targetXRef.current;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-currentXRef.current}px) translateZ(0)`;
      }

      // Update focused card highlight
      if (viewportRef.current && trackRef.current) {
        const vw = viewportRef.current.offsetWidth;
        const center = vw / 2;
        const cards = Array.from(trackRef.current.querySelectorAll('.stack-card')) as HTMLElement[];
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(center - cardCenter);
          const isFocused = dist < rect.width * 0.55;
          if (isFocused) {
            card.classList.add('is-focused');
          } else {
            card.classList.remove('is-focused');
          }
        });
      }

      // Update timeline progress bar in DOM directly for visual fluidness and performance
      const progressFill = document.querySelector('.gallery-progress-fill') as HTMLElement | null;
      const totalImgs = renderedImages.length;
      if (progressFill && totalImgs > 0) {
        const maxScroll = getTargetXForIndex(totalImgs - 1);
        if (maxScroll > 0) {
          const pct = Math.max(0, Math.min(100, (currentXRef.current / maxScroll) * 100));
          progressFill.style.width = `${pct}%`;
        } else {
          progressFill.style.width = '0%';
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame((now) => {
      lastTime = now;
      loop(now);
    });

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isOpen, renderedImages, getTargetXForIndex]);

  // Input event listeners for snapping horizontal gallery
  useEffect(() => {
    if (!isOpen || !project) return;

    const totalImages = renderedImages.length;

    // ── Wheel: exactly one card per gesture ──
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (raw === 0) return;

      // Always update timestamp — keeps the lock alive during inertia
      lastWheelTimeRef.current = performance.now();

      if (lockedRef.current) return; // animation in progress or inertia still arriving

      const dir = raw > 0 ? 1 : -1;
      snapToIndex(indexRef.current + dir, totalImages);
    };

    // ── Touch / Swipe: one swipe = one card ──
    let touchStartX = 0;
    let touchStartY = 0;
    let touchHandled = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchHandled = false;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchHandled || lockedRef.current) return;
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const diffY = touchStartY - e.changedTouches[0].clientY;

      // Primarily horizontal swipe ≥ 40px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        const dir = diffX > 0 ? 1 : -1;
        snapToIndex(indexRef.current + dir, totalImages);
        touchHandled = true;
      }
    };

    const container = viewportRef.current!;
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, project, renderedImages, snapToIndex]);

  // Open / close side effects
  useEffect(() => {
    const lenis = (window as any).lenisInstance;
    if (project) {
      setRenderedImages(project.images);
      setIsOpen(true);
      indexRef.current = 0;
      currentXRef.current = 0;
      targetXRef.current = 0;
      lastWheelTimeRef.current = 0;
      setCurrentIndex(0);
      lockedRef.current = false;
      setLightboxIndex(null);
      document.body.classList.add('project-view-open');
      if (lenis) lenis.stop();
    } else {
      setIsOpen(false);
      document.body.classList.remove('project-view-open');
      if (lenis) lenis.start();
    }
    return () => { if (lenis) lenis.start(); };
  }, [project]);

  // After images render, snap to card 0 to align correctly
  useEffect(() => {
    if (!isOpen || renderedImages.length === 0) return;
    // Use rAF to ensure DOM has painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const x = getTargetXForIndex(0);
        currentXRef.current = x;
        targetXRef.current = x;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${-x}px) translateZ(0)`;
        }
      });
    });
  }, [isOpen, renderedImages, getTargetXForIndex]);

  const handleClose = () => {
    setIsOpen(false);
    document.body.classList.remove('project-view-open');
    const lenis = (window as any).lenisInstance;
    if (lenis) lenis.start();
    setTimeout(() => { onClose(); }, 500);
  };

  if (!project) return null;

  const total = renderedImages.length;

  return (
    <div
      id="project-overlay"
      className={`project-overlay ${isOpen ? 'visible' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Close button */}
      <button
        className="project-close-btn"
        onClick={handleClose}
        aria-label="Close Gallery"
      >
        <X size={16} />
      </button>

      {/* Title */}
      <div className="project-overlay-header">
        <h2 className="project-overlay-title">{project.title}</h2>
        <div className="project-overlay-subtitle">Editorial Story</div>
      </div>

      {/* Floating navigation controls for desktop/PC */}
      {currentIndex > 0 && (
        <button
          className="gallery-nav-arrow nav-prev"
          onClick={() => { lockedRef.current = false; snapToIndex(currentIndex - 1, total); }}
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {currentIndex < total - 1 && (
        <button
          className="gallery-nav-arrow nav-next"
          onClick={() => { lockedRef.current = false; snapToIndex(currentIndex + 1, total); }}
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Gallery viewport — fills the full overlay */}
      <div
        id="galleryStickyViewport"
        ref={viewportRef}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'transparent' }}
      >
        <div id="galleryHorizontalTrack" ref={trackRef}>
          {renderedImages.map((imgSrc, index) => (
            <div 
              key={`${imgSrc}-${index}`} 
              className="stack-card"
              data-index={String(index + 1).padStart(2, '0')}
              onClick={() => handleCardClick(index)}
            >
              <img
                src={imgSrc}
                alt={`${project.title} — Image ${index + 1}`}
                loading={index <= 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline scrollbar progress indicators */}
      <div className="gallery-timeline-container">
        <div className="gallery-progress-track">
          <div className="gallery-progress-fill" />
        </div>
        <div className="gallery-progress-info">
          <span>Frame</span>
          <span>
            <span className="gallery-current-num">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span> / </span>
            <span>{String(total).padStart(2, '0')}</span>
          </span>
        </div>
      </div>

      {/* Immersive Client-View fullscreen Lightbox overlay */}
      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox active"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 bg-white/10 rounded-full backdrop-blur-md transition-all hover:bg-white hover:text-black"
            aria-label="Close Lightbox"
          >
            <X size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(renderedImages[lightboxIndex], `${project.title}-${lightboxIndex + 1}.jpg`);
            }}
            className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase bg-white/10 px-4 py-2 rounded-full backdrop-blur-md transition-all hover:bg-white hover:text-black"
            aria-label="Download Image"
          >
            <Download size={12} />
            <span>Download</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : renderedImages.length - 1));
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-colors"
            aria-label="Previous Image"
          >
            <ChevronLeft size={36} className="font-light" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev !== null && prev < renderedImages.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-colors"
            aria-label="Next Image"
          >
            <ChevronRight size={36} className="font-light" />
          </button>

          <div 
            className="max-w-[85vw] max-h-[75vh] relative flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={renderedImages[lightboxIndex]}
              alt={`${project.title} Lightbox Frame`}
              className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl animate-fade-in"
            />
          </div>

          <div className="absolute bottom-8 text-white/50 text-[10px] tracking-[2px] uppercase">
            {lightboxIndex + 1} / {renderedImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
