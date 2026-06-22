import { SupabaseInquiryRepository } from '../repositories/inquiry-repository';
import { SupabaseGalleryRepository } from '../repositories/gallery-repository';
import { InquiryService } from '../services/inquiry-service';
import { GalleryService } from '../services/gallery-service';
import { AuthService } from '../services/auth-service';

const inquiryRepository = new SupabaseInquiryRepository();
const galleryRepository = new SupabaseGalleryRepository();

export const inquiryService = new InquiryService(inquiryRepository);
export const galleryService = new GalleryService(galleryRepository);
export const authService = new AuthService();
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const BRAND_NAME = 'BEYOND WEDDINGS';
export const BRAND_TAGLINE = 'Fine Art & Editorial Wedding Photography';
