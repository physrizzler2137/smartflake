DROP TABLE IF EXISTS public.publications;

CREATE TABLE public.publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    authors TEXT[] NOT NULL,
    journal TEXT NOT NULL,
    abstract TEXT,
    doi TEXT,
    impact_factor NUMERIC,
    external_link TEXT,
    journal_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.publications (year, title, authors, journal, impact_factor, external_link, journal_link, abstract, doi) VALUES
(2025, 'Granular Jamming for Soft Robotics: Experiments and Modelling of Cyclic Loading', ARRAY['P. Bartkowski', 'M. Ciemiorek', 'H. Bukowiecki', 'P. Bomba', 'R. Zalewski'], 'Archives of Civil and Mechanical Engineering', 4.4, 'https://doi.org/10.1007/s43452-025-01176-9', NULL, 'This paper, published in Archives of Civil and Mechanical Engineering, explores the topic of "Granular Jamming for Soft Robotics: Experiments and Modelling of Cyclic Loading".', '10.1007/s43452-025-01176-9'),
(2024, 'Flexible Electrical Energy Storage Structure with Variable Stiffness for Soft Robotics and Wearable electronics', ARRAY['P. Bartkowski', 'L. Pawliszak', 'A. Lusawa', 'S. Sypniewska', 'M. Ciemiorek', 'Y.-L. Park'], 'Soft Robotics', 6.4, 'https://doi.org/10.1089/soro.2024.0098', 'https://www.liebertpub.com/loi/soro', 'This paper, published in Soft Robotics, explores the topic of "Flexible Electrical Energy Storage Structure with Variable Stiffness for Soft Robotics and Wearable electronics".', '10.1089/soro.2024.0098'),
(2024, 'Multiphysics Simulation and Concept of an Electromagnetically Controlled Volumetric Pixel as a Step Towards a New Type of Actuator', ARRAY['P. Bartkowski', 'L. Pawliszak', 'Siddhi G Chevale', 'J. Ruiz Lu', 'J. David Brigido'], 'Acta Mechanica et Automatica', 1, 'https://doi.org/10.2478/ama-2024-0071', 'https://sciendo.com/journal/AMA', 'This paper, published in Acta Mechanica et Automatica, explores the topic of "Multiphysics Simulation and Concept of an Electromagnetically Controlled Volumetric Pixel as a Step Towards a New Type of Actuator".', '10.2478/ama-2024-0071'),
(2024, 'Programmable Shape-Shifting Soft Robotic Structure Using Liquid Metal Electromagnetic Actuators', ARRAY['P. Bartkowski', 'Ł. Pawliszak', 'Siddhi G Chevale', 'P. Pełka', 'Y.-L. Park'], 'Soft Robotics', 6.4, 'https://doi.org/10.1089/soro.2023.01440', 'https://www.liebertpub.com/loi/soro', 'This paper, published in Soft Robotics, explores the topic of "Programmable Shape-Shifting Soft Robotic Structure Using Liquid Metal Electromagnetic Actuators".', '10.1089/soro.2023.01440'),
(2022, 'E-Morph as a New Adaptive Actuator for Soft Robotics', ARRAY['P. Bartkowski', 'F. Gawiński', 'Ł. Pawliszak'], 'IEEE Robotics and Automation Letters', 4.6, 'https://doi.org/10.1109/LRA.2022.3189169', NULL, 'This paper, published in IEEE Robotics and Automation Letters, explores the topic of "E-Morph as a New Adaptive Actuator for Soft Robotics".', '10.1109/LRA.2022.3189169'),
(2022, 'Flexural Models for Vacuum-Packed Particles as a Variable-Stiffness Mechanism in Smart Structures', ARRAY['Brigido J.David', 'Burrow G.Steve', 'Woods Benjamin K.S', 'Bartkowski Piotr', 'Zalewski Robert'], 'Physical Review Applied', 3.8, 'https://doi.org/10.1103/PhysRevApplied.17.044018', NULL, 'This paper, published in Physical Review Applied, explores the topic of "Flexural Models for Vacuum-Packed Particles as a Variable-Stiffness Mechanism in Smart Structures".', '10.1103/PhysRevApplied.17.044018'),
(2022, 'Adaptive crash energy absorber based on a granular jamming mechanism', ARRAY['Bartkowski Piotr', 'Bukowiecki Hubert', 'Gawiński Franciszek', 'Zalewski Robert'], 'Bulletin of the Polish Academy of Sciences, Technical Sciences', NULL, 'https://doi.org/10.24425/bpasts.2021.139002', NULL, 'This paper, published in Bulletin of the Polish Academy of Sciences, Technical Sciences, explores the topic of "Adaptive crash energy absorber based on a granular jamming mechanism".', '10.24425/bpasts.2021.139002'),
(2022, 'A Smart Wing Based on Vacuum-Packed Particles', ARRAY['Gonzalez J.D.', 'Burrow S.G.', 'Woods B.K.S.', 'Bartkowski Piotr'], 'Smart Materials, Adaptive Structures and Intelligent Systems', NULL, 'https://doi.org/10.1115/SMASIS2021-67452', NULL, 'This paper, published in Smart Materials, Adaptive Structures and Intelligent Systems, explores the topic of "A Smart Wing Based on Vacuum-Packed Particles".', '10.1115/SMASIS2021-67452');

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.publications FOR SELECT USING (true);
