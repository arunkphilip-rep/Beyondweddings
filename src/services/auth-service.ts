import { supabase, isSupabaseConfigured } from '../lib/supabase';

export class AuthService {
  async authenticateGallery(slug: string, accessCode: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      // In Supabase, we would verify code against gallery metadata or a hash table
      // For MVP we match accessCode against a custom metadata field on the gallery or simple auth
      const { data, error } = await supabase
        .from('galleries')
        .select('id')
        .eq('slug', slug)
        // If there's a field for password/hash on galleries (like in the site map):
        // table: galleries -> gallery_code, password_hash
        // table: gallery_users -> password_hash
        .eq('password_hash', accessCode) // Simple check for MVP code-level match
        .maybeSingle();

      if (error) {
        console.error('Auth check error:', error.message);
        return false;
      }

      return !!data;
    } else {
      // Mock Fallback: Match gallery code to slug and password to "love" or "12345"
      const lowerSlug = slug.toLowerCase();
      const lowerCode = accessCode.toLowerCase();
      if ((lowerSlug === 'rahul-sneha' || lowerSlug === 'demo') && (lowerCode === 'love' || lowerCode === '12345')) {
        return true;
      }
      return false;
    }
  }
}
