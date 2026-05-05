import PocketBase from 'pocketbase';

// Provide your PocketBase URL here. 
// For local development, it's typically http://127.0.0.1:8090
const pbUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);
