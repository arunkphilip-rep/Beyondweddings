'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface Project {
  id: number;
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
  
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const scrollPosRef = useRef(0);
  const targetPosRef = useRef(0);
  const maxScrollRef = useRef(0);

  useEffect(() => {
    if (project) {
      setRenderedImages(project.images);
      setIsOpen(true);
      scrollPosRef.current = 0;
      targetPosRef.current = 0;
      document.body.classList.add('project-view-open');
    } else {
      setIsOpen(false);
      document.body.classList.remove('project-view-open');
    }
  }, [project]);

  useEffect(() => {
    if (!isOpen || !project) return;

    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    let isActive = true;
    const movementSpeed = 0.45;
    
    const updateGalleryEngine = () => {
      if (!isActive) return;

      const windowWidth = viewport.offsetWidth;
      const centerPoint = windowWidth / 2;

      const allCards = Array.from(track.querySelectorAll('.stack-card')) as HTMLDivElement[];
      if (allCards.length === 0) {
        animationFrameIdRef.current = requestAnimationFrame(updateGalleryEngine);
        return;
      }

      const lastCard = allCards[allCards.length - 1];
      if (!lastCard) {
        animationFrameIdRef.current = requestAnimationFrame(updateGalleryEngine);
        return;
      }

      // Bounded scroll calculation: stops when the last card is centered in the viewport
      const lastCardCenterInTrack = lastCard.offsetLeft + lastCard.offsetWidth / 2;
      const maxScrollOffset = lastCardCenterInTrack - centerPoint;
      const maxScroll = Math.max(0, maxScrollOffset / movementSpeed);
      maxScrollRef.current = maxScroll;

      // Clamp positions
      targetPosRef.current = Math.max(0, Math.min(maxScroll, targetPosRef.current));
      scrollPosRef.current = Math.max(0, Math.min(maxScroll, scrollPosRef.current));

      // Easing calculation for smooth acceleration/deceleration (60Hz to 144Hz support)
      scrollPosRef.current += (targetPosRef.current - scrollPosRef.current) * 0.08;

      // Apply horizontal slide translation
      const trackOffset = -(scrollPosRef.current * movementSpeed);
      track.style.transform = `translateX(${trackOffset}px)`;

      allCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distanceFromCenter = Math.abs(centerPoint - cardCenter);

        const focusRange = rect.width * 0.6;
        const isFocused = distanceFromCenter < focusRange;

        if (isFocused) {
          card.classList.add('is-focused');
        } else {
          card.classList.remove('is-focused');
        }

        // Apply scale & side compression translations
        const compression = (centerPoint - cardCenter) * 0.08;
        if (isFocused) {
          card.style.transform = `scale(1.12) translateX(${compression}px)`;
        } else {
          card.style.transform = `translateX(${compression}px)`;
        }
      });

      animationFrameIdRef.current = requestAnimationFrame(updateGalleryEngine);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateGalleryEngine);

    // Event listener for wheel interactions
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetPosRef.current = Math.max(0, Math.min(maxScrollRef.current, targetPosRef.current + e.deltaY * 0.55));
    };

    // Event listeners for mobile swipe interactions
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const diff = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      targetPosRef.current = Math.max(0, Math.min(maxScrollRef.current, targetPosRef.current + diff * 1.5));
    };

    const container = viewport;
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      isActive = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, project, renderedImages]);

  const handleClose = () => {
    setIsOpen(false);
    document.body.classList.remove('project-view-open');
    setTimeout(() => {
      onClose();
    }, 500); // Wait for fade-out css transition
  };

  if (!project) return null;

  return (
    <div
      id="project-overlay"
      className={`project-overlay ${isOpen ? 'visible' : 'hidden'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <button
        className="project-close-btn flex items-center gap-1.5 uppercase text-[10px] tracking-[2px]"
        onClick={handleClose}
        aria-label="Close Stacking Gallery"
      >
        <X size={12} />
        <span>Close</span>
      </button>

      <div className="project-overlay-header">
        <h2 className="project-overlay-title">{project.title}</h2>
      </div>

      <div id="galleryScrollContainer">
        <div id="galleryStickyViewport" ref={viewportRef}>
          <div id="galleryHorizontalTrack" ref={trackRef}>
            {renderedImages.map((imgSrc, index) => (
              <div key={`${imgSrc}-${index}`} className="stack-card">
                <img
                  src={imgSrc}
                  alt={`${project.title} Wedding Gallery Image`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
