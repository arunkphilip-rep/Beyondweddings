import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Gallery, GalleryImage } from '../types';

const GALLERIES_KEY = 'beyond_weddings_galleries';
const IMAGES_KEY = 'beyond_weddings_gallery_images';

export interface GalleryRepository {
  getAll(): Promise<Gallery[]>;
  getGalleryBySlug(slug: string): Promise<Gallery | null>;
  getGalleryImages(galleryId: string): Promise<GalleryImage[]>;
  create(data: Omit<Gallery, 'id' | 'created_at'>): Promise<Gallery>;
  update(id: string, data: Partial<Omit<Gallery, 'id' | 'created_at'>>): Promise<Gallery | null>;
  remove(id: string): Promise<boolean>;
  addImage(galleryId: string, imageUrl: string, fileName: string): Promise<GalleryImage>;
  removeImage(imageId: string): Promise<boolean>;
  reorderImages(galleryId: string, imageIds: string[]): Promise<void>;
}

// ─── localStorage helpers ───
function getLocalGalleries(): Gallery[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(GALLERIES_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }

  // Seed with 6 portfolio projects on first access
  const seed: Gallery[] = [
    {
      id: 'portfolio-1',
      created_at: '2026-06-01T10:00:00Z',
      gallery_name: 'Mariam & Karen',
      slug: 'mariam-karen',
      cover_image: '/images/1/a.jpg',
      event_date: '2026-06-01',
      venue: 'Rome, Italy',
      user_id: 'admin',
    },
    {
      id: 'portfolio-2',
      created_at: '2026-05-15T10:00:00Z',
      gallery_name: 'Xhenisha & Erald',
      slug: 'xhenisha-erald',
      cover_image: '/images/2/a.jpg',
      event_date: '2026-05-15',
      venue: 'Tirana, Albania',
      user_id: 'admin',
    },
    {
      id: 'portfolio-3',
      created_at: '2026-04-20T10:00:00Z',
      gallery_name: 'Nazeli & Raffi',
      slug: 'nazeli-raffi',
      cover_image: '/images/3/a.jpg',
      event_date: '2026-04-20',
      venue: 'Yerevan, Armenia',
      user_id: 'admin',
    },
    {
      id: 'portfolio-4',
      created_at: '2026-03-10T10:00:00Z',
      gallery_name: 'Elena & Andrea',
      slug: 'elena-andrea',
      cover_image: '/images/4/a.JPEG',
      event_date: '2026-03-10',
      venue: 'Lake Como, Italy',
      user_id: 'admin',
    },
    {
      id: 'portfolio-5',
      created_at: '2026-02-18T10:00:00Z',
      gallery_name: 'Elena & Andrea — Editorial',
      slug: 'elena-andrea-editorial',
      cover_image: '/images/5/a.jpg',
      event_date: '2026-02-18',
      venue: 'Milan, Italy',
      user_id: 'admin',
    },
    {
      id: 'portfolio-6',
      created_at: '2026-01-25T10:00:00Z',
      gallery_name: 'Xhenisha & Erald — Fine Art',
      slug: 'xhenisha-erald-fine-art',
      cover_image: '/images/6/aa.jpg',
      event_date: '2026-01-25',
      venue: 'Paris, France',
      user_id: 'admin',
    },
  ];
  localStorage.setItem(GALLERIES_KEY, JSON.stringify(seed));
  return seed;
}

function saveLocalGalleries(galleries: Gallery[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GALLERIES_KEY, JSON.stringify(galleries));
}

