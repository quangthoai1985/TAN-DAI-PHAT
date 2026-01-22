-- Migration: Add content column to products table
-- This column will store rich HTML content from the TipTap editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS content TEXT;

-- Comment for documentation
COMMENT ON COLUMN products.content IS 'Rich HTML content for detailed product information';
