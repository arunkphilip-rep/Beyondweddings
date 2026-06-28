'use client';

import React, { useState, useEffect } from 'react';
import { galleryService } from '../../lib/services';

export interface Project {
  id: string | number;
  title: string;
  cover: string;
  images: string[];
  slug: string;
}

interface PortfolioGridProps {
  onOpenProject: (project: Project) => void;
  limit?: number;
}

export default function PortfolioGrid({ onOpenProject, limit }: PortfolioGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const galleries = await galleryService.getAllGalleries();
        const items = await Promise.all(
          galleries.map(async (g) => {
            const imgs = await galleryService.getGalleryImages(g.id);
            return {
              id: g.id,
              title: g.gallery_name,
              cover: g.cover_image || '/images/bibin-anju/a.jpg',
              images: imgs.map((img) => img.image_url),
              slug: g.slug,
            };
          })
        );
        setProjects(items);
      } catch (err) {
        console.error('Failed to load portfolio galleries:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolioData();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    
    // Animate visibility sequentially for a clean entry transition
    projects.forEach((proj, index) => {
      setTimeout(() => {
        setVisibleIds((prev) => ({ ...prev, [proj.id]: true }));
      }, index * 80);
    });
  }, [projects]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[300px]">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Display only up to limit if specified
  const activeProjects = limit ? projects.slice(0, limit) : projects;

  // Split items into 3 columns
  const col1 = activeProjects.filter((_, idx) => idx % 3 === 0);
  const col2 = activeProjects.filter((_, idx) => idx % 3 === 1);
  const col3 = activeProjects.filter((_, idx) => idx % 3 === 2);

  return (
    <div className="grid-container select-none px-4 md:px-10 pb-10">
      {/* Column 1 */}
      <div className="grid-col col-1">
        {col1.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenProject(item);
            }}
            className={`grid-item ${visibleIds[item.id] ? 'visible' : ''}`}
            style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
            role="listitem"
          >
            <div className="img-container rounded-2xl" style={{ transform: 'translateZ(0)' }}>
              <img
                src={item.cover}
                alt={`${item.title} Wedding Shoot`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.035]"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item-info mt-3 pl-1 mb-2 order-first">
              <h2 className="item-title text-sm uppercase tracking-[2px] font-medium">{item.title}</h2>
            </div>
          </a>
        ))}
      </div>

      {/* Column 2 - Staggered down */}
      <div className="grid-col col-2 mt-0 md:mt-20">
        {col2.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenProject(item);
            }}
            className={`grid-item ${visibleIds[item.id] ? 'visible' : ''}`}
            style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
            role="listitem"
          >
            <div className="img-container rounded-2xl" style={{ transform: 'translateZ(0)' }}>
              <img
                src={item.cover}
                alt={`${item.title} Wedding Shoot`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.035]"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item-info mt-3 pl-1 mb-2 order-first">
              <h2 className="item-title text-sm uppercase tracking-[2px] font-medium">{item.title}</h2>
            </div>
          </a>
        ))}
      </div>

      {/* Column 3 - Staggered further down */}
      <div className="grid-col col-3 mt-0 md:mt-40">
        {col3.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenProject(item);
            }}
            className={`grid-item ${visibleIds[item.id] ? 'visible' : ''}`}
            style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
            role="listitem"
          >
            <div className="img-container rounded-2xl" style={{ transform: 'translateZ(0)' }}>
              <img
                src={item.cover}
                alt={`${item.title} Wedding Shoot`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.035]"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item-info mt-3 pl-1 mb-2 order-first">
              <h2 className="item-title text-sm uppercase tracking-[2px] font-medium">{item.title}</h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
