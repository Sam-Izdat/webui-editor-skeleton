// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { APP_BASE_PATH } from './src/webui.config.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/* @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: 'index.html'
		}),
  	prerender: {
			crawl: true,
			entries: process.env.BUILD_TYPE === 'static' 
				? ['/', '/open-file', '/get-gist', '/get-url', '/gist/0', '/url/0'] // static routes here
				: [] // leave empty dynamic routes
		},
    paths: {
      base: APP_BASE_PATH
    },
    alias: {
    	'$root': './src/*'
    }
	},
	extensions: ['.svelte'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],
};
export default config;