<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { Log } from '$lib';
  import { get } from 'svelte/store';

  onMount(() => {
    const { rawURL } = get(page).params;
    if (rawURL) {
      fetch(rawURL)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          Log.warning(response.text);
          return response.text();
        })
        .then(data => {
          sessionStorage.setItem('activeFile', JSON.stringify([{ name: 'raw_content', content: data }]));
          Log.info('script content loaded:', data); 
          window.location.href = `${base}/`;
        })
        .catch(error => {
          Log.error('Error fetching script:', error);
        });
    }
  });
</script>