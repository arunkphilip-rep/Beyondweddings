'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  cover: string;
  images: string[];
}

interface PortfolioGridProps {
  onOpenProject: (project: Project) => void;
  limit?: number;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'Mariam & Karen',
    cover: '/images/1/a.jpg',
    images: [
      '/images/1/a.jpg', '/images/1/b.jpg', '/images/1/c.jpg', '/images/1/d.jpg', '/images/1/e.jpg',
      '/images/1/f.jpg', '/images/1/h.jpg', '/images/1/i.jpg', '/images/1/j.jpg', '/images/1/k.jpg',
      '/images/1/l.jpg', '/images/1/m.jpg'
    ]
  },
  {
    id: 2,
    title: 'Xhenisha & Erald',
    cover: '/images/6/aa.jpg',
    images: [
      '/images/6/aa.jpg', '/images/6/b.jpg', '/images/6/c.jpg', '/images/6/d.jpg',
      '/images/6/e.jpg', '/images/6/f.jpg', '/images/6/g.jpg', '/images/6/h.jpg',
      '/images/6/i.jpg'
    ]
  },
  {
    id: 3,
    title: 'Nazeli & Raffi',
    cover: '/images/3/a.jpg',
    images: [
      '/images/3/a.jpg', '/images/3/b.jpg', '/images/3/c.jpg', '/images/3/d.jpg',
      '/images/3/e.jpg', '/images/3/f.jpg', '/images/3/g.jpg', '/images/3/h.jpg'
    ]
  },
  {
    id: 4,
    title: 'Elena & Andrea',
    cover: '/images/5/a.jpg',
    images: [
      '/images/5/a.jpg', '/images/5/aa.jpg', '/images/5/b.jpg', '/images/5/c.jpg',
      '/images/5/d.jpg', '/images/5/e.jpg', '/images/5/f.jpg', '/images/5/g.jpg',
      '/images/5/h.jpg', '/images/5/i.jpg', '/images/5/j.jpg', '/images/5/k.jpg'
    ]
  }
];

export default function PortfolioGrid({ onOpenProject, limit }: PortfolioGridProps) {
  const [displayedItems, setDisplayedItems] = useState<Array<{ project: Project; keyId: string; visible: boolean }>>([]);
  const displayedItemsRef = useRef(displayedItems);
  displayedItemsRef.current = displayedItems;

  const shuffleArray = (arr: any[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const appendBatch = (count: number) => {
    const projectCount = projectsData.length;
    const newBatch: Array<{ project: Project; keyId: string; visible: boolean }> = [];
    const repeats = Math.ceil(count / projectCount);
    const shufflePool: number[] = [];

    for (let r = 0; r < repeats; r++) {
      const indices = Array.from({ length: projectCount }, (_, i) => i);
      shufflePool.push(...shuffleArray(indices));
    }

    const currentLen = displayedItemsRef.current.length;
    for (let i = 0; i < count; i++) {
      const project = projectsData[shufflePool[i]];
      const uniqueKey = `p-${currentLen + i}-${Math.random().toString(36).substring(2, 5)}`;
      newBatch.push({ project, keyId: uniqueKey, visible: false });
    }

    // Set layout
    setDisplayedItems((prev) => [...prev, ...newBatch]);

    // Animate visibility sequentially
    newBatch.forEach((item, index) => {
      setTimeout(() => {
        setDisplayedItems((prev) =>
          prev.map((p) => (p.keyId === item.keyId ? { ...p, visible: true } : p))
        );
      }, index * 80);
    });
  };

  useEffect(() => {
    if (limit) {
      appendBatch(limit);
      return;
    }

    // Initial batch load for full layout
    appendBatch(30);

    // Scroll listener for infinite scroll loading
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // If within 1200px of page bottom, load 12 more items
      if (documentHeight - (scrollY + windowHeight) < 1200) {
        appendBatch(12);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [limit]);

  // Split items into 3 columns
  const col1 = displayedItems.filter((_, idx) => idx % 3 === 0);
  const col2 = displayedItems.filter((_, idx) => idx % 3 === 1);
  const col3 = displayedItems.filter((_, idx) => idx % 3 === 2);

  return (
    <div className="grid-container select-none px-4 md:px-10 pb-10">
      {/* Column 1 */}
      <div className="grid-col col-1">
        {col1.map((item) => (
          <a
            key={item.keyId}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenProject(item.project);
            }}
            className={`grid-item ${item.visible ? 'visible' : ''}`}
            style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
            role="listitem"
          >
            <div className="img-container rounded-2xl" style={{ transform: 'translateZ(0)' }}>
              <img
                src={item.project.cover}
                alt={`${item.project.title} Wedding Shoot`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.035]"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item-info mt-3 pl-1 mb-2 order-first">
              <h2 className="item-title text-sm uppercase tracking-[2px] font-medium">{item.project.title}</h2>
            </div>
          </a>
        ))}
      </div>

      {/* Column 2 - Staggered down */}
      <div className="grid-col col-2 mt-0 md:mt-20">
        {col2.map((item) => (
          <a
            key={item.keyId}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenProject(item.project);
            }}
            className={`grid-item ${item.visible ? 'visible' : ''}`}
            style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
            role="listitem"
          >
            <div className="img-container rounded-2xl" style={{ transform: 'translateZ(0)' }}>
              <img
                src={item.project.cover}
                alt={`${item.project.title} Wedding Shoot`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.035]"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item-info mt-3 pl-1 mb-2 order-first">
              <h2 className="item-title text-sm uppercase tracking-[2px] font-medium">{item.project.title}</h2>
            </div>
          </a>
        ))}
      </div>

      {/* Column 3 - Staggered further down */}
      <div className="grid-col col-3 mt-0 md:mt-40">
        {col3.map((item) => (
          <a
            key={item.keyId}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenProject(item.project);
            }}
            className={`grid-item ${item.visible ? 'visible' : ''}`}
            style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
            role="listitem"
          >
            <div className="img-container rounded-2xl" style={{ transform: 'translateZ(0)' }}>
              <img
                src={item.project.cover}
                alt={`${item.project.title} Wedding Shoot`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.035]"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="item-info mt-3 pl-1 mb-2 order-first">
              <h2 className="item-title text-sm uppercase tracking-[2px] font-medium">{item.project.title}</h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
