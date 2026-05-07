
const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'admin@smartlab.simr.pw.edu.pl';
const ADMIN_PASSWORD = 'admin123456';

async function restore() {
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

  const collections = [
    {
      name: 'news_items',
      type: 'base',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'text' },
        { name: 'date', type: 'date', required: true },
        { name: 'author', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'imageUrl', type: 'text' },
        { name: 'imageId', type: 'text' },
        { name: 'type', type: 'select', options: { values: ['news', 'event', 'announcement'], maxSelect: 1 } }
      ],
      listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: ""
    },
    {
      name: 'research_highlights',
      type: 'base',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'display_order', type: 'number' },
        { name: 'image_url', type: 'text' }
      ],
      listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: ""
    },
    {
      name: 'history_milestones',
      type: 'base',
      schema: [
        { name: 'year', type: 'number', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'type', type: 'select', options: { values: ['research', 'facility', 'team', 'publication'], maxSelect: 1 } },
        { name: 'image', type: 'text' }
      ],
      listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: ""
    },
    {
      name: 'team_members',
      type: 'base',
      schema: [
        { name: 'first_name', type: 'text', required: true },
        { name: 'last_name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'bio', type: 'text' },
        { name: 'image_url', type: 'text' },
        { name: 'image_url_hover', type: 'text' },
        { name: 'image_position', type: 'text' },
        { name: 'is_active', type: 'bool' },
        { name: 'end_year', type: 'number' },
        { name: 'display_order', type: 'number' }
      ],
      listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: ""
    },
    {
      name: 'group_photos',
      type: 'base',
      schema: [
        { name: 'year', type: 'number', required: true },
        { name: 'image_url', type: 'text', required: true },
        { name: 'image_position', type: 'text' }
      ],
      listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: ""
    },
    {
      name: 'projects',
      type: 'base',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'status', type: 'select', options: { values: ['ongoing', 'completed', 'planned'], maxSelect: 1 } },
        { name: 'funding_source', type: 'text' },
        { name: 'funding_source_url', type: 'text' },
        { name: 'start_date', type: 'date', required: true },
        { name: 'end_date', type: 'date' },
        { name: 'budget', type: 'number' }
      ],
      listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: ""
    },
    {
      name: 'publications',
      type: 'base',
      schema: [
        { name: 'year', type: 'number', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'authors', type: 'json', options: { maxSize: 2000000 } },
        { name: 'journal', type: 'text' },
        { name: 'doi', type: 'text' },
        { name: 'impact_factor', type: 'number' }
      ],
      listRule: "", viewRule: "", createRule: "", updateRule: "", deleteRule: ""
    }
  ];

  for (const col of collections) {
    console.log(`Creating collection: ${col.name}...`);
    const res = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(col)
    });
    
    if (res.ok) {
      console.log(`Collection ${col.name} created.`);
    } else {
      const err = await res.json();
      console.warn(`Collection ${col.name} failed:`, JSON.stringify(err, null, 2));
    }
  }

  // Seed some basic data for News
  console.log('Seeding news...');
  const newsRes = await fetch(`${POCKETBASE_URL}/api/collections/news_items/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': token },
    body: JSON.stringify({
      title: 'Welcome to SMaRT-Lab',
      content: '<p>The Smart Materials and Soft Robotics Laboratory is officially online.</p>',
      date: new Date().toISOString(),
      author: 'Admin',
      type: 'news'
    })
  });

  if (newsRes.ok) {
    console.log('News seeded.');
  } else {
    const err = await newsRes.json();
    console.warn('News seeding failed:', JSON.stringify(err, null, 2));
  }

  console.log('Done!');
}

restore();
