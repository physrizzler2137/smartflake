-- If the UI is returning an empty array, it is almost certainly Row Level Security blocking the anonymous frontend client.
-- Run this in your Supabase SQL Editor to allow anyone to read the news items.

ALTER TABLE public.news_items DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS on but allow public reads:
-- CREATE POLICY "Allow public read access" ON public.news_items FOR SELECT USING (true);
