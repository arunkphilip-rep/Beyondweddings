'use client';

import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Dismiss after 2.1 seconds as in original clone code
    const dismissTimer = setTimeout(() => {
      setDismissed(true);
    }, 2100);

    // Completely remove display from DOM after fade-out transition finishes (900ms transition)
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="site-preloader"
      className={dismissed ? 'is-dismissed' : ''}
      role="status"
      aria-live="polite"
      aria-label="Loading Website"
    >
      <div className="preloader-wrapper">
        <h1 className="preloader-logo">BEYOND WEDDINGS</h1>
        <div className="preloader-line-track">
          <div className="preloader-line-fill"></div>
        </div>
      </div>
    </div>
  );
}