function getLocalImages(): GalleryImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(IMAGES_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }

  const seed: GalleryImage[] = [];

  // Seed project 1
  const p1 = [
    '/images/1/a.jpg', '/images/1/aa.jpg', '/images/1/b.jpg', '/images/1/c.jpg', '/images/1/d.jpg', '/images/1/e.jpg',
    '/images/1/f.jpg', '/images/1/h.jpg', '/images/1/i.jpg', '/images/1/j.jpg', '/images/1/k.jpg',
    '/images/1/l.jpg', '/images/1/m.jpg'
  ];
  p1.forEach((url, i) => {
    seed.push({ id: `p1-img-${i}`, created_at: new Date().toISOString(), gallery_id: 'portfolio-1', image_url: url, file_name: url.split('/').pop() || 'image.jpg', sort_order: i + 1 });
  });

  // Seed project 2
  const p2 = [
    '/images/2/a.jpg', '/images/2/b.jpg', '/images/2/c.jpg', '/images/2/d.jpg'
  ];
  p2.forEach((url, i) => {
    seed.push({ id: `p2-img-${i}`, created_at: new Date().toISOString(), gallery_id: 'portfolio-2', image_url: url, file_name: url.split('/').pop() || 'image.jpg', sort_order: i + 1 });
  });

  // Seed project 3
  const p3 = [
    '/images/3/a.jpg', '/images/3/aa.jpg', '/images/3/b.jpg', '/images/3/c.jpg', '/images/3/d.jpg',
    '/images/3/e.jpg', '/images/3/f.jpg', '/images/3/g.jpg', '/images/3/h.jpg'
  ];
  p3.forEach((url, i) => {
    seed.push({ id: `p3-img-${i}`, created_at: new Date().toISOString(), gallery_id: 'portfolio-3', image_url: url, file_name: url.split('/').pop() || 'image.jpg', sort_order: i + 1 });
  });

  // Seed project 4
  const p4 = [
    '/images/4/a.JPEG', '/images/4/b.JPEG', '/images/4/c.JPEG', '/images/4/d.JPEG'
  ];
  p4.forEach((url, i) => {
    seed.push({ id: `p4-img-${i}`, created_at: new Date().toISOString(), gallery_id: 'portfolio-4', image_url: url, file_name: url.split('/').pop() || 'image.jpg', sort_order: i + 1 });
  });

  // Seed project 5
  const p5 = [
    '/images/5/a.jpg', '/images/5/aa.jpg', '/images/5/b.jpg', '/images/5/c.jpg',
    '/images/5/d.jpg', '/images/5/e.jpg', '/images/5/f.jpg', '/images/5/g.jpg',
    '/images/5/h.jpg', '/images/5/i.jpg', '/images/5/j.jpg', '/images/5/k.jpg'
  ];
  p5.forEach((url, i) => {
    seed.push({ id: `p5-img-${i}`, created_at: new Date().toISOString(), gallery_id: 'portfolio-5', image_url: url, file_name: url.split('/').pop() || 'image.jpg', sort_order: i + 1 });
  });

  // Seed project 6
  const p6 = [
    '/images/6/aa.jpg', '/images/6/b.jpg', '/images/6/c.jpg', '/images/6/d.jpg',
    '/images/6/e.jpg', '/images/6/f.jpg', '/images/6/g.jpg', '/images/6/h.jpg',
    '/images/6/i.jpg'
  ];
  p6.forEach((url, i) => {
    seed.push({ id: `p6-img-${i}`, created_at: new Date().toISOString(), gallery_id: 'portfolio-6', image_url: url, file_name: url.split('/').pop() || 'image.jpg', sort_order: i + 1 });
  });

  localStorage.setItem(IMAGES_KEY, JSON.stringify(seed));
  return seed;
}

