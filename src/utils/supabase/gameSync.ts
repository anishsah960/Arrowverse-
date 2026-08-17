import { supabase } from './client';

export interface CloudSaveData {
  highScore: number;
  highestLevel: number;
  stars: number;
  updatedAt: string;
}

/**
 * Saves game progress to Supabase
 */
export async function syncProgressToSupabase(userId: string, data: CloudSaveData) {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        high_score: data.highScore,
        highest_level: data.highestLevel,
        stars: data.stars,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Supabase sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync error:', err);
    return false;
  }
}

/**
 * Loads game progress from Supabase
 */
export async function fetchProgressFromSupabase(userId: string): Promise<CloudSaveData | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      highScore: data.high_score || 0,
      highestLevel: data.highest_level || 1,
      stars: data.stars || 0,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}
