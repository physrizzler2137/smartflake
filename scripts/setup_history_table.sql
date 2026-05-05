DROP TABLE IF EXISTS public.history_milestones;

CREATE TABLE public.history_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    image_alt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial data
INSERT INTO public.history_milestones (year, title, description, image, image_alt) VALUES
(2010, 'Lab Founded', 'The lab was established with a small team and a big vision.', 'https://picsum.photos/seed/hist1/600/400', 'An empty but hopeful laboratory space'),
(2012, 'First Major Grant', 'Received a significant grant for quantum computing research.', 'https://picsum.photos/seed/hist2/600/400', 'A person signing a formal document or grant paper'),
(2015, 'Breakthrough in Nanotechnology', 'Published a seminal paper on self-assembling nanobots.', 'https://picsum.photos/seed/hist3/600/400', 'Abstract visualization of nanotechnology'),
(2018, 'Facility Expansion', 'Opened the new Optical Microscopy and Electro-magnetic Measurements Laboratory.', 'https://picsum.photos/seed/hist4/600/400', 'A modern, newly built laboratory facility'),
(2021, 'Spin-off Company Launched', 'Launched ''QuantumLeap Inc.'' to commercialize our quantum encryption technology.', 'https://picsum.photos/seed/hist5/600/400', 'A small group in a new modern office, celebrating'),
(2024, 'AI in Research', 'Integrated a dedicated AI division to accelerate data analysis and discovery.', 'https://picsum.photos/seed/hist6/600/400', 'An abstract representation of an AI brain or network'),
(CAST(EXTRACT(YEAR FROM CURRENT_DATE) AS INTEGER), 'Present Day', 'Continuing to innovate and push the boundaries of soft robotics and intelligent materials.', NULL, NULL);

-- Disable RLS to allow public read access from the frontend (matches news_items setup)
ALTER TABLE public.history_milestones DISABLE ROW LEVEL SECURITY;

-- Explicitly grant permissions to the anonymous role (crucial for Supabase API)
GRANT SELECT ON public.history_milestones TO anon;
GRANT SELECT ON public.history_milestones TO authenticated;
GRANT SELECT ON public.history_milestones TO service_role;
