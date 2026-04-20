import { NewsItem, HistoryMilestone, ResearchHighlight, Project, Publication } from '@/lib/types';
import { history, researchHighlights as staticHighlights } from './data';

export const seedNews: Omit<NewsItem, 'id'>[] = [
  {
    title: 'SMaRT-Lab Awarded Major Grant for AI-Powered Material Discovery',
    date: new Date('2024-05-15T10:00:00Z').toISOString(),
    content: '<p>Our lab has received a significant grant from the National Science Foundation to pioneer a new platform that uses artificial intelligence to accelerate the discovery of novel soft materials. "This funding will allow us to explore material compositions that were previously unimaginable," says Dr. Piotr Bartkowski.</p>',
    type: 'news',
    author: 'Admin',
    imageId: 'absurd-news-1',
  },
  {
    title: 'Upcoming Workshop: Introduction to Soft Robotics',
    date: new Date('2024-06-20T14:00:00Z').toISOString(),
    content: '<p>Join us for a hands-on workshop covering the fundamentals of soft robotics design and fabrication. The event is open to all students and researchers interested in this exciting field. No prior experience is required. The workshop will be held in room 1.11G.</p>',
    type: 'event',
    location: 'Warsaw University of Technology, Room 1.11G',
    externalLink: 'https://www.wut.edu.pl/',
    imageId: 'absurd-news-2',
  },
  {
    title: 'New Publication in "Advanced Materials"',
    date: new Date('2024-04-30T09:00:00Z').toISOString(),
    content: '<p>Our latest paper, "Self-Healing Conductive Polymers for Resilient Wearable Electronics," has been published in the prestigious journal <i>Advanced Materials</i>. The paper details a new composite material capable of repairing itself after damage.</p>',
    type: 'announcement',
    author: 'Łukasz Pawliszak',
    externalLink: 'https://onlinelibrary.wiley.com/journal/15214095',
    imageId: 'absurd-news-3',
  },
  {
    title: 'SMaRT-Lab Demonstrates Shape-Shifting Medical Implant',
    date: new Date('2024-03-10T11:30:00Z').toISOString(),
    content: '<p>In a live demonstration, our team showcased a new biocompatible implant that can change its shape in response to body temperature, opening doors for less invasive surgical procedures. The work is a collaboration with the Medical University of Warsaw.</p>',
    type: 'news',
    location: 'Warsaw',
    imageId: 'absurd-news-4',
  },
];

export const seedHistory: Omit<HistoryMilestone, 'id'>[] = history;

export const seedHighlights: Omit<ResearchHighlight, 'id'>[] = staticHighlights.map((highlight, index) => ({
    ...highlight,
    order: index,
}));

const staticProjects = [
  {
    title: "Development of innovative stretchable structures based on liquid metal for applications in soft robotics and wearable electronics",
    fundingSource: "IDUB PW, Excellence Initiative Research University",
    fundingSourceUrl: "https://badawcza.pw.edu.pl/",
    dates: "2024-2025",
    budget: 1099025
  },
  {
    title: "Air-morph: a pneumatically controlled composite enabling shape change",
    fundingSource: "POB Material Technologies, Excellence Initiative Research University",
    fundingSourceUrl: "https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe",
    dates: "2024-2025",
    budget: 199575
  },
  {
    title: "Highly elastic composite structure for electrical energy storage (Soft E-Pack)",
    fundingSource: "IDUB PW, Excellence Initiative Research University",
    fundingSourceUrl: "https://badawcza.pw.edu.pl/",
    dates: "2023-2024",
    budget: 149900
  },
  {
    title: "E-morph: an electrically controlled composite enabling shape change",
    fundingSource: "POB Material Technologies, Excellence Initiative Research University",
    fundingSourceUrl: "https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe",
    dates: "2021-2022",
    budget: 149985
  },
  {
    title: "The influence of a selected group of micro-features on the macroscopic fatigue properties of innovative granular functional materials",
    fundingSource: "POB Material Technologies, Excellence Initiative Research University",
    fundingSourceUrl: "https://badawcza.pw.edu.pl/Priorytetowe-Obszary-Badawcze/Technologie-materialowe",
    dates: "2020-2022",
    budget: 199450
  }
];

