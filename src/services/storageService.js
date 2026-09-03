import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const storageService = {
  /**
   * Upload photo/image file to Supabase Storage bucket 'cargo-media'
   * @param {File} file - Browser File object selected by user
   * @param {string} pathFolder - Target directory folder ('products', 'shops', 'avatars', 'signatures')
   * @returns {Promise<string>} Public CDN image URL
   */
  async uploadImage(file, pathFolder = 'products') {
    if (!file) throw new Error("No file selected for upload.");

    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${pathFolder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase
          .storage
          .from('cargo-media')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) throw error;

        // Get public CDN URL
        const { data: publicUrlData } = supabase
          .storage
          .from('cargo-media')
          .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
      } catch (err) {
        console.warn("Supabase Storage upload warning, generating object URL fallback:", err);
      }
    }

    // Fallback URL for offline development
    return URL.createObjectURL(file);
  }
};
