import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Gallery, GalleryImage } from '../types';

export interface GalleryRepository {
  getGalleryBySlug(slug: string): Promise<Gallery | null>;
  getGalleryImages(galleryId: string): Promise<GalleryImage[]>;
}

export class SupabaseGalleryRepository implements GalleryRepository {
  async getGalleryBySlug(slug: string): Promise<Gallery | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to fetch gallery: ${error.message}`);
      }

      return data as Gallery | null;
    } else {
      // Mock Fallback
      if (slug.toLowerCase() === 'rahul-sneha' || slug.toLowerCase() === 'demo') {
        return {
          id: 'mock-gallery-id-123',
          created_at: new Date().toISOString(),
          gallery_name: 'Rahul & Sneha Wedding Story',
          slug: slug,
          cover_image: '/images/4/a.JPEG',
          event_date: '2026-05-18',
          venue: 'Palakkad, Kerala',
          user_id: 'mock-user-id-999',
        };
      }
      return null;
    }
  }

  async getGalleryImages(galleryId: string): Promise<GalleryImage[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch gallery images: ${error.message}`);
      }

      return data as GalleryImage[];
    } else {
      // Mock Fallback: Return a beautiful selection of copied images
      const imageUrls = [
        '/images/4/a.JPEG',
        '/images/4/b.JPEG',
        '/images/4/c.JPEG',
        '/images/4/d.JPEG',
        '/images/1/b.jpg',
        '/images/1/c.jpg',
        '/images/1/d.jpg',
        '/images/1/e.jpg',
        '/images/2/b.jpg',
        '/images/2/c.jpg',
        '/images/3/b.jpg',
        '/images/3/c.jpg'
      ];

      return imageUrls.map((url, index) => ({
        id: `mock-img-${index}`,
        created_at: new Date().toISOString(),
        gallery_id: galleryId,
        image_url: url,
        file_name: url.split('/').pop() || 'image.jpg',
        sort_order: index + 1,
      }));
    }
  }
}
