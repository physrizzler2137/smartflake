DROP TABLE IF EXISTS public.research_highlights;

CREATE TABLE public.research_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.research_highlights (display_order, title, description, category, image, link) VALUES
(1, 'Programmable Shape-Shifting Structures', 'Our groundbreaking work on soft robotic structures using liquid metal electromagnetic actuators was published in Soft Robotics, demonstrating new possibilities for dynamic, reconfigurable materials.', 'Publication Highlight', 'https://picsum.photos/seed/hl1/800/400', 'https://doi.org/10.1089/soro.2023.01440'),
(2, 'Flexible Electrical Energy Storage', 'We developed a variable stiffness electrical energy storage structure, a significant advancement for soft robotics and wearable electronics, featured in Soft Robotics.', 'Publication Highlight', 'https://picsum.photos/seed/hl2/800/400', 'https://doi.org/10.1089/soro.2024.0098'),
(3, 'E-Morph: A New Adaptive Actuator', 'Our novel electrically controlled composite, E-Morph, was introduced in IEEE Robotics and Automation Letters as a new type of adaptive actuator for soft robotics applications.', 'Publication Highlight', 'https://picsum.photos/seed/hl3/800/400', 'https://doi.org/10.1109/LRA.2022.3189169'),
(4, 'Stretchable Structures with Liquid Metal', 'This ongoing project, funded by the Excellence Initiative Research University, focuses on developing innovative stretchable structures with liquid metal for next-generation soft robotics and wearables.', 'Project Highlight', 'https://picsum.photos/seed/hl4/800/400', '#projects'),
(5, 'Advanced Wearable Sensors', 'Our team has developed a new generation of flexible, skin-like sensors for monitoring physiological signals with unprecedented accuracy, featured in a recent tech showcase.', 'Technology Showcase', 'https://picsum.photos/seed/hl5/800/400', '#'),
(6, 'Laser-Induced Graphene Pathways', 'We have perfected a method for creating highly conductive graphene circuits directly on polymer substrates using a simple laser engraving process, paving the way for low-cost, flexible electronics.', 'Research Milestone', 'https://picsum.photos/seed/hl6/800/400', '#');

-- Disable RLS to allow public read access from the frontend
ALTER TABLE public.research_highlights DISABLE ROW LEVEL SECURITY;

-- Explicitly grant permissions to the anonymous role
GRANT SELECT ON public.research_highlights TO anon;
GRANT SELECT ON public.research_highlights TO authenticated;
GRANT SELECT ON public.research_highlights TO service_role;
