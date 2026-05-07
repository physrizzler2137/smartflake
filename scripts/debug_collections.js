
const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'admin@smartlab.simr.pw.edu.pl';
const ADMIN_PASSWORD = 'admin123456';

async function debug() {
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
  
  console.log('Fetching collections...');
  const colRes = await fetch(`${POCKETBASE_URL}/api/collections?perPage=100`, {
    headers: { 'Authorization': token }
  });
  const collections = await colRes.json();
  console.log('Collections count:', collections.items.length);
  collections.items.forEach(c => console.log(`- ${c.name} (${c.id})`));

  console.log('\nChecking news_items records...');
  const newsRes = await fetch(`${POCKETBASE_URL}/api/collections/news_items/records`, {
    headers: { 'Authorization': token }
  });
  const news = await newsRes.json();
  console.log('News items count:', news.totalItems);
  if (news.items.length > 0) {
    console.log('First news item title:', news.items[0].title);
  }
}

debug();
