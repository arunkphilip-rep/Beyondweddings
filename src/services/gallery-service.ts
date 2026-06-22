import { GalleryRepository } from '../repositories/gallery-repository';
import { Gallery, GalleryImage } from '../types';

export class GalleryService {
  constructor(private repository: GalleryRepository) {}

  async getGallery(slug: string): Promise<Gallery | null> {
    if (!slug) return null;
    return this.repository.getGalleryBySlug(slug);
  }

  async getGalleryImages(galleryId: string): Promise<GalleryImage[]> {
    if (!galleryId) return [];
    return this.repository.getGalleryImages(galleryId);
  }
}
