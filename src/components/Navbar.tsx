 'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';


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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Check if we are on the homepage
    const isHome = window.location.pathname === '/';
    if (isHome) {
      const target = document.getElementById(sectionId);
      if (target) {
        // If Lenis is installed on window, we can use it, or fallback to scrollIntoView
        const lenis = (window as Window & { lenisInstance?: { scrollTo: (el: Element) => void } }).lenisInstance;

        if (lenis) {
          lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Navigate to homepage with anchor
      window.location.href = `/#${sectionId}`;
    }
  };

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
            <div className="header-lang">
              <span className="lang-link active cursor-default">EN</span>
            </div>

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
      <div className={`nav-overlay ${isOpen ? 'open' : ''}`} id="navOverlay">
        <div className="overlay-top-row">
          <div className="overlay-left-col">
            <button 
              className="menu-toggle nav-link-overlay" 
              id="menuCloseToggle" 
              onClick={toggleMenu}
              aria-label="Close Menu"
            >
              CLOSE
            </button>
          </div>
          <div className="overlay-center-col"></div>
          <div className="overlay-right-col">
            <a 
              href="https://www.instagram.com/beyond_weddingss/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link-overlay"
            >
              @beyondweddings
            </a>
          </div>
        </div>
        
        <div className="overlay-main-section">
          <div className="overlay-left-col overlay-contact-details">
            <a href="tel:+919876543210">+91 98765 43210</a>
            <a href="tel:+919876543211">+91 98765 43211</a>
            <a href="mailto:info@beyondweddings.com">info@beyondweddings.com</a>
            <Link href="/gallery" className="mt-4 px-4 py-2 border border-white/20 text-white text-[10px] tracking-[2px] uppercase hover:bg-white hover:text-black transition-colors" onClick={() => setIsOpen(false)}>
              Client Portal
            </Link>
          </div>
          
          <div className="overlay-center-col overlay-menu-links">
            <a href="#home" className="menu-item" onClick={(e) => handleLinkClick(e, 'home')}>HOME</a>
            <a href="#about" className="menu-item" onClick={(e) => handleLinkClick(e, 'about')}>ABOUT</a>
            <Link href="/portfolio" className="menu-item" onClick={() => setIsOpen(false)}>PORTFOLIO</Link>
            <a href="#faq" className="menu-item" onClick={(e) => handleLinkClick(e, 'faq')}>FAQ</a>
            <a href="#contact" className="menu-item" onClick={(e) => handleLinkClick(e, 'contact')}>CONTACT</a>
          </div>
          
          <div className="overlay-right-col"></div>
        </div>
      </div>
    </>
  );
}
