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
const SEED_VERSION = 'v5_couple_names_rename';

function getLocalGalleries(): Gallery[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(GALLERIES_KEY);
    const version = localStorage.getItem('bw_storage_version');
    
    // Default 6 portfolio projects renamed
    const defaults: Gallery[] = [
      {
        id: 'portfolio-1',
        created_at: '2026-06-01T10:00:00Z',
        gallery_name: 'Bibin & Anju',
        slug: 'bibin-anju',
        cover_image: '/images/bibin-anju/a.jpg',
        event_date: '2026-06-01',
        venue: 'Rome, Italy',
        user_id: 'admin',
      },
      {
        id: 'portfolio-2',
        created_at: '2026-05-15T10:00:00Z',
        gallery_name: 'Mathew & Haritha',
        slug: 'mathew-haritha',
        cover_image: '/images/mathew-haritha/a.jpg',
        event_date: '2026-05-15',
        venue: 'Tirana, Albania',
        user_id: 'admin',
      },
      {
        id: 'portfolio-3',
        created_at: '2026-04-20T10:00:00Z',
        gallery_name: 'Johney & Jaisy',
        slug: 'johney-jaisy',
        cover_image: '/images/johney-jaisy/a.jpg',
        event_date: '2026-04-20',
        venue: 'Yerevan, Armenia',
        user_id: 'admin',
      },
      {
        id: 'portfolio-4',
        created_at: '2026-03-10T10:00:00Z',
        gallery_name: 'Sobin & Ditty',
        slug: 'sobin-ditty',
        cover_image: '/images/sobin-ditty/a.JPEG',
        event_date: '2026-03-10',
        venue: 'Lake Como, Italy',
        user_id: 'admin',
      },
      {
        id: 'portfolio-5',
        created_at: '2026-02-18T10:00:00Z',
        gallery_name: 'Dijo & Anju',
        slug: 'dijo-anju',
        cover_image: '/images/dijo-anju/a.jpg',
        event_date: '2026-02-18',
        venue: 'Milan, Italy',
        user_id: 'admin',
      },
      {
        id: 'portfolio-6',
        created_at: '2026-01-25T10:00:00Z',
        gallery_name: 'Arun & Rosmin',
        slug: 'arun-rosmin',
        cover_image: '/images/arun-rosmin/aa.jpg',
        event_date: '2026-01-25',
        venue: 'Paris, France',
        user_id: 'admin',
      },
    ];

    if (version !== SEED_VERSION) {
      // Overwrite/Force seed the 6 galleries exactly once
      localStorage.setItem(GALLERIES_KEY, JSON.stringify(defaults));
      localStorage.setItem('bw_storage_version', SEED_VERSION);
      return defaults;
    }

    if (stored) {
      return JSON.parse(stored);
    }

    return defaults;
  } catch {
    return [];
  }
}

function saveLocalGalleries(galleries: Gallery[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GALLERIES_KEY, JSON.stringify(galleries));
}

function getLocalImages(): GalleryImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(IMAGES_KEY);
    const version = localStorage.getItem('bw_images_version');

    const defaultProjImages: Record<string, string[]> = {
      'portfolio-1': [
        '/images/bibin-anju/a.jpg', '/images/bibin-anju/aa.jpg', '/images/bibin-anju/b.jpg', '/images/bibin-anju/c.jpg', '/images/bibin-anju/d.jpg', '/images/bibin-anju/e.jpg',
        '/images/bibin-anju/f.jpg', '/images/bibin-anju/h.jpg', '/images/bibin-anju/i.jpg', '/images/bibin-anju/j.jpg', '/images/bibin-anju/k.jpg',
        '/images/bibin-anju/l.jpg', '/images/bibin-anju/m.jpg'
      ],
      'portfolio-2': [
        '/images/mathew-haritha/a.jpg', '/images/mathew-haritha/b.jpg', '/images/mathew-haritha/c.jpg', '/images/mathew-haritha/d.jpg'
      ],
      'portfolio-3': [
        '/images/johney-jaisy/a.jpg', '/images/johney-jaisy/aa.jpg', '/images/johney-jaisy/b.jpg', '/images/johney-jaisy/c.jpg', '/images/johney-jaisy/d.jpg',
        '/images/johney-jaisy/e.jpg', '/images/johney-jaisy/f.jpg', '/images/johney-jaisy/g.jpg', '/images/johney-jaisy/h.jpg'
      ],
      'portfolio-4': [
        '/images/sobin-ditty/a.JPEG', '/images/sobin-ditty/b.JPEG', '/images/sobin-ditty/c.JPEG', '/images/sobin-ditty/d.JPEG'
      ],
      'portfolio-5': [
        '/images/dijo-anju/a.jpg', '/images/dijo-anju/aa.jpg', '/images/dijo-anju/b.jpg', '/images/dijo-anju/c.jpg',
        '/images/dijo-anju/d.jpg', '/images/dijo-anju/e.jpg', '/images/dijo-anju/f.jpg', '/images/dijo-anju/g.jpg',
        '/images/dijo-anju/h.jpg', '/images/dijo-anju/i.jpg', '/images/dijo-anju/j.jpg', '/images/dijo-anju/k.jpg'
      ],
      'portfolio-6': [
        '/images/arun-rosmin/aa.jpg', '/images/arun-rosmin/b.jpg', '/images/arun-rosmin/c.jpg', '/images/arun-rosmin/d.jpg',
        '/images/arun-rosmin/e.jpg', '/images/arun-rosmin/f.jpg', '/images/arun-rosmin/g.jpg', '/images/arun-rosmin/h.jpg',
        '/images/arun-rosmin/i.jpg'
      ]
    };

    const defaultImagesList: GalleryImage[] = [];
    Object.entries(defaultProjImages).forEach(([galleryId, urls]) => {
      urls.forEach((url, i) => {
        defaultImagesList.push({
          id: `${galleryId}-img-${i}`,
          created_at: new Date().toISOString(),
          gallery_id: galleryId,
          image_url: url,
          file_name: url.split('/').pop() || 'image.jpg',
          sort_order: i + 1
        });
      });
    });

    if (version !== SEED_VERSION) {
      // Overwrite/Force seed images exactly once
      localStorage.setItem(IMAGES_KEY, JSON.stringify(defaultImagesList));
      localStorage.setItem('bw_images_version', SEED_VERSION);
      return defaultImagesList;
    }

    if (stored) {
      return JSON.parse(stored);
    }
    return defaultImagesList;
  } catch {
    return [];
  }
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
