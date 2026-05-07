export const navLinks = [
  { name: 'News', href: '/#news' },
  { name: 'History', href: '/#history' },
  { name: 'Facilities', href: '/#facilities' },
  { name: 'Team', href: '/#team' },
  { name: 'Highlights', href: '/#highlights' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Publications', href: '/#publications' },
  { name: 'Stats', href: '/#stats' },
  { name: 'Contact', href: '/#contact' },
];

export const facilities = [
  { 
    name: 'Micro-chemistry, mechanical and electronic measurement laboratory', 
    code: '1.11G', 
    imageId: 'facility-micro-chemistry',
    lightImage: '/img/facilities/1-11g_micro-chemistry_light.webp',
    darkImage: '/img/facilities/1-11g_micro-chemistry_dark.webp',
    lightImageFallback: '/img/facilities/1-11g_micro-chemistry_light.jpeg',
    darkImageFallback: '/img/facilities/1-11g_micro-chemistry_dark.jpeg',
    description: 'In this room we can conduct micro-chemistry measurements such as battery cell cycling but also EIS (Electric Independence spectroscopy). The second major measurement device in our possession is a tension jig that we use to study the forces, stress and strain of our samples under deformation being linear stretching or 3-point bending. This machine is coupled with DIC (Digital Image Correlation) system that supplements us with the digital stress/stress map of the samples surface under deformation. We also have a thermal imaging camera by FLIR to monitor the temperature of samples.',
    equipment: [
      { name: 'Corrtest Instruments CS35M - potentiostat/galvanostat', image: '/img/equipment/corrtest_cs35m.webp' },
      { name: 'Shimadzu EZ-LX - tensile jig', image: '/img/equipment/shimadzu_ez-lx.webp' },
      { name: 'Dantec DIC system', image: '/img/equipment/dantec_dic.webp' },
      { name: 'Rigol Multimeters', image: '/img/equipment/rigol_multimeters.webp' },
      { name: 'FLIR AX00 – thermal imaging camera', image: '/img/equipment/flir_ax00.webp' }
    ]
  },
  { 
    name: 'Optical microscopy and electro-magnetic measurements laboratory', 
    code: '1.4A', 
    imageId: 'facility-optical-microscopy',
    imagePosition: 'center 40%',
    lightImage: '/img/facilities/1-4a_optical-microscopy_light.webp',
    darkImage: '/img/facilities/1-4a_optical-microscopy_dark.webp',
    lightImageFallback: '/img/facilities/1-4a_optical-microscopy_light.jpeg',
    darkImageFallback: '/img/facilities/1-4a_optical-microscopy_dark.jpeg',
    description: 'In this laboratory we mainly conduct magnetic measurements using our state-of-the-art magnetic imaging system by Magcam. It enables us to visualize the shape and magnitude of the magnetic field produced by permanent magnets. This lab also houses a fully automated, custom-tailored optical stereo-microscope by Leica for detailed material examination and micro-manipulation. Additionally, a mini vector network analyzer (VNA) is used for testing high-frequency components for wireless energy and sensing applications.',
    equipment: [
      { name: 'Magcam Combi scanner - 3D magnetic field measurement system', image: '/img/equipment/magcam_combi.webp' },
      { name: 'Leica Microsystems – M205A custom automated stereoscopic microscope', image: '/img/equipment/leica_m205a.webp' },
      { name: 'ZeenKo LibreVNA - Vector Network Analyzer', image: '/img/equipment/zeenko_librevna.webp' },
    ]
  },
  { 
    name: 'Cloak & Dagger Fabrication Facility', 
    code: '0.016', 
    imageId: 'facility-fabrication',
    imagePosition: 'center 40%',
    lightImage: '/img/facilities/0-016_fabrication_light.webp',
    darkImage: '/img/facilities/0-016_fabrication_dark.webp',
    lightImageFallback: '/img/facilities/0-016_fabrication_light.jpeg',
    darkImageFallback: '/img/facilities/0-016_fabrication_dark.jpeg',
    description: 'After conceptualizing our samples, we fabricate our prototypes in this lab. We have at our disposal a FFM (fused filament deposition) 3D double extruder printer which we typically use for producing the molds for soft robotic parts. A vacuum bucket, a spin coater and a laboratory dryer are often used in the process of molding our designs. In producing flat rigid parts, we use a laser cutter. For producing our liquid metal circuitry, we use a micro-dispensing system. Other equipment includes micro milling and a lathe station.',
    equipment: [
      { name: 'Reise3D Pro2 Plus<br />double extruder FFM printer', image: '/img/equipment/reise3d_pro2.webp' },
      { name: 'Trotec Laser Speedy 100 laser cutting and engraving system', image: '/img/equipment/trotec_speedy100.webp' },
      { name: 'Musashi Engineering IM350PC micro-dispensing system', image: '/img/equipment/musashi_im350pc.webp' },
      { name: 'Proxxon micro-milling<br />and lathe station', image: '/img/equipment/proxxon_micro-milling.webp' },
      { name: 'Vacuum bucket', image: '/img/equipment/vacuum_bucket.webp' },
      { name: 'Laboratory dryer', image: '/img/equipment/laboratory_dryer.webp' },
      { name: 'Pneumatics stand', image: '/img/equipment/pneumatics_stand.webp' },
      { name: 'Ultrasonic cleaners', image: '/img/equipment/ultrasonic_cleaners.webp' },
      { name: 'Spin coater', image: '/img/equipment/spin_coater.webp' },
    ]
  },
];

export const historyMilestones = [
  { year: 2010, title: 'Lab Founded', description: 'The lab was established with a small team and a big vision.', image: '/img/placeholders/history-founded.jpg', image_alt: 'An empty but hopeful laboratory space' },
  { year: 2012, title: 'First Major Grant', description: 'Received a significant grant for quantum computing research.', image: '/img/placeholders/history-grant.jpg', image_alt: 'A person signing a formal document or grant paper' },
  { year: 2015, title: 'Breakthrough in Nanotechnology', description: 'Published a seminal paper on self-assembling nanobots.', image: '/img/placeholders/history-nanotech.jpg', image_alt: 'Abstract visualization of nanotechnology' },
  { year: 2018, title: 'Facility Expansion', description: 'Opened the new Optical Microscopy and Electro-magnetic Measurements Laboratory.', image: '/img/placeholders/history-expansion.jpg', image_alt: 'A modern, newly built laboratory facility' },
  { year: 2021, title: 'Spin-off Company Launched', description: "Launched 'QuantumLeap Inc.' to commercialize our quantum encryption technology.", image: '/img/placeholders/history-spin-off.jpg', image_alt: 'A small group in a new modern office, celebrating' },
  { year: 2024, title: 'AI in Research', description: 'Integrated a dedicated AI division to accelerate data analysis and discovery.', image: '/img/placeholders/history-ai.jpg', image_alt: 'An abstract representation of an AI brain or network' },
  { year: new Date().getFullYear(), title: 'Present Day', description: 'Continuing to innovate and push the boundaries of soft robotics and intelligent materials.' },
];

export const staticProjects = [
  {
    id: 'p1',
    title: "Development of innovative stretchable structures based on liquid metal for applications in soft robotics and wearable electronics",
    funding_source: "IDUB PW, Excellence Initiative Research University",
    funding_source_url: "https://badawcza.pw.edu.pl/",
    start_date: "2024-01-01",
    end_date: "2025-12-31",
    status: 'Ongoing',
    budget: 1099025,
    research_area: 'Soft Robotics'
  },
  {
    id: 'p2',
    title: "Air-morph: a pneumatically controlled composite enabling shape change",
    funding_source: "POB Material Technologies, Excellence Initiative Research University",
    funding_source_url: "https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe",
    start_date: "2024-01-01",
    end_date: "2025-12-31",
    status: 'Ongoing',
    budget: 199575,
    research_area: 'Soft Robotics'
  },
  {
    id: 'p3',
    title: "Highly elastic composite structure for electrical energy storage (Soft E-Pack)",
    funding_source: "IDUB PW, Excellence Initiative Research University",
    funding_source_url: "https://badawcza.pw.edu.pl/",
    start_date: "2023-01-01",
    end_date: "2024-12-31",
    status: 'Ongoing',
    budget: 149900,
    research_area: 'Soft Robotics'
  },
  {
    id: 'p4',
    title: "E-morph: an electrically controlled composite enabling shape change",
    funding_source: "POB Material Technologies, Excellence Initiative Research University",
    funding_source_url: "https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe",
    start_date: "2021-01-01",
    end_date: "2022-12-31",
    status: 'Completed',
    budget: 149985,
    research_area: 'Soft Robotics'
  },
  {
    id: 'p5',
    title: "The influence of a selected group of micro-features on the macroscopic fatigue properties of innovative granular functional materials",
    funding_source: "POB Material Technologies, Excellence Initiative Research University",
    funding_source_url: "https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe",
    start_date: "2020-01-01",
    end_date: "2022-12-31",
    status: 'Completed',
    budget: 199450,
    research_area: 'Soft Robotics'
  }
];

export const staticPublications = [
  {
    id: 'pub1',
    year: 2025,
    title: "Granular Jamming for Soft Robotics: Experiments and Modelling of Cyclic Loading",
    authors: ["P. Bartkowski", "M. Ciemiorek", "H. Bukowiecki", "P. Bomba", "R. Zalewski"],
    journal: "Archives of Civil and Mechanical Engineering",
    impact_factor: 4.4,
    external_link: "https://doi.org/10.1007/s43452-025-01176-9"
  },
  {
    id: 'pub2',
    year: 2024,
    title: "Flexible Electrical Energy Storage Structure with Variable Stiffness for Soft Robotics and Wearable electronics",
    authors: ["P. Bartkowski", "L. Pawliszak", "A. Lusawa", "S. Sypniewska", "M. Ciemiorek", "Y.-L. Park"],
    journal: "Soft Robotics",
    impact_factor: 6.4,
    external_link: "https://doi.org/10.1089/soro.2024.0098"
  },
  {
    id: 'pub3',
    year: 2024,
    title: "Programmable Shape-Shifting Soft Robotic Structure Using Liquid Metal Electromagnetic Actuators",
    authors: ["P. Bartkowski", "Ł. Pawliszak", "Siddhi G Chevale", "P. Pełka", "Y.-L. Park"],
    journal: "Soft Robotics",
    impact_factor: 6.4,
    external_link: "https://doi.org/10.1089/soro.2023.01440"
  },
  {
    id: 'pub4',
    year: 2022,
    title: "E-Morph as a New Adaptive Actuator for Soft Robotics",
    authors: ["P. Bartkowski", "F. Gawiński", "Ł. Pawliszak"],
    journal: "IEEE Robotics and Automation Letters",
    impact_factor: 4.6,
    external_link: "https://doi.org/10.1109/LRA.2022.3189169"
  }
];

export const staticHighlights = [
  {
    title: 'Programmable Shape-Shifting Structures',
    description: 'Our groundbreaking work on soft robotic structures using liquid metal electromagnetic actuators was published in Soft Robotics, demonstrating new possibilities for dynamic, reconfigurable materials.',
    imageId: 'project-robot-taste',
    link: 'https://doi.org/10.1089/soro.2023.01440',
    category: 'Publication Highlight'
  },
  {
    title: 'Flexible Electrical Energy Storage',
    description: 'We developed a variable stiffness electrical energy storage structure, a significant advancement for soft robotics and wearable electronics, featured in Soft Robotics.',
    imageId: 'project-angry-battery',
    link: 'https://doi.org/10.1089/soro.2024.0098',
    category: 'Publication Highlight'
  },
  {
    title: 'E-Morph: A New Adaptive Actuator',
    description: 'Our novel electrically controlled composite, E-Morph, was introduced in IEEE Robotics and Automation Letters as a new type of adaptive actuator for soft robotics applications.',
    imageId: 'project-stubborn-actuator',
    link: 'https://doi.org/10.1109/LRA.2022.3189169',
    category: 'Publication Highlight'
  }
];

export const teamMembers = [
  {
    name: 'Piotr Bartkowski DSc',
    role: 'Principal Investigator',
    hIndex: 9,
    image: '/img/team/piotr_bartkowski.jpg',
    imageHover: '/img/team/piotr_bartkowski_hover.jpg',
    bio: `<p style='text-align: justify;'>Piotr Bartkowski attained his MSc in 2015 and later in 2019 his PhD in Mechanical Engineering from Warsaw University of Technology (WUT). His specialization is Soft Robotics and Wearable Electronics. At present he is Assistant Professor at WUT and Principal Investigator at the Smart Materials and Soft Robotics Laboratory SMaRT-Lab. Dr. Bartkowski is the author of patents and articles published in prestigious journals from IEEE and others.</p>`
  },
  {
    name: 'Łukasz Pawliszak MSc',
    role: 'Senior Investigator',
    hIndex: 5,
    image: '/img/team/lukasz_pawliszak.jpg',
    imageHover: '/img/team/lukasz_pawliszak_hover.jpg',
    bio: `<p style='text-align: justify;'>Łukasz Pawliszak attained his BSc in 2013 and later in 2014 his MSc in Applied Physics from Warsaw University of Technology (WUT). His specialization was in Solid State Physics with a sub-specialization in Nanostructures. He has also attained a BSc in Printing and Paper Making with a specialization of Printing Technology from the same university in 2010. From 2021 his affiliation is with the newly established Smart Materials and Soft Robot Laboratory SMaRT-Lab at WUT. During this time, he has co-authored several papers on the topics of soft robotics and wearable electronics.</p>`
  },
  {
    name: 'Agata Lusawa MSc',
    role: 'Researcher',
    hIndex: 3,
    image: '/img/team/agata_lusawa.jpg',
    imageHover: '/img/team/agata_lusawa_hover.jpg',
    bio: `<p style='text-align: justify;'>Agata Lusawa attained her BSc degree in Electric and Hybrid Vehicle Engineering from the Warsaw University of Technology in 2024, and the MSc degree in the same field in 2025. She is currently pursuing the PhD degree in Mechanical Engineering, with research efforts focused on advanced materials and energy systems for soft robotics applications.</p>`
  },
  {
    name: 'Sabina Sypniewska BSc',
    role: 'Research Assistant',
    hIndex: 2,
    image: '/img/team/sabina_sypniewska.jpg',
    imageHover: '/img/team/sabina_sypniewska_hover.jpg',
    bio: `<p style='text-align: justify;'>Sabina Sypniewska attained her BSc degree in electric and hybrid vehicle engineering with a focus on ecological vehicles from Warsaw University of Technology in 2025. She is currently working towards her MSc degree in mechanical engineering, with research efforts aligned towards prospective PhD. studies in the same field.</p>`
  }
];

export const staticNews = [
  {
    id: 'n1',
    title: 'SMaRT-Lab Awarded Major Grant for AI-Powered Material Discovery',
    date: '2024-05-15T10:00:00Z',
    content: '<p>Our lab has received a significant grant from the National Science Foundation to pioneer a new platform that uses artificial intelligence to accelerate the discovery of novel soft materials. "This funding will allow us to explore material compositions that were previously unimaginable," says Dr. Piotr Bartkowski.</p>',
    type: 'news',
    author: 'Admin',
    imageId: 'absurd-news-1',
  },
  {
    id: 'n2',
    title: 'Upcoming Workshop: Introduction to Soft Robotics',
    date: '2024-06-20T14:00:00Z',
    content: '<p>Join us for a hands-on workshop covering the fundamentals of soft robotics design and fabrication. The event is open to all students and researchers interested in this exciting field. No prior experience is required. The workshop will be held in room 1.11G.</p>',
    type: 'event',
    location: 'Warsaw University of Technology, Room 1.11G',
    externalLink: 'https://www.wut.edu.pl/',
    imageId: 'absurd-news-2',
  },
  {
    id: 'n3',
    title: 'New Publication in "Advanced Materials"',
    date: '2024-04-30T09:00:00Z',
    content: '<p>Our latest paper, "Self-Healing Conductive Polymers for Resilient Wearable Electronics," has been published in the prestigious journal <i>Advanced Materials</i>. The paper details a new composite material capable of repairing itself after damage.</p>',
    type: 'announcement',
    author: 'Łukasz Pawliszak',
    externalLink: 'https://onlinelibrary.wiley.com/journal/15214095',
    imageId: 'absurd-news-3',
  }
];
