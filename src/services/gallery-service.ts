import { GalleryRepository } from '../repositories/gallery-repository';
import { Gallery, GalleryImage } from '../types';

export class GalleryService {
  constructor(private repository: GalleryRepository) {}

  // ─── Public reads ───
  async getGallery(slug: string): Promise<Gallery | null> {
    if (!slug) return null;
    return this.repository.getGalleryBySlug(slug);
  }

  async getGalleryImages(galleryId: string): Promise<GalleryImage[]> {
    if (!galleryId) return [];
    return this.repository.getGalleryImages(galleryId);
  }

  // ─── Admin reads ───
  async getAllGalleries(): Promise<Gallery[]> {
    return this.repository.getAll();
  }

  // ─── Admin writes ───
  async createGallery(data: {
    gallery_name: string;
    slug: string;
    cover_image?: string;
    event_date?: string;
    venue?: string;
    user_id: string;
  }): Promise<Gallery> {
    if (!data.gallery_name.trim()) throw new Error('Gallery name is required.');
    if (!data.slug.trim()) throw new Error('Slug is required.');
    return this.repository.create(data);
  }

  async updateGallery(id: string, data: Partial<Omit<Gallery, 'id' | 'created_at'>>): Promise<Gallery | null> {
    return this.repository.update(id, data);
  }

  async deleteGallery(id: string): Promise<boolean> {
    return this.repository.remove(id);
  }

  // ─── Image management ───
  async addImageToGallery(galleryId: string, imageUrl: string, fileName: string): Promise<GalleryImage> {
    return this.repository.addImage(galleryId, imageUrl, fileName);
  }

  async removeImageFromGallery(imageId: string): Promise<boolean> {
    return this.repository.removeImage(imageId);
  }

  async reorderGalleryImages(galleryId: string, imageIds: string[]): Promise<void> {
    return this.repository.reorderImages(galleryId, imageIds);
  }
}
