export const navLinks = [
  { name: 'News', href: '#news' },
  { name: 'History', href: '#history' },
  { name: 'Facilities', href: '#facilities' },
  { name: 'Team', href: '#team' },
  { name: 'Highlights', href: '#highlights' },
  { name: 'Projects', href: '#projects' },
  { name: 'Publications', href: '#publications' },
  { name: 'Stats', href: '#stats' },
  { name: 'Contact', href: '#contact' },
];

export const researchHighlights = [
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
  },
  {
      title: 'Stretchable Structures with Liquid Metal',
      description: 'This ongoing project, funded by the Excellence Initiative Research University, focuses on developing innovative stretchable structures with liquid metal for next-generation soft robotics and wearables.',
      imageId: 'project-liquid-geometry',
      link: '#projects',
      category: 'Project Highlight'
  },
  {
      title: 'Advanced Wearable Sensors',
      description: 'Our team has developed a new generation of flexible, skin-like sensors for monitoring physiological signals with unprecedented accuracy, featured in a recent tech showcase.',
      imageId: 'project-wearable-sleeve',
      link: '#',
      category: 'Technology Showcase'
  },
  {
      title: 'Laser-Induced Graphene Pathways',
      description: 'We have perfected a method for creating highly conductive graphene circuits directly on polymer substrates using a simple laser engraving process, paving the way for low-cost, flexible electronics.',
      imageId: 'project-graphene-stars',
      link: '#',
      category: 'Research Milestone'
  }
];

export const mission = {
  intro: "Our research focuses on the exciting field of soft robotics and wearable electronics.<br />We design, fabricate, and test not only soft robotic actuators and other, but also flexible sensors, pushing the boundaries of what's possible with intelligent, compliant systems.",
  quotes: [
    {
      text: "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.",
      author: "Isaac Asimov"
    }
  ]
};

export const history = [
  { year: 2010, title: "Lab Founded", description: "The lab was established with a small team and a big vision.", imageId: "history-founded" },
  { year: 2012, title: "First Major Grant", description: "Received a significant grant for quantum computing research.", imageId: "history-grant" },
  { year: 2015, title: "Breakthrough in Nanotechnology", description: "Published a seminal paper on self-assembling nanobots.", imageId: "history-nanotech" },
  { year: 2018, title: "Facility Expansion", description: "Opened the new Optical Microscopy and Electro-magnetic Measurements Laboratory.", imageId: "history-expansion" },
  { year: 2021, title: "Spin-off Company Launched", description: "Launched 'QuantumLeap Inc.' to commercialize our quantum encryption technology.", imageId: "history-spin-off" },
  { year: 2024, title: "AI in Research", description: "Integrated a dedicated AI division to accelerate data analysis and discovery.", imageId: "history-ai" },
];

