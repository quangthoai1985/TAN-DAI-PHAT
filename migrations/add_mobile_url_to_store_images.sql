-- =====================================================
-- MIGRATION: Add mobile_url column for responsive banners
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add mobile_url column for responsive banner images
ALTER TABLE store_images ADD COLUMN IF NOT EXISTS mobile_url TEXT;

-- Add documentation comments
COMMENT ON COLUMN store_images.url IS 'Desktop image URL (Recommended: 2520x1080, 21:9 ratio)';
COMMENT ON COLUMN store_images.mobile_url IS 'Mobile image URL (Recommended: 1200x900, 4:3 ratio)';
