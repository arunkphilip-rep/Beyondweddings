'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PortfolioGrid from '../src/features/portfolio/PortfolioGrid';
import StackingGallery from '../src/features/portfolio/StackingGallery';
import ContactForm from '../src/features/inquiries/ContactForm';

interface Project {
  id: string | number;
  title: string;
  cover: string;
  images: string[];
  slug: string;
}

export default function Home() {
  const router = useRouter();
  const [isRevealed, setIsRevealed] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Testimonials state
  const [testimonialIndex, setTestimonialIndex] = useState(0);


  // Stats numbers state
  const [stats, setStats] = useState({ weddings: 0, professional: 0, years: 0, devotion: 0 });
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const statsAnimated = useRef(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hero slideshow images for PC/Desktop (landscape aspect ratio)
  const desktopHeroImages = [
    '/images/bibin-anju/aa.jpg',
    '/images/mathew-haritha/a.jpg',
    '/images/johney-jaisy/aa.jpg',
    '/images/sobin-ditty/a.JPEG'
  ];

  // Hero slideshow images for Phone/Mobile (portrait aspect ratio)
  const mobileHeroImages = [
    '/images/bibin-anju/aa.jpg', // Replace these placeholder elements with your vertical mobile crop images
    '/images/mathew-haritha/a.jpg',
    '/images/johney-jaisy/aa.jpg',
    '/images/sobin-ditty/a.JPEG'
  ];

  const heroImages = isMobile ? mobileHeroImages : desktopHeroImages;

  // Testimonials data
  const testimonials = [
    {
      text: `"Beyond Weddings captured our day with such artistry and emotion. Every photo feels like a piece of art. We are forever grateful."`,
      author: '— Bibin & Anju'
    },
    {
      text: `"From the first consultation to the final gallery, the experience was flawless. The photos transport us back to every moment."`,
      author: '— Mathew & Haritha'
    },
    {
      text: `"An absolutely incredible team. They made us feel so comfortable and the results are breathtaking. Truly beyond our expectations."`,
      author: '— Johney & Jaisy'
    },
    {
      text: `"The attention to detail and editorial style is unmatched. Our wedding album is a masterpiece we\'ll cherish forever."`,
      author: '— Sobin & Ditty'
    }
  ];


  useEffect(() => {
    // 1. Reveal page content wrapper on load
    const timer1 = setTimeout(() => {
      setIsRevealed(true);
    }, 2250);

    // 2. Hero Slideshow rotation loop (2.5s interval)
    const slideshowTimer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 2500);

    // 3. Testimonials auto-advance loop (5s interval)
    const testimonialsTimer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearInterval(slideshowTimer);
      clearInterval(testimonialsTimer);
    };
  }, [heroImages.length]);

  // 4. Stats Counter IntersectionObserver & Animation Frame Loop
  useEffect(() => {
    const statsSection = statsSectionRef.current;
    if (!statsSection) return;

    const animateCount = (target: number, key: 'weddings' | 'professional' | 'years' | 'devotion') => {
      const duration = 2000;
      const startTime = performance.now();

      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Quartic ease-out logic for smooth number increments
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        setStats((prev) => ({
          ...prev,
          [key]: current
        }));

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setStats((prev) => ({
            ...prev,
            [key]: target
          }));
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated.current) {
            statsAnimated.current = true;
            animateCount(120, 'weddings');
            animateCount(100, 'professional');
            animateCount(5, 'years');
            animateCount(100, 'devotion');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const lenis = (window as Window & { lenisInstance?: { scrollTo: (el: Element) => void } }).lenisInstance;

      if (lenis) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <div id="app-wrapper" className={isRevealed ? 'is-revealed opacity-100 translate-y-0' : 'is-hidden'}>
        <main id="scroll-container">

          {/* ======== HERO / HOME SECTION ======== */}
          <section id="home" className="hero-section">
            <div className="hero-slideshow">
              {heroImages.map((src, index) => (
                <div
                  key={src}
                  className={`hero-slide ${index === heroSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url('${src}')` }}
                />
              ))}
            </div>
            <div className="hero-overlay" />
            <div className="hero-content">
              <h1 className="hero-title animate-fade-up">BEYOND WEDDINGS</h1>
              <p className="hero-subtitle animate-fade-up">Fine Art &amp; Editorial Wedding Photography</p>
              <p className="hero-tagline animate-fade-up">Storytelling frame by frame, across the world.</p>
              <a
                href="#portfolio"
                onClick={(e) => handleScrollToSection(e, 'portfolio')}
                className="hero-cta animate-fade-up"
              >
                VIEW PORTFOLIO
              </a>
            </div>
            <div className="hero-scroll-indicator">
              <span>SCROLL TO EXPLORE</span>
              <div className="scroll-line" />
            </div>
          </section>

          {/* ======== ABOUT SECTION ======== */}
          <section id="about" className="section about-section bg-bg">
            <div className="section-inner">
              <div className="about-grid">
                <div className="about-image-col">
                  <div className="about-image-wrapper rounded-2xl">
                    <img
                      src="/images/bibin-anju/e.jpg"
                      alt="BEYOND WEDDINGS Studio"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="about-text-col flex flex-col justify-center">
                  <h2 className="section-label">ABOUT THE STUDIO</h2>
                  <h3 className="about-heading font-serif">Capturing Love Stories Across the Globe</h3>
                  <div className="about-divider" />
                  <p className="about-text text-text-muted">
                    At BEYOND WEDDINGS, we believe every love story deserves to be told with elegance and artistry.
                    Our approach blends fine art composition with editorial storytelling, creating timeless images
                    that reflect the unique beauty of each couple&apos;s journey.
                  </p>
                  <p className="about-text text-text-muted">
                    With a background in fashion and editorial photography, we bring a refined aesthetic to wedding
                    photography — from intimate elopements in the Italian countryside to grand celebrations in historic
                    estates. Every frame is crafted with intention, light, and emotion.
                  </p>
                  <p className="about-text text-text-muted">Based in Europe, available worldwide. Let us tell your story.</p>
                  <a
                    href="#contact"
                    onClick={(e) => handleScrollToSection(e, 'contact')}
                    className="about-cta"
                  >
                    GET IN TOUCH
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ======== STATS / NUMBERS SECTION ======== */}
          <section className="section stats-section border-y border-[#E8E3DC]" ref={statsSectionRef}>
            <div className="section-inner stats-grid">
              <div className="stat-item">
                <span className="stat-number font-serif">{stats.weddings}+</span>
                <span className="stat-label">WEDDINGS</span>
              </div>
              <div className="stat-item">
                <span className="stat-number font-serif">{stats.professional}%</span>
                <span className="stat-label">PROFESSIONALISM</span>
              </div>
              <div className="stat-item">
                <span className="stat-number font-serif">{stats.years}</span>
                <span className="stat-label">YEARS</span>
              </div>
              <div className="stat-item">
                <span className="stat-number font-serif">{stats.devotion}%</span>
                <span className="stat-label">DEVOTION</span>
              </div>
            </div>
          </section>

          {/* ======== PORTFOLIO SECTION ======== */}
          <section id="portfolio" className="portfolio-section">
            <div className="section-header">
              <h2 className="section-label">PORTFOLIO</h2>
              <h3 className="section-title">Featured Weddings</h3>
              <p className="section-desc">A curated selection of our finest work. Click to view story frames.</p>
            </div>

            <PortfolioGrid onOpenProject={(project) => router.push(`/gallery/${project.slug}`)} limit={6} />


          </section>

          {/* ======== TESTIMONIALS SECTION ======== */}
          <section className="section testimonials-section border-t border-[#E8E3DC] bg-zinc-50/50">
            <div className="section-inner">
              <h2 className="section-label">TESTIMONIALS</h2>
              <h3 className="section-title">Words from Our Couples</h3>

              <div className="testimonials-slider">
                {testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className={`testimonial-card ${idx === testimonialIndex ? 'active opacity-100 translate-y-0 pointer-events-auto relative' : 'opacity-0 translate-y-5 pointer-events-none absolute'}`}
                  >
                    <p className="testimonial-text font-serif italic text-lg text-text-muted max-w-[700px] mx-auto">
                      {t.text}
                    </p>
                    <span className="testimonial-author block mt-4 text-[10px] tracking-[2px] uppercase text-text-muted">
                      {t.author}
                    </span>
                  </div>
                ))}
              </div>

              <div className="testimonial-dots flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestimonialIndex(idx)}
                    className={`testimonial-dot ${idx === testimonialIndex ? 'active' : ''}`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>


          {/* ======== CONTACT SECTION ======== */}
          <section id="contact" className="section contact-section border-t border-[#E8E3DC] bg-zinc-50/50">
            <div className="section-inner">
              <div className="contact-grid">
                <div className="contact-info-col">
                  <h2 className="section-label">CONTACT</h2>
                  <h3 className="section-title font-serif">Let&apos;s Create Something Beautiful</h3>
                  <p className="contact-text text-text-muted">
                    We&apos;d love to hear about your vision. Whether you&apos;re planning an intimate elopement or a grand
                    celebration, let&apos;s craft a photography experience that tells your unique story.
                  </p>
                  <div className="contact-details mt-6 flex flex-col gap-6">
                    <div className="contact-item">
                      <span className="contact-item-label">PHONE</span>
                      <a href="tel:+918714003230" className="text-text hover:text-accent font-light">
                        +91 87140 03230
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-item-label">EMAIL</span>
                      <a href="mailto:beyondweddingss@gmail.com" className="text-text hover:text-accent font-light">
                        beyondweddingss@gmail.com
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-item-label">FOLLOW</span>
                      <a
                        href="https://www.instagram.com/beyond_weddingss/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text hover:text-accent font-light"
                      >
                        @beyondweddings
                      </a>
                    </div>
                  </div>
                </div>

                <ContactForm />
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Dynamic Stacking Gallery Overlay */}
      <StackingGallery
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
