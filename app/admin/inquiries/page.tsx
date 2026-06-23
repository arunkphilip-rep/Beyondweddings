'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { inquiryService } from '../../../src/lib/services';
import { Inquiry } from '../../../src/types';

type StatusFilter = 'all' | Inquiry['status'];

export default function AdminInquiriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('bw_admin_auth') !== 'true') {
      router.push('/admin');
      return;
    }
    loadInquiries();
  }, [router]);

  const loadInquiries = useCallback(async () => {
    try {
      const data = await inquiryService.getAllInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    try {
      await inquiryService.updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await inquiryService.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setSelectedInquiry(null);
      showToast('Inquiry deleted', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete inquiry', 'error');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bw_admin_auth');
    router.push('/admin');
  };

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);
  const newCount = inquiries.filter((i) => i.status === 'new').length;

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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Dashboard
          </Link>
          <Link href="/admin/inquiries" className={`admin-nav-link ${pathname === '/admin/inquiries' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Inquiries
            {newCount > 0 && (
              <span style={{ marginLeft: 'auto', background: 'var(--admin-accent)', color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{newCount}</span>
            )}
          </Link>
          <Link href="/admin/galleries" className={`admin-nav-link ${pathname === '/admin/galleries' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            Galleries
          </Link>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-link" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2>Inquiries</h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
            {inquiries.length} total
          </span>
        </div>

        <div className="admin-content">
          {/* Filter Tabs */}
          <div className="admin-filter-tabs">
            {(['all', 'new', 'contacted', 'booked', 'lost'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                className={`admin-filter-tab ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s === 'all' ? `All (${inquiries.length})` : `${s} (${inquiries.filter((i) => i.status === s).length})`}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="admin-panel">
            {filtered.length === 0 ? (
              <div className="admin-empty">
                <p>No {filter === 'all' ? '' : filter} inquiries found</p>
                <p className="admin-empty-sub">Inquiries submitted from the contact form appear here</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inq) => (
                    <tr key={inq.id}>
                      <td
                        style={{ fontWeight: 500, cursor: 'pointer' }}
                        onClick={() => setSelectedInquiry(inq)}
                      >
                        {inq.bride_name}{inq.groom_name ? ` & ${inq.groom_name}` : ''}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>
                        <a href={`tel:${inq.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{inq.phone}</a>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                        {inq.email || '—'}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                        {new Date(inq.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <select
                          className="admin-select"
                          style={{ width: 'auto', padding: '6px 32px 6px 10px', fontSize: '0.72rem' }}
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry['status'])}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="booked">Booked</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="admin-btn admin-btn-outline admin-btn-sm"
                            onClick={() => setSelectedInquiry(inq)}
                          >
                            View
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDelete(inq.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="admin-detail-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="admin-detail-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <h3>Inquiry Details</h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <div className="admin-detail-row">
              <span className="label">Bride</span>
              <span className="value">{selectedInquiry.bride_name}</span>
            </div>
            {selectedInquiry.groom_name && (
              <div className="admin-detail-row">
                <span className="label">Groom</span>
                <span className="value">{selectedInquiry.groom_name}</span>
              </div>
            )}
            <div className="admin-detail-row">
              <span className="label">Phone</span>
              <span className="value">
                <a href={`tel:${selectedInquiry.phone}`} style={{ color: 'var(--admin-accent)', textDecoration: 'none' }}>
                  {selectedInquiry.phone}
                </a>
              </span>
            </div>
            {selectedInquiry.email && (
              <div className="admin-detail-row">
                <span className="label">Email</span>
                <span className="value">
                  <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--admin-accent)', textDecoration: 'none' }}>
                    {selectedInquiry.email}
                  </a>
                </span>
              </div>
            )}
            {selectedInquiry.wedding_date && (
              <div className="admin-detail-row">
                <span className="label">Wedding Date</span>
                <span className="value">{selectedInquiry.wedding_date}</span>
              </div>
            )}
            {selectedInquiry.venue && (
              <div className="admin-detail-row">
                <span className="label">Venue</span>
                <span className="value">{selectedInquiry.venue}</span>
              </div>
            )}
            {selectedInquiry.budget && (
              <div className="admin-detail-row">
                <span className="label">Budget</span>
                <span className="value">{selectedInquiry.budget}</span>
              </div>
            )}
            <div className="admin-detail-row">
              <span className="label">Status</span>
              <span className="value">
                <span className={`admin-badge ${selectedInquiry.status}`}>{selectedInquiry.status}</span>
              </span>
            </div>
            <div className="admin-detail-row">
              <span className="label">Submitted</span>
              <span className="value">{new Date(selectedInquiry.created_at).toLocaleString()}</span>
            </div>
            {selectedInquiry.message && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--admin-text-muted)', marginBottom: 8 }}>
                  Message
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--admin-text)', lineHeight: 1.6, background: 'var(--admin-bg)', padding: 16, borderRadius: 8 }}>
                  {selectedInquiry.message}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <select
                className="admin-select"
                style={{ flex: 1 }}
                value={selectedInquiry.status}
                onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as Inquiry['status'])}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="booked">Booked</option>
                <option value="lost">Lost</option>
              </select>
              <a
                href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                WhatsApp
              </a>
              <button
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => handleDelete(selectedInquiry.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
