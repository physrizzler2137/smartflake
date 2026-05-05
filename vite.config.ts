import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { megaProxyPlugin } from './vite-mega-proxy';

export default defineConfig({
	plugins: [megaProxyPlugin(), sveltekit()]
});
