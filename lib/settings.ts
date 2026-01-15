import { supabase } from "@/lib/supabase";

export interface SiteSettings {
    header_logo?: string;
    footer_logo?: string;
    favicon?: string;
    site_title?: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('key, value');

        if (error) {
            console.error('Error fetching site settings:', error.message, error.details, error.hint);
            return {};
        }

        const settings: Record<string, string> = {};
        data.forEach((item: { key: string; value: string }) => {
            settings[item.key] = item.value;
        });

        return settings as unknown as SiteSettings;
    } catch (error) {
        console.error('Error in getSiteSettings:', error);
        return {};
    }
}

export async function updateSiteSetting(key: string, value: string) {
    try {
        // Check if setting exists
        const { data: existing } = await supabase
            .from('site_settings')
            .select('key')
            .eq('key', key)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('site_settings')
                .update({ value, created_at: new Date().toISOString() })
                .eq('key', key);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('site_settings')
                .insert({ key, value });
            if (error) throw error;
        }
        return true;
    } catch (error) {
        console.error(`Error updating setting ${key}:`, error);
        return false;
    }
}
