'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      const lenis = (window as Window & { lenisInstance?: { scrollTo: (el: Element) => void } }).lenisInstance;

      if (lenis) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#home" onClick={(e) => handleScroll(e, 'home')}>HOME</a>
          <a href="#about" onClick={(e) => handleScroll(e, 'about')}>ABOUT</a>
          <a href="#portfolio" onClick={(e) => handleScroll(e, 'portfolio')}>PORTFOLIO</a>
          <a href="#faq" onClick={(e) => handleScroll(e, 'faq')}>FAQ</a>
          <a href="#contact" onClick={(e) => handleScroll(e, 'contact')}>CONTACT</a>
        </div>
        
        <div className="footer-middle">
          <a 
            href="#contact" 
            onClick={(e) => handleScroll(e, 'contact')} 
            className="read-more-btn"
          >
            LET&apos;S TALK
          </a>
        </div>
        
        <div className="footer-bottom">
          <span className="copyright">© {new Date().getFullYear()} BEYOND WEDDINGS. ALL RIGHTS RESERVED.</span>
          <span className="credit">
            MADE BY{' '}
            <a 
              href="https://www.instagram.com/beyond_weddingss/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              BEYOND WEDDINGS STUDIO
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