export const facilities = [
  { 
    name: 'Micro-chemistry, mechanical and electronic measurement laboratory', 
    code: '1.11G', 
    imageId: 'facility-micro-chemistry',
    lightImageUrl: 'https://mega.nz/file/3oh3gRAT#FWDQNUpZL-np90ItswDf7k6anaPs9rEjgs_UFdhx7VE',
    darkImageUrl: 'https://mega.nz/file/exZ3kZpa#DKisp5qSA7yS4sweH0UCW7DuApumBfG9mMbALhmNtAk',
    description: 'In this room we can conduct micro-chemistry measurements such as battery cell cycling but also EIS (Electric Independence spectroscopy). The second major measurement device in our possession is a tension jig that we use to study the forces, stress and strain of our samples under deformation being linear stretching or 3-point bending. This machine is coupled with DIC (Digital Image Correlation) system that supplements us with the digital stress/stress map of the samples surface under deformation. We also have a thermal imaging camera by FLIR to monitor the temperature of samples.',
    equipment: [
      { name: 'Corrtest Instruments CS35M - potentiostat/galvanostat', megaUrl: 'https://mega.nz/file/DswRBSCB#Qp6S1A2IQjItIdk6POO-HfASCJSQSoorTD_kXxKvxnc' },
      { name: 'Shimadzu EZ-LX - tensile jig', megaUrl: 'https://mega.nz/file/vshwHARL#sZrj8awhgLbVX1IGKmbzz_s9zKE44Eg5OzDjOL-XCYw' },
      { name: 'Dantec DIC system', megaUrl: 'https://mega.nz/file/K5AljK5B#BadejAIvGfcWNScL-4m6fm0UuMG7Hjmn23RMeoxWtQE' },
      { name: 'Rigol Multimeters', megaUrl: 'https://mega.nz/file/ngxllYQI#MaI0D8LlDtmlLj_3egj0O8uHAKBj83hvKMHUT1CKh38' },
      { name: 'FLIR AX00 – thermal imaging camera', megaUrl: 'https://mega.nz/file/2hAyXJib#uqEetMRxqNPJzoJ_p7TWycjIQXPbRJyFzUV3S6sV9hU' }
    ]
  },
  { 
    name: 'Optical microscopy and electro-magnetic measurements laboratory', 
    code: '1.4A', 
    imageId: 'facility-optical-microscopy',
    imagePosition: 'center 40%',
    lightImageUrl: 'https://mega.nz/file/S8AUUSwD#ChdmjzyYLk2cN10xsXRTK9E9W7FAot1hMUyIFiVbkYw',
    darkImageUrl: 'https://mega.nz/file/Lo5X3KrB#MdOZa-rsRRXpnHr8Iv_WyQ0Z3LR4K5S-A7ul8jQhkr8',
    description: 'In this laboratory we mainly conduct magnetic measurements using our state-of-the-art magnetic imaging system by Magcam. It enables us to visualize the shape and magnitude of the magnetic field produced by permanent magnets. This lab also houses a fully automated, custom-tailored optical stereo-microscope by Leica for detailed material examination and micro-manipulation. Additionally, a mini vector network analyzer (VNA) is used for testing high-frequency components for wireless energy and sensing applications.',
    equipment: [
      { name: 'Magcam Combi scanner - 3D magnetic field measurement system', megaUrl: 'https://mega.nz/file/HgxQ2KBS#pmSCF4tOQ68nBWT26Ui4NmsmbiNVaHN4lYsiTLofmIs' },
      { name: 'Leica Microsystems – M205A custom automated stereoscopic microscope', megaUrl: 'https://mega.nz/file/eoJi3TKA#8K0bZs0cUbEFFlTjgVNwhNUyvgSddvbq0djCd1uTZjI' },
      { name: 'ZeenKo LibreVNA - Vector Network Analyzer', megaUrl: 'https://mega.nz/file/Xl50xaBa#6VddFMrgZtQrsBpMKZ5lJSFjGgnXbn0CQDCeyq29PYo' },
    ]
  },
  { 
    name: 'Cloak & Dagger Fabrication Facility', 
    code: '0.016', 
    imageId: 'facility-fabrication',
    imagePosition: 'center 40%',
    lightImageUrl: 'https://mega.nz/file/78w1zR6Y#fWEeDelw2fj1e23zryz0g92yBl_oPr80unRSI6Ad-wo',
    darkImageUrl: 'https://mega.nz/file/n4hwDKyQ#LVHp18LWMTEIz-kzbkK_kbXIH9iSJ73JcG80Ty7ja04',
    description: 'After conceptualizing our samples, we fabricate our prototypes in this lab. We have at our disposal a FFM (fused filament deposition) 3D double extruder printer which we typically use for producing the molds for soft robotic parts. A vacuum bucket, a spin coater and a laboratory dryer are often used in the process of molding our designs. In producing flat rigid parts, we use a laser cutter. For producing our liquid metal circuitry, we use a micro-dispensing system. Other equipment includes micro milling and a lathe station.',
    equipment: [
      { name: 'Reise3D Pro2 Plus<br />double extruder FFM printer', megaUrl: 'https://mega.nz/file/XkgATYYB#K_7q_nc-v-IOlTc2djkQcH6DrWBlKP1bJEkAloXKba4' },
      { name: 'Trotec Laser Speedy 100 laser cutting and engraving system', megaUrl: 'https://mega.nz/file/fhwTlSjJ#aQsBZ9eHzr19pzgGoDD9JxMSLp6qaRJcIx5hTo27Fb8' },
      { name: 'Musashi Engineering IM350PC micro-dispensing system', megaUrl: 'https://mega.nz/file/a5IXFBya#Np5blFaBRt88xQTW7XADbzu6GPSo1K20c5GTngXrox8' },
      { name: 'Proxxon micro-milling<br />and lathe station', megaUrl: 'https://mega.nz/file/CgB2HJyY#b6rnL7ypg7QywTAzEDXX_1yWIw1qA9Dh8_3rVG6pmCo' },
      { name: 'Vacuum bucket', megaUrl: 'https://mega.nz/file/2pYGgb5Z#hIdGMn08kS_GJuHTtrPQ6rb9y06GgZLlD-jon79FEC0' },
      { name: 'Laboratory dryer', megaUrl: 'https://mega.nz/file/f1oiEbjb#DMvFU0E0z7CMtU3U9cCWGyYOV8T2XPQ7tp_F5l9iiaA' },
      { name: 'Pneumatics stand', megaUrl: 'https://mega.nz/file/SkInwDjI#kSTyjIgj8dyj8-dRaN553iuhkkkYgCHqbE1sMTL-gtI' },
      { name: 'Ultrasonic cleaners', megaUrl: 'https://mega.nz/file/zh4WBJCI#nnqt16GepAgNxlUFTRO2vI5SZgb4VaWPV7d4I4uFie8' },
      { name: 'Spin coater', megaUrl: 'https://mega.nz/file/Lh5VXZYI#9E06Z_GTIzIIBBNqRG2yGupaUSnSpa_hFk1prf3t2ls' },
    ]
  },
];

export const opportunities = {
  positions: "We are always looking for undergraduate and PhD students, as well as Postdoctoral Fellows passionate about science to join our lab in our daily research activities.<br /><br />Please contact us directly at the faculty or simply drop us an email with your interests, ideas, possibly a CV to inquire about current job openings and diploma thesis topics offered at our lab.",
  theses: "Several diploma thesis topics are available in the fields of machine learning, quantum simulation, and material science. Please contact us with your CV and interests."
};
