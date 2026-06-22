export interface Inquiry {
  id: string;
  created_at: string;
  bride_name: string;
  groom_name?: string;
  phone: string;
  email?: string;
  wedding_date?: string;
  venue?: string;
  budget?: string;
  message?: string;
  status: 'new' | 'contacted' | 'booked' | 'lost';
}

export interface Gallery {
  id: string;
  created_at: string;
  gallery_name: string;
  slug: string;
  cover_image?: string;
  event_date?: string;
  venue?: string;
  user_id: string;
}

export interface GalleryImage {
  id: string;
  created_at: string;
  gallery_id: string;
  image_url: string;
  file_name: string;
  sort_order?: number;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  cover_image: string;
  location: string;
  wedding_date: string;
  description: string;
  images: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  review: string;
  type: string;
}
