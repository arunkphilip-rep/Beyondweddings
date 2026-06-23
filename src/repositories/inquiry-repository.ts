import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Inquiry } from '../types';

const STORAGE_KEY = 'beyond_weddings_inquiries';

export interface InquiryRepository {
  create(data: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Promise<Inquiry>;
  getAll(): Promise<Inquiry[]>;
  getById(id: string): Promise<Inquiry | null>;
  updateStatus(id: string, status: Inquiry['status']): Promise<Inquiry | null>;
  remove(id: string): Promise<boolean>;
}

function getLocalInquiries(): Inquiry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalInquiries(inquiries: Inquiry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
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
        throw new Error(`Failed to create inquiry: ${error.message}`);
      }
      return record as Inquiry;
    }

    // localStorage fallback
    const id = typeof crypto !== 'undefined'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);
    const newInquiry: Inquiry = {
      ...data,
      id,
      created_at: new Date().toISOString(),
      status: 'new',
    };
    const list = getLocalInquiries();
    list.unshift(newInquiry);
    saveLocalInquiries(list);
    return newInquiry;
  }

  async getAll(): Promise<Inquiry[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Failed to fetch inquiries: ${error.message}`);
      return (data || []) as Inquiry[];
    }
    return getLocalInquiries();
  }

  async getById(id: string): Promise<Inquiry | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(`Failed to fetch inquiry: ${error.message}`);
      return data as Inquiry | null;
    }
    return getLocalInquiries().find((i) => i.id === id) || null;
  }

  async updateStatus(id: string, status: Inquiry['status']): Promise<Inquiry | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update inquiry: ${error.message}`);
      return data as Inquiry;
    }

    const list = getLocalInquiries();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    saveLocalInquiries(list);
    return list[idx];
  }

  async remove(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw new Error(`Failed to delete inquiry: ${error.message}`);
      return true;
    }

    const list = getLocalInquiries();
    const filtered = list.filter((i) => i.id !== id);
    if (filtered.length === list.length) return false;
    saveLocalInquiries(filtered);
    return true;
  }
}
