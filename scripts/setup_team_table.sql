DROP TABLE IF EXISTS public.team_members;
DROP TABLE IF EXISTS public.group_photos;

CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    image_url_hover TEXT,
    image_position TEXT DEFAULT '50% 50%',
    is_active BOOLEAN DEFAULT true,
    end_year INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.group_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    image_position TEXT DEFAULT 'center',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.team_members (first_name, last_name, role, bio, image_url, image_url_hover, image_position, is_active, display_order) VALUES
('Piotr', 'Bartkowski DSc', 'Principal Investigator', '<p style=''text-align: justify;''>Piotr Bartkowski attained his MSc in 2015 and later in 2019 his PhD in Mechanical Engineering from Warsaw University of Technology (WUT). His specialization is Soft Robotics and Wearable Electronics. At present he is Assistant Professor at WUT and Principal Investigator at the Smart Materials and Soft Robotics Laboratory SMaRT-Lab. Dr. Bartkowski is the author of patents and articles published in prestigious journals from IEEE and others.</p>', '/img/team/piotr_bartkowski.jpg', '/img/team/piotr_bartkowski_hover.jpg', '50% 15%', true, 1),
('Łukasz', 'Pawliszak MSc', 'Senior Investigator', '<p style=''text-align: justify;''>Łukasz Pawliszak attained his BSc in 2013 and later in 2014 his MSc in Applied Physics from Warsaw University of Technology (WUT). His specialization was in Solid State Physics with a sub-specialization in Nanostructures. He has also attained a BSc in Printing and Paper Making with a specialization of Printing Technology from the same university in 2010. From 2021 his affiliation is with the newly established Smart Materials and Soft Robot Laboratory SMaRT-Lab at WUT.</p>', '/img/team/lukasz_pawliszak.jpg', '/img/team/lukasz_pawliszak_hover.jpg', '50% 20%', true, 2),
('Agata', 'Lusawa MSc', 'Researcher', '<p style=''text-align: justify;''>Agata Lusawa attained her BSc degree in Electric and Hybrid Vehicle Engineering from the Warsaw University of Technology in 2024, and the MSc degree in the same field in 2025. She is currently pursuing the PhD degree in Mechanical Engineering, with research efforts focused on advanced materials and energy systems for soft robotics applications.</p>', '/img/team/agata_lusawa.jpg', '/img/team/agata_lusawa_hover.jpg', '50% 20%', true, 3),
('Sabina', 'Sypniewska BSc', 'Research Assistant', '<p style=''text-align: justify;''>Sabina Sypniewska attained her BSc degree in electric and hybrid vehicle engineering with a focus on ecological vehicles from Warsaw University of Technology in 2025. She is currently working towards her MSc degree in mechanical engineering, with research efforts aligned towards prospective PhD. studies in the same field.</p>', '/img/team/sabina_sypniewska.jpg', '/img/team/sabina_sypniewska_hover.jpg', '50% 25%', true, 4),
('Zofia', 'Nowicka BSc', 'Research Assistant', '<p style=''text-align: justify;''>Zofia Nowicka attained her BSc degree with honors from the Warsaw University of Technology (WUT) in 2026, defending a thesis focused on the optimization of the dyeing process for polyester yarn. Her research interests lie primarily in sensor technology and wearable electronics.</p>', '/img/team/zofia_nowicka.jpg', '/img/team/zofia_nowicka_hover.jpg', '50% 15%', true, 5),
('Gözen', 'Ecehan', 'Undergraduate', '<p style=''text-align: justify;''>Ecehan Gözen is currently pursuing her BSc degree in Electric and Hybrid Vehicles Engineering. During first year of her studies, she started working at SMaRT-Lab researching smart, amorphous, shape shifting structures and hard magnetic soft materials.</p>', '/img/team/gozen_ecehan.jpg', '/img/team/gozen_ecehan_hover.jpg', '50% 40%', true, 6),
('Maja', 'Banasiak', 'Undergraduate', '<p style=''text-align: justify;''>Maja Banasiak is a mechanical engineering student at WUT whose experiments in soft robotics intelligent materials and liquid metal printing consistently blur the distinction between research and unexplained laboratory folklore.</p>', '/img/team/maja_banasiak.jpg', '/img/team/maja_banasiak_hover.jpg', '50% 30%', true, 7),
('Małgorzata', 'Pieniążek', 'Undergraduate', '<p style=''text-align: justify;''>Małgorzata Pieniążek is a BSc candidate at WUT whose rare laboratory appearances occur with the subtle drama of an unexpected eclipse. She studies biomimicry soft robotic bio designs and pneumatic morphing structures.</p>', '/img/team/malgorzata_pieniazek.jpg', '/img/team/malgorzata_pieniazek_hover.jpg', '50% 20%', true, 8);

INSERT INTO public.team_members (first_name, last_name, role, is_active, end_year) VALUES
('J. Ruiz', 'Lu', 'Alumni', false, 2025),
('S. G.', 'Chevale', 'Alumni', false, 2025),
('P.', 'Pełka', 'Alumni', false, 2023),
('H.', 'Bukowiecki', 'Alumni', false, 2022),
('P.', 'Bomba', 'Alumni', false, 2022),
('F. M.', 'Gawiński', 'Alumni', false, 2022);

INSERT INTO public.group_photos (year, image_url, image_position) VALUES
(2026, '/img/groups/group_2026.jpg', 'center'),
(2024, '/img/groups/group_2024.jpg', 'center');

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.team_members FOR SELECT USING (true);

ALTER TABLE public.group_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.group_photos FOR SELECT USING (true);
