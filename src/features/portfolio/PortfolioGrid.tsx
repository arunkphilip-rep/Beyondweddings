'use client';

import React, { useState, useEffect, useRef } from 'react';
import { galleryService } from '../../lib/services';

export interface Project {
  id: string | number;
  title: string;
  slug: string;
  cover: string;
  images: string[];
}

interface PortfolioGridProps {
  onOpenProject: (project: Project) => void;
  limit?: number;
}

export default function PortfolioGrid({ onOpenProject, limit }: PortfolioGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Detect mobile (≤ 639px = 2-col layout)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 639);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const galleries = await galleryService.getAllGalleries();
        const items = await Promise.all(
          galleries.map(async (g) => {
            const imgs = await galleryService.getGalleryImages(g.id);
            return {
              id: g.id,
              title: g.gallery_name,
              slug: g.slug,
              cover: g.cover_image || '/images/bibin-anju/a.jpg',
              images: imgs.map((img) => img.image_url),
            };
          })
        );
        setProjects(items);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // IntersectionObserver — stagger each card into view
  useEffect(() => {
    if (projects.length === 0) return;
    const items = gridRef.current?.querySelectorAll('.pg-item');
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
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [projects, isMobile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[300px]">
        <div className="w-5 h-5 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeProjects = limit ? projects.slice(0, limit) : projects;

  const renderItem = (item: Project, delay: number) => (
    <button
      key={item.id}
      data-id={String(item.id)}
      className={`pg-item group ${visibleIds[item.id] ? 'pg-item--visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={() => onOpenProject(item)}
      aria-label={`Open ${item.title} gallery`}
    >
      <div className="pg-img-wrap">
        <img
          src={item.cover}
          alt={`${item.title} Wedding`}
          loading="lazy"
          decoding="async"
          className="pg-img"
        />
        {/* Hover overlay */}
        <div className="pg-overlay">
          <span className="pg-overlay-text">VIEW STORY</span>
        </div>
      </div>
      <div className="pg-info">
        <span className="pg-title">{item.title}</span>
        <span className="pg-arrow">→</span>
      </div>
    </button>
  );

  // ── Mobile: 2-column layout — distribute ALL items evenly ──
  if (isMobile) {
    const col1 = activeProjects.filter((_, i) => i % 2 === 0);
    const col2 = activeProjects.filter((_, i) => i % 2 === 1);
    return (
      <div className="pg-grid" ref={gridRef}>
        <div className="pg-col pg-col--1">
          {col1.map((item, i) => renderItem(item, i * 60))}
        </div>
        <div className="pg-col pg-col--2">
          {col2.map((item, i) => renderItem(item, i * 60 + 80))}
        </div>
      </div>
    );
  }

  // ── Desktop: 3-column geometric stagger layout ──
  const col1 = activeProjects.filter((_, i) => i % 3 === 0);
  const col2 = activeProjects.filter((_, i) => i % 3 === 1);
  const col3 = activeProjects.filter((_, i) => i % 3 === 2);

  return (
    <div className="pg-grid" ref={gridRef}>
      {/* Column 1 — starts at top */}
      <div className="pg-col pg-col--1">
        {col1.map((item, i) => renderItem(item, i * 60))}
      </div>

      {/* Column 2 — offset down by ~100px via CSS */}
      <div className="pg-col pg-col--2">
        {col2.map((item, i) => renderItem(item, i * 60 + 120))}
      </div>

      {/* Column 3 — offset down by ~200px via CSS */}
      <div className="pg-col pg-col--3">
        {col3.map((item, i) => renderItem(item, i * 60 + 240))}
      </div>
    </div>
  );
}
