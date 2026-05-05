/**
 * Seed script for SMaRT-Lab Supabase database.
 * Seeds: news_items, research_highlights, history_milestones
 * Run: node scripts/seed_data.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wmmbswlajfwahiaadtxc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xFVcgTS2Gb0750W2WQjENA_4ufhJaJF';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────

const newsItems = [
  {
    title: 'SMaRT-Lab Presents at International Soft Robotics Conference 2025',
    content: '<p>Our team presented groundbreaking research on liquid metal electromagnetic actuators at the premier soft robotics conference in Zurich. Dr. Bartkowski delivered a keynote on programmable shape-shifting structures, drawing considerable interest from the research community.</p>',
    date: '2025-11-15',
    author: 'Dr. P. Bartkowski',
    location: 'Zurich, Switzerland',
    imageId: null,
    imageUrl: 'https://picsum.photos/seed/news1/800/400'
  },
  {
    title: 'New Publication in Soft Robotics Journal: Flexible Energy Storage Breakthrough',
    content: '<p>We are thrilled to announce our latest publication: <em>Flexible Electrical Energy Storage Structure with Variable Stiffness for Soft Robotics and Wearable Electronics</em>, published in the prestigious <strong>Soft Robotics</strong> journal. This work introduces a novel approach to integrating energy storage directly into soft robotic bodies.</p>',
    date: '2025-09-03',
    author: 'Ł. Pawliszak',
    location: null,
    imageId: null,
    imageUrl: 'https://picsum.photos/seed/news2/800/400'
  },
  {
    title: 'SMaRT-Lab Welcomes New Research Assistant — Zofia Nowicka',
    content: '<p>We are delighted to welcome Zofia Nowicka to the SMaRT-Lab team. Zofia recently defended her BSc thesis at the Warsaw University of Technology with distinction, and her research interests focus on sensor technology and wearable electronics. Welcome aboard!</p>',
    date: '2025-05-20',
    author: 'SMaRT-Lab Team',
    location: 'Warsaw, Poland',
    imageId: null,
    imageUrl: 'https://picsum.photos/seed/news3/800/400'
  },
  {
    title: 'Excellence Initiative Research University Grant Renewed for Liquid Metal Project',
    content: '<p>We are pleased to announce that our flagship project, <em>Development of innovative stretchable structures based on liquid metal for applications in soft robotics and wearable electronics</em>, has received renewed funding from the IDUB Excellence Initiative at Warsaw University of Technology.</p>',
    date: '2025-03-10',
    author: 'Dr. P. Bartkowski',
    location: 'Warsaw, Poland',
    imageId: null,
    imageUrl: 'https://picsum.photos/seed/news4/800/400'
  },
  {
    title: 'New Publication in Archives of Civil and Mechanical Engineering',
    content: '<p>Our collaborative paper, <em>Granular Jamming for Soft Robotics: Experiments and Modelling of Cyclic Loading</em>, has been published in the <strong>Archives of Civil and Mechanical Engineering</strong> (Impact Factor 4.4). This work models the cyclic behaviour of granular jamming composites.</p>',
    date: '2025-01-22',
    author: 'P. Bartkowski et al.',
    location: null,
    imageId: null,
    imageUrl: 'https://picsum.photos/seed/news5/800/400'
  },
  {
    title: 'SMaRT-Lab Partners with Leica Microsystems for Advanced Optical Research',
    content: '<p>We have formalized a research partnership with Leica Microsystems to expand our optical microscopy capabilities. The collaboration gives our team access to cutting-edge optical instruments and software for micro-manipulation and material characterization studies.</p>',
    date: '2024-10-05',
    author: 'SMaRT-Lab Team',
    location: 'Warsaw, Poland',
    imageId: null,
    imageUrl: 'https://picsum.photos/seed/news6/800/400'
  }
];

const researchHighlights = [
  { display_order: 1, title: 'Programmable Shape-Shifting Structures', description: 'Our groundbreaking work on soft robotic structures using liquid metal electromagnetic actuators was published in Soft Robotics, demonstrating new possibilities for dynamic, reconfigurable materials.', category: 'Publication Highlight', image: 'https://picsum.photos/seed/hl1/800/400', link: 'https://doi.org/10.1089/soro.2023.01440' },
  { display_order: 2, title: 'Flexible Electrical Energy Storage', description: 'We developed a variable stiffness electrical energy storage structure, a significant advancement for soft robotics and wearable electronics, featured in Soft Robotics.', category: 'Publication Highlight', image: 'https://picsum.photos/seed/hl2/800/400', link: 'https://doi.org/10.1089/soro.2024.0098' },
  { display_order: 3, title: 'E-Morph: A New Adaptive Actuator', description: 'Our novel electrically controlled composite, E-Morph, was introduced in IEEE Robotics and Automation Letters as a new type of adaptive actuator for soft robotics applications.', category: 'Publication Highlight', image: 'https://picsum.photos/seed/hl3/800/400', link: 'https://doi.org/10.1109/LRA.2022.3189169' },
  { display_order: 4, title: 'Stretchable Structures with Liquid Metal', description: 'This ongoing project, funded by the Excellence Initiative Research University, focuses on developing innovative stretchable structures with liquid metal for next-generation soft robotics and wearables.', category: 'Project Highlight', image: 'https://picsum.photos/seed/hl4/800/400', link: '#projects' },
  { display_order: 5, title: 'Advanced Wearable Sensors', description: 'Our team has developed a new generation of flexible, skin-like sensors for monitoring physiological signals with unprecedented accuracy, featured in a recent tech showcase.', category: 'Technology Showcase', image: 'https://picsum.photos/seed/hl5/800/400', link: '#' },
  { display_order: 6, title: 'Laser-Induced Graphene Pathways', description: 'We have perfected a method for creating highly conductive graphene circuits directly on polymer substrates using a simple laser engraving process, paving the way for low-cost, flexible electronics.', category: 'Research Milestone', image: 'https://picsum.photos/seed/hl6/800/400', link: '#' }
];

const historyMilestones = [
  { year: 2010, title: 'Lab Founded', description: 'The SMaRT-Lab was established at Warsaw University of Technology with a core team and a vision to push the boundaries of soft robotics and smart materials research.', image: 'https://picsum.photos/seed/hist1/600/400', image_alt: 'An empty but hopeful laboratory space' },
  { year: 2012, title: 'First Research Grant', description: 'Received first major research grant from the Excellence Initiative programme at WUT, enabling expansion of lab equipment and team.', image: 'https://picsum.photos/seed/hist2/600/400', image_alt: 'A person signing a formal document or grant paper' },
  { year: 2015, title: 'Breakthrough in Granular Jamming', description: 'Published a seminal paper on variable-stiffness mechanisms using vacuum-packed particles, establishing a new direction in smart structure research.', image: 'https://picsum.photos/seed/hist3/600/400', image_alt: 'Abstract visualization of granular material' },
  { year: 2018, title: 'New Optical Microscopy Lab', description: 'Opened the new Optical Microscopy and Electro-magnetic Measurements Laboratory (1.4A), housing the Magcam 3D magnetic field scanner and Leica M205A stereo-microscope.', image: 'https://picsum.photos/seed/hist4/600/400', image_alt: 'A modern, newly built laboratory facility' },
  { year: 2021, title: 'E-Morph Innovation', description: 'Introduced the E-Morph concept — an electrically controlled composite enabling shape change — published in IEEE Robotics and Automation Letters.', image: 'https://picsum.photos/seed/hist5/600/400', image_alt: 'Soft robotic actuator demonstrating E-Morph technology' },
  { year: 2024, title: 'Liquid Metal Research Milestone', description: 'Published landmark research on programmable shape-shifting structures using liquid metal electromagnetic actuators in Soft Robotics journal.', image: 'https://picsum.photos/seed/hist6/600/400', image_alt: 'An abstract representation of liquid metal technology' },
  { year: new Date().getFullYear(), title: 'Present Day', description: 'Continuing to innovate and push the boundaries of soft robotics and intelligent materials, with active projects in wearable electronics and flexible energy storage.', image: null, image_alt: null }
];

// ─────────────────────────────────────────────────
// Seed functions
// ─────────────────────────────────────────────────

async function seedTable(tableName, data) {
  console.log(`\nSeeding ${tableName}...`);
  // Delete existing data first
  const { error: delErr } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) console.warn(`  Warning during delete: ${delErr.message}`);
  
  const { data: inserted, error } = await supabase.from(tableName).insert(data).select();
  if (error) {
    console.error(`  ERROR inserting into ${tableName}:`, error.message, error.details, error.hint);
    return false;
  }
  console.log(`  ✓ Inserted ${inserted?.length ?? 0} rows into ${tableName}`);
  return true;
}

async function main() {
  console.log('SMaRT-Lab Supabase Seed Script');
  console.log('================================');
  
  await seedTable('news_items', newsItems);
  await seedTable('research_highlights', researchHighlights);
  await seedTable('history_milestones', historyMilestones);
  
  console.log('\nDone!');
}

main().catch(console.error);
