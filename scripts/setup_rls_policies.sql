-- =============================================================================
-- SMaRT-Lab Supabase RLS Policy Setup
-- Run this in the Supabase SQL Editor to enable proper public read access
-- and authenticated-only write access for all CMS tables.
-- =============================================================================

-- ─── Public Tables (RLS disabled, open SELECT) ───────────────────────────────

-- news_items
ALTER TABLE public.news_items DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_items TO authenticated;
GRANT SELECT ON public.news_items TO anon;

-- research_highlights
ALTER TABLE public.research_highlights DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.research_highlights TO authenticated;
GRANT SELECT ON public.research_highlights TO anon;

-- history_milestones
ALTER TABLE public.history_milestones DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.history_milestones TO authenticated;
GRANT SELECT ON public.history_milestones TO anon;

-- ─── Protected Tables (RLS enabled, public reads, authenticated writes) ───────

-- projects
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;

-- publications
ALTER TABLE public.publications DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publications TO authenticated;
GRANT SELECT ON public.publications TO anon;

-- team_members
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT ON public.team_members TO anon;

-- group_photos
ALTER TABLE public.group_photos DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_photos TO authenticated;
GRANT SELECT ON public.group_photos TO anon;

-- =============================================================================
-- Verify all tables have data:
-- =============================================================================
SELECT 'news_items' AS table_name, COUNT(*) FROM public.news_items
UNION ALL SELECT 'research_highlights', COUNT(*) FROM public.research_highlights
UNION ALL SELECT 'history_milestones', COUNT(*) FROM public.history_milestones
UNION ALL SELECT 'projects', COUNT(*) FROM public.projects
UNION ALL SELECT 'publications', COUNT(*) FROM public.publications
UNION ALL SELECT 'team_members', COUNT(*) FROM public.team_members;
