
const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'admin@smartlab.simr.pw.edu.pl';
const ADMIN_PASSWORD = 'admin123456';

async function seed() {
  console.log('Authenticating...');
  const authRes = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });

  if (!authRes.ok) {
    console.error('Auth failed');
    return;
  }

  const { token } = await authRes.json();
  console.log('Authenticated successfully');

  const collections = {
    news_items: [
      {
        title: 'SMaRT-Lab Presents at International Soft Robotics Conference 2025',
        content: '<p>Our team presented groundbreaking research on liquid metal electromagnetic actuators at the premier soft robotics conference in Zurich.</p>',
        date: '2025-11-15T00:00:00Z',
        author: 'Dr. P. Bartkowski',
        location: 'Zurich, Switzerland',
        imageUrl: 'https://picsum.photos/seed/news1/800/400',
        type: 'news'
      },
      {
        title: 'New Publication in Soft Robotics Journal',
        content: '<p>We are thrilled to announce our latest publication: Flexible Electrical Energy Storage Structure with Variable Stiffness.</p>',
        date: '2025-09-03T00:00:00Z',
        author: 'Ł. Pawliszak',
        imageUrl: 'https://picsum.photos/seed/news2/800/400',
        type: 'news'
      }
    ],
    team_members: [
      { first_name: 'Piotr', last_name: 'Bartkowski DSc', role: 'Principal Investigator', bio: 'Piotr Bartkowski attained his MSc in 2015...', image_url: '/img/team/piotr_bartkowski.jpg', is_active: true, display_order: 1 },
      { first_name: 'Łukasz', last_name: 'Pawliszak MSc', role: 'Senior Investigator', bio: 'Łukasz Pawliszak attained his BSc in 2013...', image_url: '/img/team/lukasz_pawliszak.jpg', is_active: true, display_order: 2 },
      { first_name: 'Agata', last_name: 'Lusawa MSc', role: 'Researcher', bio: 'Agata Lusawa attained her BSc degree...', image_url: '/img/team/agata_lusawa.jpg', is_active: true, display_order: 3 },
      { first_name: 'Sabina', last_name: 'Sypniewska BSc', role: 'Research Assistant', bio: 'Sabina Sypniewska attained her BSc degree...', image_url: '/img/team/sabina_sypniewska.jpg', is_active: true, display_order: 4 }
    ],
    projects: [
      { title: 'Development of innovative stretchable structures', status: 'ongoing', funding_source: 'IDUB PW', start_date: '2024-01-01T00:00:00Z' },
      { title: 'Air-morph: a pneumatically controlled composite', status: 'ongoing', funding_source: 'POB Material Technologies', start_date: '2024-01-01T00:00:00Z' }
    ],
    publications: [
      { title: 'Programmable Shape-Shifting Soft Robotic Structure', authors: ['P. Bartkowski', 'Ł. Pawliszak'], journal: 'Soft Robotics', year: 2024, doi: '10.1089/soro.2023.01440' },
      { title: 'E-Morph as a New Adaptive Actuator', authors: ['P. Bartkowski', 'F. Gawiński'], journal: 'IEEE Robotics and Automation Letters', year: 2022, doi: '10.1109/LRA.2022.3189169' }
    ],
    history_milestones: [
      { year: 2010, title: 'Lab Founded', description: 'The SMaRT-Lab was established at Warsaw University of Technology.', type: 'research' },
      { year: 2018, title: 'Facility Expansion', description: 'Opened the new Optical Microscopy and Electro-magnetic Measurements Laboratory.', type: 'facility' }
    ],
    research_highlights: [
      { display_order: 1, title: 'Programmable Shape-Shifting Structures', category: 'Publication Highlight', description: 'Our groundbreaking work on soft robotic structures...', image_url: 'https://picsum.photos/seed/hl1/800/400' },
      { display_order: 2, title: 'Flexible Electrical Energy Storage', category: 'Publication Highlight', description: 'We developed a variable stiffness electrical energy storage structure...', image_url: 'https://picsum.photos/seed/hl2/800/400' }
    ],
    group_photos: [
      { year: 2026, image_url: '/img/groups/group_2026.jpg' },
      { year: 2024, image_url: '/img/groups/group_2024.jpg' }
    ]
  };

  for (const [colName, records] of Object.entries(collections)) {
    console.log(`Seeding ${colName}...`);
    
    // Clear existing
    const listRes = await fetch(`${POCKETBASE_URL}/api/collections/${colName}/records?perPage=500`, {
      headers: { 'Authorization': token }
    });
    if (listRes.ok) {
      const { items } = await listRes.json();
      for (const item of items) {
        await fetch(`${POCKETBASE_URL}/api/collections/${colName}/records/${item.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': token }
        });
      }
    }

    // Insert new
    for (const record of records) {
      const res = await fetch(`${POCKETBASE_URL}/api/collections/${colName}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(record)
      });
      if (!res.ok) {
        console.error(`  Failed to seed ${colName}:`, await res.text());
      }
    }
    console.log(`  ✓ ${colName} seeded.`);
  }

  console.log('Done!');
}

seed().catch(console.error);