export const seedProjects: Omit<Project, 'id'>[] = staticProjects.map(p => {
    const [startYear, endYear] = p.dates.split('-').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();

    return {
        title: p.title,
        description: `A research project focused on ${p.title.toLowerCase()}.`,
        startDate: new Date(startYear, 0, 1).toISOString(),
        endDate: new Date(endYear, 11, 31).toISOString(),
        status: endYear >= currentYear ? 'Ongoing' : 'Completed',
        fundingSource: p.fundingSource,
        fundingSourceUrl: p.fundingSourceUrl,
        budget: p.budget,
        researchArea: 'Soft Robotics',
    }
});


const staticPublications = {
  '2025': [
    { 
      title: "Granular Jamming for Soft Robotics: Experiments and Modelling of Cyclic Loading", 
      authors: [ "P. Bartkowski", "M. Ciemiorek", "H. Bukowiecki", "P. Bomba", "R. Zalewski" ], 
      journal: "Archives of Civil and Mechanical Engineering",
      impactFactor: 4.4,
      externalLink: "https://doi.org/10.1007/s43452-025-01176-9",
    },
  ],
  '2024': [
    { 
      title: "Flexible Electrical Energy Storage Structure with Variable Stiffness for Soft Robotics and Wearable electronics", 
      authors: [ "P. Bartkowski", "L. Pawliszak", "A. Lusawa", "S. Sypniewska", "M. Ciemiorek", "Y.-L. Park" ], 
      journal: "Soft Robotics", 
      impactFactor: 6.4,
      externalLink: "https://doi.org/10.1089/soro.2024.0098", 
      journalLink: "https://www.liebertpub.com/loi/soro" 
    },
    { 
      title: "Multiphysics Simulation and Concept of an Electromagnetically Controlled Volumetric Pixel as a Step Towards a New Type of Actuator", 
      authors: [ "P. Bartkowski", "L. Pawliszak", "Siddhi G Chevale", "J. Ruiz Lu", "J. David Brigido" ], 
      journal: "Acta Mechanica et Automatica", 
      impactFactor: 1,
      externalLink: "https://doi.org/10.2478/ama-2024-0071", 
      journalLink: "https://sciendo.com/journal/AMA" 
    },
    { 
      title: "Programmable Shape-Shifting Soft Robotic Structure Using Liquid Metal Electromagnetic Actuators", 
      authors: [ "P. Bartkowski", "Ł. Pawliszak", "Siddhi G Chevale", "P. Pełka", "Y.-L. Park" ], 
      journal: "Soft Robotics", 
      impactFactor: 6.4,
      externalLink: "https://doi.org/10.1089/soro.2023.01440", 
      journalLink: "https://www.liebertpub.com/loi/soro" 
    },
  ],
  '2022': [
    { 
      title: "E-Morph as a New Adaptive Actuator for Soft Robotics", 
      authors: [ "P. Bartkowski", "F. Gawiński", "Ł. Pawliszak" ], 
      journal: "IEEE Robotics and Automation Letters", 
      impactFactor: 4.6,
      externalLink: "https://doi.org/10.1109/LRA.2022.3189169", 
    },
    { 
      title: "Flexural Models for Vacuum-Packed Particles as a Variable-Stiffness Mechanism in Smart Structures", 
      authors: [ "Brigido J.David", "Burrow G.Steve", "Woods Benjamin K.S", "Bartkowski Piotr", "Zalewski Robert" ], 
      journal: "Physical Review Applied", 
      impactFactor: 3.8,
      externalLink: "https://doi.org/10.1103/PhysRevApplied.17.044018", 
    },
     {
      title: "Adaptive crash energy absorber based on a granular jamming mechanism",
      authors: [ "Bartkowski Piotr", "Bukowiecki Hubert", "Gawiński Franciszek", "Zalewski Robert" ],
      journal: "Bulletin of the Polish Academy of Sciences, Technical Sciences",
      externalLink: "https://doi.org/10.24425/bpasts.2021.139002",
    },
    {
      title: "A Smart Wing Based on Vacuum-Packed Particles",
      authors: [ "Gonzalez J.D.", "Burrow S.G.", "Woods B.K.S.", "Bartkowski Piotr" ],
      journal: "Smart Materials, Adaptive Structures and Intelligent Systems",
      externalLink: "https://doi.org/10.1115/SMASIS2021-67452",
    }
  ]
};

