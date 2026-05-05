DROP TABLE IF EXISTS public.projects;

CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL,
    funding_source TEXT,
    funding_source_url TEXT,
    budget INTEGER DEFAULT 0,
    research_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.projects (title, description, start_date, end_date, status, funding_source, funding_source_url, budget, research_area) VALUES
('Development of innovative stretchable structures based on liquid metal for applications in soft robotics and wearable electronics', 'A research project focused on development of innovative stretchable structures based on liquid metal for applications in soft robotics and wearable electronics.', '2024-01-01T00:00:00.000Z', '2025-12-31T00:00:00.000Z', 'Ongoing', 'IDUB PW, Excellence Initiative Research University', 'https://badawcza.pw.edu.pl/', 1099025, 'Soft Robotics'),
('Air-morph: a pneumatically controlled composite enabling shape change', 'A research project focused on air-morph: a pneumatically controlled composite enabling shape change.', '2024-01-01T00:00:00.000Z', '2025-12-31T00:00:00.000Z', 'Ongoing', 'POB Material Technologies, Excellence Initiative Research University', 'https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe', 199575, 'Soft Robotics'),
('Highly elastic composite structure for electrical energy storage (Soft E-Pack)', 'A research project focused on highly elastic composite structure for electrical energy storage (soft e-pack).', '2023-01-01T00:00:00.000Z', '2024-12-31T00:00:00.000Z', 'Completed', 'IDUB PW, Excellence Initiative Research University', 'https://badawcza.pw.edu.pl/', 149900, 'Soft Robotics'),
('E-morph: an electrically controlled composite enabling shape change', 'A research project focused on e-morph: an electrically controlled composite enabling shape change.', '2021-01-01T00:00:00.000Z', '2022-12-31T00:00:00.000Z', 'Completed', 'POB Material Technologies, Excellence Initiative Research University', 'https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe', 149985, 'Soft Robotics'),
('The influence of a selected group of micro-features on the macroscopic fatigue properties of innovative granular functional materials', 'A research project focused on the influence of a selected group of micro-features on the macroscopic fatigue properties of innovative granular functional materials.', '2020-01-01T00:00:00.000Z', '2022-12-31T00:00:00.000Z', 'Completed', 'POB Material Technologies, Excellence Initiative Research University', 'https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe', 199450, 'Soft Robotics');

-- Disable RLS to allow public read access from the frontend
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Explicitly grant permissions to the anonymous role
GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO service_role;
