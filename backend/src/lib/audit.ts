import { supabase } from './supabase';

export async function logActivity(
  userId: string | null,
  action: string,
  metadata: Record<string, unknown> = {}
) {
  try {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action,
      metadata_json: metadata,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