export const seedPublications: Omit<Publication, 'id'>[] = Object.entries(staticPublications).flatMap(([year, pubs]) => 
    pubs.map(pub => ({
        ...pub,
        year: parseInt(year, 10),
        abstract: `This paper, published in ${pub.journal}, explores the topic of "${pub.title}".`,
        doi: pub.externalLink?.replace('https://doi.org/', ''),
    }))
);


export const team = {
  active: [
    { name: 'Piotr Bartkowski DSc', role: 'Principal Investigator', hIndex: 9, imageId: 'piotr-bartkowski', megaUrl: 'https://mega.nz/file/S4QXTZqb#Stk3jVvHkqXuaTb9TO-6IxEU3XdN2FgZV2HHvGqg3oM', megaUrlHover: 'https://mega.nz/file/uswnkIwA#N9atMzOrFOgwb5BjhOFQWNlZopii4JEOgCddAZ2ELvQ', imagePosition: '50% 15%', bio: `<p style='text-align: justify;'>Piotr Bartkowski attained his MSc in 2015 and later in 2019 his PhD in Mechanical Engineering from Warsaw University of Technology (WUT). His specialization is Soft Robotics and Wearable Electronics. At present he is Assistant Professor at WUT and Principal Investigator at the Smart Materials and Soft Robotics Laboratory SMaRT-Lab. Dr. Bartkowski is the author of patents and articles published in prestigious journals from IEEE and others.</p>` },
    { name: 'Łukasz Pawliszak MSc', role: 'Senior Investigator', hIndex: 5, imageId: 'lukasz-pawliszak', megaUrl: 'https://mega.nz/file/a54EyBqS#04X6GmUQ-3rcV6IwvnbrjRJcthvk5EzRec8FGrDhyRQ', megaUrlHover: 'https://mega.nz/file/XsAxjZiL#I4qmGnjEfF_mr7YowfJg7HkKxhc5IRaD1uSlnjqerks', imagePosition: '50% 20%', bio: `<p style='text-align: justify;'>
Łukasz Pawliszak attained his BSc in 2013 and later in 2014 his MSc in Applied Physics from Warsaw University of Technology (WUT). His specialization was in Solid State Physics with a sub-specialization in Nanostructures. He has also attained a BSc in Printing and Paper Making with a specialization of Printing Technology from the same university in 2010. From 2021 his affiliation is with the newly established Smart Materials and Soft Robot Laboratory SMaRT-Lab at WUT. During this time, he has co-authored several papers on the topics of soft robotics and wearable electronics.
Mr. Pawliszak was awarded among other first prize for his masters thesis on magnetic nano-structures in the contest for best PhD, masters or bachelors thesis organized by ABB Poland, multiple scholarships from National Institute for Materials Science (NIMS) Japan.
</p>` },
    { name: 'Agata Lusawa MSc', role: 'Researcher', hIndex: 3, megaUrl: 'https://mega.nz/file/yog2WYqT#ixu5b3FE4Yvz78oD5jq6DaIGC6kiNE4BcbW_674lHwk', megaUrlHover: 'https://mega.nz/file/OkAl3KTT#-MHYjFTkTX29gC97Lq-03McrtEcwk3b7goRSTFpAonU', imagePosition: '50% 20%', bio: `<p style='text-align: justify;'>
Agata Lusawa attained her BSc degree in Electric and Hybrid Vehicle Engineering from the Warsaw University of Technology in 2024, and the MSc degree in the same field in 2025. She is currently pursuing the PhD degree in Mechanical Engineering, with research efforts focused on advanced materials and energy systems for soft robotics applications. Since 2021, she has been affiliated with SMaRT Lab at the Faculty of Automotive and Construction Engineering, Warsaw University of Technology, where she works as a Laboratory Technician. Ms. Lusawa contributed as co-author to the publication published in Soft Robotics in 2024. She won the grand prize as well as numerous material and financial awards in the 28th edition of the Dr. Eng. Marek Poncyliusz Competition for the best thesis defended at the Faculty of Automotive and Construction Machinery Engineering in 2025.
</p>` },
    { name: 'Sabina Sypniewska BSc', role: 'Research Assistant', hIndex: 2, imageId: 'sabina-sypniewska', megaUrl: 'https://mega.nz/file/nlAGVCgS#cKaUU2u2beMIZ_66P9a4Iiu0ZDyO-mf-5vJK3AyeFSw', megaUrlHover: 'https://mega.nz/file/TlZ2jazK#ZimaSXWoEbRsGLysxG5bw_mykeCaTmI3BYlBYIxPQt0', imagePosition: '50% 25%', bio: `<p style='text-align: justify;'>
Sabina Sypniewska attained her BSc degree in electric and hybrid vehicle engineering with a focus on ecological vehicles from Warsaw University of Technology in 2025. She is currently working towards her MSc degree in mechanical engineering, with research efforts aligned towards prospective PhD. studies in the same field. Since 2022 she has been working as a Laboratory Technician at the SMaRT lab at the Faculty of Automotive and Construction Machinery Warsaw University of Technology. This year she also started assisting during lectures helping students with practical exercises. Ms. Sypniewska is one of the authors of a publication titled Flexible Electrical Energy Storage Structure with Variable Stiffness for Soft Robotics and Wearable Electronics, published in Soft Robotics in 2024. 
</p>` },
    { name: 'Zofia Nowicka BSc', role: 'Research Assistant', hIndex: 2, imageId: 'zofia-nowicka', megaUrl: 'https://mega.nz/file/TwxC2KqL#idHHN7zbe05yJ5I5860NdY5rkStx4zgDizI4Dhb2jPQ', megaUrlHover: 'https://mega.nz/file/b4BQiRRL#Reprg3wp4ZRaQEznqmTo_sXvsp3aQ3b_7F9Wmvnimm4', imagePosition: '50% 15%', bio: `<p style='text-align: justify;'>
Zofia Nowicka attained her BSc degree with honors from the Warsaw University of Technology (WUT) in 2026, defending a thesis focused on the optimization of the dyeing process for polyester yarn. Her research interests lie primarily in sensor technology and wearable electronics. Since 2025, she has been affiliated with the SMaRT-Lab, where her research concentrates on developing flexible conductive pathways utilizing Laser-Induced Graphene (LIG). She previously gained valuable experience during an internship at CEZAMAT WUT in the Printed Electronics and Textronics team, where she contributed to wearable technology projects, notably a university grant focused on clothing-integrated sweat sensors. Furthermore, her academic contributions include a 2025 publication and a presentation on strain gauges for parachute canopies at the International Astronautical Congress (IAC) in Sydney.
</p>` },
    { name: 'Gözen Ecehan', role: 'Undergraduate', hIndex: 1, imageId: 'gozen-ecehan', megaUrl: 'https://mega.nz/file/Ph4T2BoJ#Nn2gYt6jCu058jYi203Fny0lIquHwQ8g89gcqFgJQvg', megaUrlHover: 'https://mega.nz/file/mlQ3kQ6A#pXEOdLWB-4TYgjg-innQvz8ptW9RjBQLhnuPk_YaEpw', imagePosition: '50.00% 40.00%', bio: `<p style='text-align: justify;'>
Ecehan Gözen is currently pursuing her BSc degree in Electric and Hybrid Vehicles Engineering. During first year of her studies, she started working at SMaRT-Lab researching smart, amorphous, shape shifting structures and hard magnetic soft materials. For the past year and a half, her focus in the lab has been aimed at development of permanent, soft magnets for possible soft robotics applications, as well as the investigation of magnetic field behavior in such structures as a result of applied strain.
</p>` },
    { name: 'Maja Banasiak', role: 'Undergraduate', hIndex: 1, imageId: 'maja-banasiak', megaUrl: 'https://mega.nz/file/r5RSlDoD#AwWGX9-2Jczt_D9BOqaaataaLADpAQOpPX_r5I1gKBg', megaUrlHover: 'https://mega.nz/file/S8BxTISC#bvWApCEjUNDxklh6B3FJSiyzzgITw98aqG4AIYlr02U', imagePosition: '50% 30.00%', bio: `<p style='text-align: justify;'>
Maja Banasiak is a mechanical engineering student at WUT whose experiments in soft robotics intelligent materials and liquid metal printing consistently blur the distinction between research and unexplained laboratory folklore. Her liquid metal samples occasionally assemble themselves into geometric shapes that no one can name and once attempted to climb a ruler after Maja expressed her dissatisfaction with a stalled experiment. Several soft robotic prototypes have developed defensive instincts including slowly rotating to face the wall whenever she approaches. Despite the recurring scenes of scientific confusion that follow her, Maja continues to investigate the unpredictable behavior of advanced materials magnetically induced mischief and the curious laboratory events that occur at the exact moment she runs out of patience.
</p>` },
    { name: 'Małgorzata Pieniążek', role: 'Undergraduate', hIndex: 1, imageId: 'malgorzata-pieniazek', megaUrl: 'https://mega.nz/file/ThInXSRJ#gHLWbYIqgknUIkkgbWkIIta0fjKuDamUidD1I8EOm60', megaUrlHover: 'https://mega.nz/file/2oxwDZbR#SRv_ByaCsV9mmPNqQziX1Ubg64_zrMIDmfCZrO_A2Vs', imagePosition: '50% 20%', bio: `<p style='text-align: justify;'>
Małgorzata Pieniążek is a BSc candidate at WUT whose rare laboratory appearances occur with the subtle drama of an unexpected eclipse. She studies biomimicry soft robotic bio designs and pneumatic morphing structures that behave as if they are slowly remembering forgotten instincts. Małgorzata famously does not read emails which has led several experiments to activate themselves days before she arrives. She is often accompanied by a mysterious boy whose quiet presence seems to make the equipment hesitate as though reassessing its own purpose. Some of her materials drift into patterns that resemble messages from unfamiliar ecosystems while others remain perfectly still until she looks away. Despite her elusive schedule Małgorzata continues to pursue designs that feel less engineered and more encountered like visitors that briefly choose her workspace before continuing on their own quiet trajectories.
</p>` },
  ],
  alumni: {
    '2025': [
        { name: 'J. Ruiz Lu', role: 'Alumni', hIndex: 1, imageId: 'j-ruiz-lu', megaUrl: '', imagePosition: 'center' },
        { name: 'S. G. Chevale', role: 'Alumni', hIndex: 2, imageId: 'sg-chevale', megaUrl: '', imagePosition: 'center' },
    ],
    '2023': [
      { name: 'P. Pełka', role: 'Alumni', hIndex: 2, imageId: 'p-pelka', megaUrl: '', imagePosition: 'center' },
    ],
    '2022': [
      { name: 'H. Bukowiecki', role: 'Alumni', hIndex: 4, imageId: 'h-bukowiecki', megaUrl: '', imagePosition: 'center' },
      { name: 'P. Bomba', role: 'Alumni', hIndex: 2, imageId: 'p-bomba', megaUrl: '', imagePosition: 'center' },
      { name: 'F. M. Gawiński', role: 'Alumni', hIndex: 2, imageId: 'fm-gawinski', megaUrl: '', imagePosition: 'center' },
    ]
  },
  groupPhotos: [
    { year: 2026, megaUrl: 'https://mega.nz/file/ztI0xA4J#jMx1qBWhHysxsTYNLzJ5pbWs8R0WDIQqmlznHMpoUHc', imagePosition: 'center' },
    { year: 2024, megaUrl: 'https://mega.nz/file/i8AxRRwa#xvKZHwY63qidk5f34kQR9wsvTjcDrr1RI421wgwB7GY', imagePosition: 'center' }
  ]
};
