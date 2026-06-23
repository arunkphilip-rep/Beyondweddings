'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { galleryService, inquiryService } from '../../../src/lib/services';
import { Gallery, GalleryImage, Inquiry } from '../../../src/types';

export default function AdminGalleriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Create form state
  const [formData, setFormData] = useState({
    gallery_name: '',
    slug: '',
    cover_image: '',
    event_date: '',
    venue: '',
  });

  // Add image state
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('bw_admin_auth') !== 'true') {
      router.push('/admin');
      return;
    }
    loadData();
  }, [router]);

  const loadData = useCallback(async () => {
    try {
      const [gals, inqs] = await Promise.all([
        galleryService.getAllGalleries(),
        inquiryService.getAllInquiries(),
      ]);
      setGalleries(gals);
      setInquiries(inqs);
    } catch (err) {
      console.error('Failed to load galleries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bw_admin_auth');
    router.push('/admin');
  };

  // ─── Gallery CRUD ───
  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGallery = await galleryService.createGallery({
        gallery_name: formData.gallery_name,
        slug: formData.slug || formData.gallery_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        cover_image: formData.cover_image || undefined,
        event_date: formData.event_date || undefined,
        venue: formData.venue || undefined,
        user_id: 'admin',
      });
      setGalleries((prev) => [newGallery, ...prev]);
      setFormData({ gallery_name: '', slug: '', cover_image: '', event_date: '', venue: '' });
      setShowCreateForm(false);
      showToast('Gallery created successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Failed to create gallery', 'error');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery and all its images?')) return;
    try {
      await galleryService.deleteGallery(id);
      setGalleries((prev) => prev.filter((g) => g.id !== id));
      if (selectedGallery?.id === id) {
        setSelectedGallery(null);
        setGalleryImages([]);
      }
      showToast('Gallery deleted', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete gallery', 'error');
    }
  };

  // ─── Select gallery → load images ───
  const handleSelectGallery = async (gallery: Gallery) => {
    setSelectedGallery(gallery);
    try {
      const images = await galleryService.getGalleryImages(gallery.id);
      setGalleryImages(images);
    } catch (err) {
      console.error(err);
      setGalleryImages([]);
    }
  };

  // ─── Image management ───
  const handleAddImage = async () => {
    if (!selectedGallery || !newImageUrl.trim()) return;
    try {
      const fileName = newImageUrl.split('/').pop() || 'image.jpg';
      const img = await galleryService.addImageToGallery(selectedGallery.id, newImageUrl, fileName);
      setGalleryImages((prev) => [...prev, img]);
      setNewImageUrl('');
      showToast('Image added', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to add image', 'error');
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      await galleryService.removeImageFromGallery(imageId);
      setGalleryImages((prev) => prev.filter((i) => i.id !== imageId));
      showToast('Image removed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to remove image', 'error');
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

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
          <h2>Galleries</h2>
          <button
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ New Gallery'}
          </button>
        </div>

        <div className="admin-content">
          {/* Create Form */}
          {showCreateForm && (
            <div className="admin-panel" style={{ marginBottom: 24 }}>
              <div className="admin-panel-header">
                <h3>Create New Gallery</h3>
              </div>
              <div className="admin-panel-body">
                <form onSubmit={handleCreateGallery}>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Gallery Name *</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Rahul & Sneha Wedding"
                        value={formData.gallery_name}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            gallery_name: e.target.value,
                            slug: generateSlug(e.target.value),
                          });
                        }}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>URL Slug</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="auto-generated"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Event Date</label>
                      <input
                        type="date"
                        className="admin-input"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Venue</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Kochi, Kerala"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Cover Image URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="/images/folder/image.jpg"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Create Gallery
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Gallery List + Image Manager side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: selectedGallery ? '1fr 1fr' : '1fr', gap: 24 }}>
            {/* Gallery List */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h3>All Galleries ({galleries.length})</h3>
              </div>
              {galleries.length === 0 ? (
                <div className="admin-empty">
                  <p>No galleries yet</p>
                  <p className="admin-empty-sub">Click &quot;+ New Gallery&quot; to create one</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Venue</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleries.map((g) => (
                      <tr
                        key={g.id}
                        style={{
                          background: selectedGallery?.id === g.id ? 'var(--admin-surface-hover)' : undefined,
                        }}
                      >
                        <td
                          style={{ fontWeight: 500, cursor: 'pointer' }}
                          onClick={() => handleSelectGallery(g)}
                        >
                          {g.gallery_name}
                          <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>
                            /{g.slug}
                          </div>
                        </td>
                        <td style={{ color: 'var(--admin-text-muted)' }}>{g.venue || '—'}</td>
                        <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                          {g.event_date || '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              className="admin-btn admin-btn-outline admin-btn-sm"
                              onClick={() => handleSelectGallery(g)}
                            >
                              Images
                            </button>
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleDeleteGallery(g.id)}
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

            {/* Image Manager Panel */}
            {selectedGallery && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h3>{selectedGallery.gallery_name} — Images ({galleryImages.length})</h3>
                  <button
                    onClick={() => { setSelectedGallery(null); setGalleryImages([]); }}
                    style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    ×
                  </button>
                </div>
                <div className="admin-panel-body">
                  {/* Add Image */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Image URL (e.g. /images/4/a.JPEG)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={handleAddImage}
                      disabled={!newImageUrl.trim()}
                    >
                      Add
                    </button>
                  </div>

                  {/* Image Grid */}
                  {galleryImages.length === 0 ? (
                    <div className="admin-empty" style={{ padding: '40px 16px' }}>
                      <p>No images in this gallery</p>
                      <p className="admin-empty-sub">Add image URLs above</p>
                    </div>
                  ) : (
                    <div className="admin-image-grid">
                      {galleryImages.map((img) => (
                        <div key={img.id} className="admin-image-item">
                          <img
                            src={img.image_url}
                            alt={img.file_name}
                            loading="lazy"
                          />
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveImage(img.id)}
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
