/**
 * Seed news_items into Supabase
 */
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const sb = createClient(
  'https://wmmbswlajfwahiaadtxc.supabase.co',
  'sb_publishable_xFVcgTS2Gb0750W2WQjENA_4ufhJaJF'
);

const newsItems = [
  { id: randomUUID(), title: 'SMaRT-Lab Presents at International Soft Robotics Conference 2025', content: '<p>Our team presented groundbreaking research on liquid metal electromagnetic actuators at the premier soft robotics conference in Zurich. Dr. Bartkowski delivered a keynote on programmable shape-shifting structures, drawing considerable interest from the research community.</p>', date: '2025-11-15', author: 'Dr. P. Bartkowski', location: 'Zurich, Switzerland', imageUrl: 'https://picsum.photos/seed/news1/800/400', imageId: null },
  { id: randomUUID(), title: 'New Publication in Soft Robotics Journal: Flexible Energy Storage Breakthrough', content: '<p>We are thrilled to announce our latest publication: <em>Flexible Electrical Energy Storage Structure with Variable Stiffness for Soft Robotics and Wearable Electronics</em>, published in the prestigious <strong>Soft Robotics</strong> journal.</p>', date: '2025-09-03', author: 'Ł. Pawliszak', location: null, imageUrl: 'https://picsum.photos/seed/news2/800/400', imageId: null },
  { id: randomUUID(), title: 'SMaRT-Lab Welcomes New Research Assistant — Zofia Nowicka', content: '<p>We are delighted to welcome Zofia Nowicka to the SMaRT-Lab team. Zofia recently defended her BSc thesis at the Warsaw University of Technology with distinction, and her research interests focus on sensor technology and wearable electronics.</p>', date: '2025-05-20', author: 'SMaRT-Lab Team', location: 'Warsaw, Poland', imageUrl: 'https://picsum.photos/seed/news3/800/400', imageId: null },
  { id: randomUUID(), title: 'Excellence Initiative Grant Renewed for Liquid Metal Project', content: '<p>We are pleased to announce that our flagship project, <em>Development of innovative stretchable structures based on liquid metal for applications in soft robotics and wearable electronics</em>, has received renewed funding from the IDUB Excellence Initiative at Warsaw University of Technology.</p>', date: '2025-03-10', author: 'Dr. P. Bartkowski', location: 'Warsaw, Poland', imageUrl: 'https://picsum.photos/seed/news4/800/400', imageId: null },
  { id: randomUUID(), title: 'New Publication in Archives of Civil and Mechanical Engineering', content: '<p>Our collaborative paper, <em>Granular Jamming for Soft Robotics: Experiments and Modelling of Cyclic Loading</em>, has been published in the <strong>Archives of Civil and Mechanical Engineering</strong> (Impact Factor 4.4).</p>', date: '2025-01-22', author: 'P. Bartkowski et al.', location: null, imageUrl: 'https://picsum.photos/seed/news5/800/400', imageId: null },
  { id: randomUUID(), title: 'SMaRT-Lab Partners with Leica Microsystems for Advanced Optical Research', content: '<p>We have formalized a research partnership with Leica Microsystems to expand our optical microscopy capabilities. The collaboration gives our team access to cutting-edge optical instruments and software for micro-manipulation and material characterization studies.</p>', date: '2024-10-05', author: 'SMaRT-Lab Team', location: 'Warsaw, Poland', imageUrl: 'https://picsum.photos/seed/news6/800/400', imageId: null }
];

async function main() {
  // Clean test entry if present
  await sb.from('news_items').delete().eq('title', 'Test');
  
  const { data, error } = await sb.from('news_items').insert(newsItems).select();
  if (error) {
    console.error('Error:', error.message, error.details);
  } else {
    console.log(`✓ Inserted ${data?.length ?? 0} news items`);
  }
}

main().catch(console.error);
