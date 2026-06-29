'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Preloader from './Preloader';
import Navbar from './Navbar';
import Footer from './Footer';
import SmoothScroll from './SmoothScroll';
import ScrollToTop from './ScrollToTop';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {(pathname === '/' || pathname === '/gallery') && <Navbar />}
      <SmoothScroll>
        {children}
      </SmoothScroll>
      <ScrollToTop />
      <Footer />
    </>
  );
}
