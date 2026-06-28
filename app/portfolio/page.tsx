'use client';

import React, { useState } from 'react';
import PortfolioGrid from '../../src/features/portfolio/PortfolioGrid';
import StackingGallery from '../../src/features/portfolio/StackingGallery';

interface Project {
  id: string | number;
  title: string;
  cover: string;
  images: string[];
}

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="flex-grow bg-bg min-h-screen select-none" style={{ paddingTop: 'clamp(100px, 14vw, 180px)', paddingBottom: 'clamp(48px, 8vw, 96px)' }}>
      <div className="max-w-[1300px] mx-auto">
        
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'clamp(32px, 5vw, 64px)', padding: '0 clamp(16px, 5vw, 60px)' }}>
          <h1 className="font-serif tracking-[3px] uppercase text-text" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 300 }}>
            Studio Portfolio
          </h1>
          <div className="w-10 h-[1px] bg-accent mx-auto" style={{ marginTop: 16, marginBottom: 16 }} />
          <p className="text-text-muted tracking-wide max-w-md mx-auto leading-relaxed" style={{ fontSize: 'clamp(0.78rem, 1.2vw, 0.88rem)', fontWeight: 300 }}>
            Explore our curated collections of editorial wedding stories, elopements, and engagement features across the world.
          </p>
        </div>

        {/* Full Portfolio Grid */}
        <PortfolioGrid onOpenProject={(project) => setSelectedProject(project)} />

      </div>

      {/* Fullscreen Stacking Gallery Overlay */}
      <StackingGallery
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
