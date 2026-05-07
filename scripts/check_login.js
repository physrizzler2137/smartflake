
const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'admin@smartlab.simr.pw.edu.pl';
const ADMIN_PASSWORD = 'admin123456';

async function checkLogin() {
  try {
    const authRes = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });

    if (authRes.ok) {
      console.log('LOGIN SUCCESSFUL');
    } else {
      const err = await authRes.json();
      console.log('LOGIN FAILED:', err);
    }
  } catch (e) {
    console.error('FETCH ERROR:', e.message);
  }
}

checkLogin();