function saveLocalImages(images: GalleryImage[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
}

export class SupabaseGalleryRepository implements GalleryRepository {

  // ─── READ ───
  async getAll(): Promise<Gallery[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('galleries').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(`Failed to fetch galleries: ${error.message}`);
      return (data || []) as Gallery[];
    }
    return getLocalGalleries();
  }

  async getGalleryBySlug(slug: string): Promise<Gallery | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('galleries').select('*').eq('slug', slug).maybeSingle();
      if (error) throw new Error(`Failed to fetch gallery: ${error.message}`);
      return data as Gallery | null;
    }
    return getLocalGalleries().find((g) => g.slug === slug) || null;
  }

  async getGalleryImages(galleryId: string): Promise<GalleryImage[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('gallery_images').select('*')
        .eq('gallery_id', galleryId)
        .order('sort_order', { ascending: true });
      if (error) throw new Error(`Failed to fetch gallery images: ${error.message}`);
      return data as GalleryImage[];
    }
    return getLocalImages()
      .filter((img) => img.gallery_id === galleryId)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  // ─── CREATE ───
  async create(data: Omit<Gallery, 'id' | 'created_at'>): Promise<Gallery> {
    if (isSupabaseConfigured() && supabase) {
      const { data: record, error } = await supabase
        .from('galleries').insert([data]).select().single();
      if (error) throw new Error(`Failed to create gallery: ${error.message}`);
      return record as Gallery;
    }

    const id = crypto.randomUUID();
    const gallery: Gallery = { ...data, id, created_at: new Date().toISOString() };
    const list = getLocalGalleries();
    list.unshift(gallery);
    saveLocalGalleries(list);
    return gallery;
  }

  // ─── UPDATE ───
  async update(id: string, data: Partial<Omit<Gallery, 'id' | 'created_at'>>): Promise<Gallery | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data: record, error } = await supabase
        .from('galleries').update(data).eq('id', id).select().single();
      if (error) throw new Error(`Failed to update gallery: ${error.message}`);
      return record as Gallery;
    }

    const list = getLocalGalleries();
    const idx = list.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveLocalGalleries(list);
    return list[idx];
  }

  // ─── DELETE ───
  async remove(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('galleries').delete().eq('id', id);
      if (error) throw new Error(`Failed to delete gallery: ${error.message}`);
      // Also remove gallery images
      await supabase.from('gallery_images').delete().eq('gallery_id', id);
      return true;
    }

    const list = getLocalGalleries();
    const filtered = list.filter((g) => g.id !== id);
    if (filtered.length === list.length) return false;
    saveLocalGalleries(filtered);
    // Remove associated images
    const images = getLocalImages().filter((img) => img.gallery_id !== id);
    saveLocalImages(images);
    return true;
  }

  // ─── IMAGE MANAGEMENT ───
  async addImage(galleryId: string, imageUrl: string, fileName: string): Promise<GalleryImage> {
    if (isSupabaseConfigured() && supabase) {
      const existing = await this.getGalleryImages(galleryId);
      const sortOrder = existing.length + 1;
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([{ gallery_id: galleryId, image_url: imageUrl, file_name: fileName, sort_order: sortOrder }])
        .select().single();
      if (error) throw new Error(`Failed to add image: ${error.message}`);
      return data as GalleryImage;
    }

    const images = getLocalImages();
    const galleryImages = images.filter((i) => i.gallery_id === galleryId);
    const newImg: GalleryImage = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      gallery_id: galleryId,
      image_url: imageUrl,
      file_name: fileName,
      sort_order: galleryImages.length + 1,
    };
    images.push(newImg);
    saveLocalImages(images);
    return newImg;
  }

  async removeImage(imageId: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('gallery_images').delete().eq('id', imageId);
      if (error) throw new Error(`Failed to remove image: ${error.message}`);
      return true;
    }

    const images = getLocalImages();
    const filtered = images.filter((i) => i.id !== imageId);
    if (filtered.length === images.length) return false;
    saveLocalImages(filtered);
    return true;
  }

  async reorderImages(galleryId: string, imageIds: string[]): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const updates = imageIds.map((id, idx) =>
        supabase!.from('gallery_images').update({ sort_order: idx + 1 }).eq('id', id)
      );
      await Promise.all(updates);
      return;
    }

    const allImages = getLocalImages();
    for (const img of allImages) {
      if (img.gallery_id === galleryId) {
        const newIdx = imageIds.indexOf(img.id);
        if (newIdx !== -1) img.sort_order = newIdx + 1;
      }
    }
    saveLocalImages(allImages);
  }
}
