'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { inquiryService, galleryService } from '../../../src/lib/services';
import { Inquiry, Gallery } from '../../../src/types';

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('bw_admin_auth') !== 'true') {
      router.push('/admin');
      return;
    }
    loadData();
  }, [router]);

  const loadData = useCallback(async () => {
    try {
      const [inqs, gals] = await Promise.all([
        inquiryService.getAllInquiries(),
        galleryService.getAllGalleries(),
      ]);
      setInquiries(inqs);
      setGalleries(gals);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('bw_admin_auth');
    router.push('/admin');
  };

  const newInquiries = inquiries.filter((i) => i.status === 'new');
  const bookedInquiries = inquiries.filter((i) => i.status === 'booked');

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-login-wrapper">
          <p style={{ color: 'var(--admin-text-muted)', letterSpacing: 2 }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h1>Beyond Weddings</h1>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          <Link href="/admin/dashboard" className={`admin-nav-link ${pathname === '/admin/dashboard' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/inquiries" className={`admin-nav-link ${pathname === '/admin/inquiries' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Inquiries
            {newInquiries.length > 0 && (
              <span style={{ marginLeft: 'auto', background: 'var(--admin-accent)', color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>
                {newInquiries.length}
              </span>
            )}
          </Link>
          <Link href="/admin/galleries" className={`admin-nav-link ${pathname === '/admin/galleries' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            Galleries
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-link" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2>Dashboard</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="admin-content">
          {/* Stats Cards */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-label">Total Inquiries</div>
              <div className="stat-value">{inquiries.length}</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-label">New Inquiries</div>
              <div className="stat-value accent">{newInquiries.length}</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-label">Booked</div>
              <div className="stat-value success">{bookedInquiries.length}</div>
            </div>
            <div className="admin-stat-card">
              <div className="stat-label">Galleries</div>
              <div className="stat-value info">{galleries.length}</div>
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h3>Recent Inquiries</h3>
              <Link href="/admin/inquiries" className="admin-btn admin-btn-outline admin-btn-sm">
                View All
              </Link>
            </div>
            {inquiries.length === 0 ? (
              <div className="admin-empty">
                <p>No inquiries yet</p>
                <p className="admin-empty-sub">Inquiries from the contact form will appear here</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.slice(0, 5).map((inq) => (
                    <tr key={inq.id}>
                      <td style={{ fontWeight: 500 }}>
                        {inq.bride_name}
                        {inq.groom_name ? ` & ${inq.groom_name}` : ''}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>{inq.phone}</td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                        {new Date(inq.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`admin-badge ${inq.status}`}>{inq.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Galleries Overview */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h3>Galleries</h3>
              <Link href="/admin/galleries" className="admin-btn admin-btn-outline admin-btn-sm">
                Manage
              </Link>
            </div>
            {galleries.length === 0 ? (
              <div className="admin-empty">
                <p>No galleries yet</p>
                <p className="admin-empty-sub">Create client galleries to share with couples</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Gallery</th>
                    <th>Venue</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {galleries.slice(0, 5).map((g) => (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 500 }}>{g.gallery_name}</td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>{g.venue || '—'}</td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                        {g.event_date || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
