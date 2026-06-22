import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Inquiry } from '../types';

export interface InquiryRepository {
  create(data: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Promise<Inquiry>;
}

export class SupabaseInquiryRepository implements InquiryRepository {
  async create(data: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Promise<Inquiry> {
    if (isSupabaseConfigured() && supabase) {
      const { data: record, error } = await supabase
        .from('inquiries')
        .insert([{ ...data, status: 'new' }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create inquiry in Supabase: ${error.message}`);
      }

      return record as Inquiry;
    } else {
      // Fallback local storage mock database
      const id = typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
      const created_at = new Date().toISOString();
      const newInquiry: Inquiry = {
        ...data,
        id,
        created_at,
        status: 'new',
      };

      if (typeof window !== 'undefined') {
        const inquiriesRaw = localStorage.getItem('beyond_weddings_inquiries') || '[]';
        const inquiries = JSON.parse(inquiriesRaw);
        inquiries.push(newInquiry);
        localStorage.setItem('beyond_weddings_inquiries', JSON.stringify(inquiries));
      }

      console.log('Saved inquiry mock (Local Storage Fallback):', newInquiry);
      return newInquiry;
    }
  }
}
