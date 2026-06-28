'use client';

import React, { useState } from 'react';
import PortfolioGrid from '../../src/features/portfolio/PortfolioGrid';
import StackingGallery from '../../src/features/portfolio/StackingGallery';

interface Project {
  id: string | number;
  title: string;
  cover: string;
  images: string[];
  slug: string;
}

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="flex-grow bg-bg min-h-screen pt-48 pb-24 px-6 select-none">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-serif tracking-[3px] uppercase text-text">
            Studio Portfolio
          </h1>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4 mb-4" />
          <p className="text-xs text-text-muted tracking-wide max-w-md mx-auto leading-relaxed">
            Explore our curated collections of editorial wedding stories, elopements, and engagement features across the world.
          </p>
        </div>

        {/* Full Infinite Scroll Grid */}
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
