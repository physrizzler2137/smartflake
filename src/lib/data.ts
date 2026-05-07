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
  { year: 2010, title: 'Lab Founded', description: 'The lab was established with a small team and a big vision.', image: 'https://picsum.photos/seed/hist1/600/400', image_alt: 'An empty but hopeful laboratory space' },
  { year: 2012, title: 'First Major Grant', description: 'Received a significant grant for quantum computing research.', image: 'https://picsum.photos/seed/hist2/600/400', image_alt: 'A person signing a formal document or grant paper' },
  { year: 2015, title: 'Breakthrough in Nanotechnology', description: 'Published a seminal paper on self-assembling nanobots.', image: 'https://picsum.photos/seed/hist3/600/400', image_alt: 'Abstract visualization of nanotechnology' },
  { year: 2018, title: 'Facility Expansion', description: 'Opened the new Optical Microscopy and Electro-magnetic Measurements Laboratory.', image: 'https://picsum.photos/seed/hist4/600/400', image_alt: 'A modern, newly built laboratory facility' },
  { year: 2021, title: 'Spin-off Company Launched', description: "Launched 'QuantumLeap Inc.' to commercialize our quantum encryption technology.", image: 'https://picsum.photos/seed/hist5/600/400', image_alt: 'A small group in a new modern office, celebrating' },
  { year: 2024, title: 'AI in Research', description: 'Integrated a dedicated AI division to accelerate data analysis and discovery.', image: 'https://picsum.photos/seed/hist6/600/400', image_alt: 'An abstract representation of an AI brain or network' },
  { year: new Date().getFullYear(), title: 'Present Day', description: 'Continuing to innovate and push the boundaries of soft robotics and intelligent materials.' },
];
