'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open', 'overlay-open');
    } else {
      document.body.classList.remove('menu-open', 'overlay-open');
    }
  }, [isOpen]);

  return (
    <>
      <header className="header" id="navbar">
        <div className="header-inner">
          <Link href="/" className="logo flex items-center">
            {/* Logo image – white version without background to support mix-blend-mode: difference */}
            <img
              src="/images/logo/white.png"
              alt="Beyond Weddings Logo"
              className="h-10 md:h-16 lg:h-20 w-auto"
              loading="eager"
            />
          </Link>

          {/* Push the menu toggle to the right */}
          <div className="flex items-center gap-4 md:gap-8 ml-auto">
            <button 
              className="menu-toggle" 
              id="menuToggle" 
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label="Toggle Menu"
            >
              <div className="menu-toggle-text hover-reveal-text">
                <div className="text-wrap" id="menuToggleTextWrap" style={{ transform: isOpen ? 'translateY(-50%)' : 'none' }}>
                  <span className="menu-text-line">MENU</span>
                  <span className="menu-text-line">CLOSE</span>
                </div>
              </div>
              <div className="menu-toggle-icon">
                <span className={`bar bar-1 ${isOpen ? 'translate-y-[5px] rotate-45' : ''}`}></span>
                <span className={`bar bar-2 ${isOpen ? '-translate-y-[5px] -rotate-45' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay Navigation Menu (Black Curtain) */}
      <div 
        className={`nav-overlay ${isOpen ? 'open' : ''} flex flex-col items-center justify-center`} 
        id="navOverlay"
        style={{
          background: 'rgba(6, 5, 4, 0.98)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
        }}
      >
        {/* Top Close Button (X icon only on mobile, X + Close on desktop) */}
        <div className="absolute top-6 right-6 z-[1600]">
          <button 
            className="group flex items-center gap-2 text-white/70 hover:text-accent border border-white/10 hover:border-accent/40 bg-white/5 hover:bg-white/10 px-3.5 py-2 md:px-5 md:py-2.5 rounded-full transition-all duration-300 cursor-pointer"
            onClick={toggleMenu}
            aria-label="Close Menu"
          >
            <X size={15} className="transition-transform duration-300 group-hover:rotate-90" />
            <span className="hidden sm:inline text-[9px] tracking-[2.5px] uppercase font-medium">Close</span>
          </button>
        </div>

        {/* Centered Premium Content Wrapper */}
        <div className="flex flex-col items-center justify-center max-w-lg w-full text-center px-6 py-12 gap-8 md:gap-12 animate-fade-in-menu">
          
          {/* Beyond Weddings Logo */}
          <Link href="/" className="mb-4 transition-transform duration-500 hover:scale-[1.025]" onClick={toggleMenu}>
            <img
              src="/images/logo/white.png"
              alt="Beyond Weddings Logo"
              className="h-14 md:h-20 w-auto max-w-[200px] md:max-w-[280px] object-contain drop-shadow-[0_4px_24px_rgba(255,255,255,0.06)]"
              loading="eager"
            />
          </Link>

          {/* Connect Details */}
          <div className="flex flex-col gap-6 md:gap-8 w-full">
            <div className="h-[1px] bg-white/10 w-16 mx-auto mb-2" />
            
            <a 
              href="https://www.instagram.com/beyond_weddingss/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center gap-1.5 transition-all duration-300"
            >
              <span className="text-[9px] tracking-[4px] uppercase text-zinc-500 group-hover:text-accent transition-colors">INSTAGRAM</span>
              <span className="text-sm md:text-base font-light tracking-[2px] text-white/90 group-hover:text-accent transition-colors">@beyond_weddingss</span>
            </a>

            <a 
              href="tel:+918714003230" 
              className="group flex flex-col items-center gap-1.5 transition-all duration-300"
            >
              <span className="text-[9px] tracking-[4px] uppercase text-zinc-500 group-hover:text-accent transition-colors">PHONE</span>
              <span className="text-sm md:text-base font-light tracking-[2px] text-white/90 group-hover:text-accent transition-colors">+91 87140 03230</span>
            </a>

            <a 
              href="mailto:beyondweddingss@gmail.com" 
              className="group flex flex-col items-center gap-1.5 transition-all duration-300"
            >
              <span className="text-[9px] tracking-[4px] uppercase text-zinc-500 group-hover:text-accent transition-colors">EMAIL</span>
              <span className="text-sm md:text-base font-light tracking-[2px] text-white/90 group-hover:text-accent transition-colors">beyondweddingss@gmail.com</span>
            </a>

            <div className="h-[1px] bg-white/10 w-16 mx-auto mt-2" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .animate-fade-in-menu {
          animation: menuFadeIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes menuFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
