-- ============================================================
-- FAITH CENTRE — NEHEMIAH DAVID
-- Database Schema for Supabase PostgreSQL
-- Secure Anonymous Testimonials with Self-Delete (No Authentication Required)
-- ============================================================

-- 1. Create the testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    testimony TEXT NOT NULL,
    promise TEXT,
    message_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    delete_token_hash TEXT NOT NULL
);

-- Documentation comments
COMMENT ON TABLE public.testimonials IS 'Faith Centre visitor and member testimonies with secure anonymous self-delete';
COMMENT ON COLUMN public.testimonials.id IS 'Unique identifier for each testimony';
COMMENT ON COLUMN public.testimonials.name IS 'Name of the person sharing the testimony';
COMMENT ON COLUMN public.testimonials.testimony IS 'The testimony text';
COMMENT ON COLUMN public.testimonials.promise IS 'Optional scripture or promise related to the testimony';
COMMENT ON COLUMN public.testimonials.message_details IS 'Optional link or details of the sermon/message that strengthened them';
COMMENT ON COLUMN public.testimonials.created_at IS 'Timestamp of when the testimony was submitted';
COMMENT ON COLUMN public.testimonials.delete_token_hash IS 'SHA-256 hash of client-side secret deletion token. Never exposed in public queries.';

-- 2. Create index on created_at for fast descending sorting
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at 
    ON public.testimonials (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public insert access" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public delete access" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public insert with token hash" ON public.testimonials;

-- Policy 1: Allow anyone to view testimonies (SELECT)
CREATE POLICY "Allow public read access"
    ON public.testimonials
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy 2: Allow anyone to submit a testimony with a valid token hash (INSERT)
CREATE POLICY "Allow public insert with token hash"
    ON public.testimonials
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(name) >= 2 AND 
        char_length(name) <= 100 AND 
        char_length(testimony) >= 10 AND 
        char_length(testimony) <= 2500 AND
        delete_token_hash IS NOT NULL AND
        char_length(delete_token_hash) = 64
    );

-- Note: Arbitrary direct DELETE is intentionally blocked by Row Level Security.
-- Direct "DELETE FROM testimonials WHERE id = ..." without matching token is blocked.

-- 5. Revoke column SELECT privileges on delete_token_hash from public/anon roles
-- Ensures delete_token_hash can NEVER be read through public SELECT queries
REVOKE ALL ON TABLE public.testimonials FROM anon, authenticated;
GRANT SELECT (id, name, testimony, promise, message_details, created_at) 
    ON TABLE public.testimonials TO anon, authenticated;
GRANT INSERT (id, name, testimony, promise, message_details, created_at, delete_token_hash) 
    ON TABLE public.testimonials TO anon, authenticated;

-- 6. Secure RPC Function for anonymous self-delete
CREATE OR REPLACE FUNCTION public.delete_testimonial_with_token(
    p_id UUID,
    p_token_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_row_count INTEGER;
BEGIN
    -- Validate input parameters
    IF p_id IS NULL OR p_token_hash IS NULL OR char_length(p_token_hash) <> 64 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid testimony ID or deletion token format.');
    END IF;

    -- Delete ONLY if both ID and delete_token_hash match exactly
    DELETE FROM public.testimonials
    WHERE id = p_id AND delete_token_hash = p_token_hash;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;

    IF v_row_count > 0 THEN
        RETURN jsonb_build_object('success', true, 'message', 'Testimony deleted successfully.');
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Testimony not found or unauthorized deletion token.');
    END IF;
END;
$$;

-- Grant execution of the RPC to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.delete_testimonial_with_token(UUID, TEXT) TO anon, authenticated;
