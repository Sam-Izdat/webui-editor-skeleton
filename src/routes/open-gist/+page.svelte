<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { Log } from '$lib';

  onMount(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const gistUrl = params.get('raw_gist_url');

    if (gistUrl) {
      fetch(gistUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text(); // Use response.json() for JSON data
        })
        .then(data => {
          // Store the Gist content in sessionStorage
          sessionStorage.setItem('activeFile', JSON.stringify([{ name: 'gist_content', content: data }]));
          Log.info('Gist content loaded:', data); // Use the Gist content as needed
          window.location.href = `${base}/`;
        })
        .catch(error => {
          Log.error('Error fetching Gist:', error);
        });
    }
  });
</script>