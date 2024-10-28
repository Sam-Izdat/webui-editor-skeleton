// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { APP_BASE_PATH } from './src/lib/globals.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/* @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html' // may differ from host to host
		})
	},
  prerender: {
			crawl: true,
			entries: process.env.BUILD_TYPE === 'static' 
				? ['/get-gist', '/get-url'] // Add your static routes here
				: [] // No entries for dynamic routes
		},
	extensions: ['.svelte'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],
	
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
	},	
    paths: {
      base: APP_BASE_PATH
    }
};
export default config;