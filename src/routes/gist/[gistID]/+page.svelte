<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { Log } from '$lib';
  import { get } from 'svelte/store';

  onMount(() => {
    const { gistID } = get(page).params; // Extract the gistID from the route parameters

    if (gistID) {
      // cache bust
      let rawURL: string = `https://api.github.com/gists/${gistID}`;
      rawURL += (rawURL.includes('?') ? '&' : '?') + `cacheBust=${Date.now()}`;
      fetch(rawURL)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(gist => {
          const firstEntry = Object.entries(gist.files)[0];
          const [firstKey, firstValue] = firstEntry ?? [];
          return firstValue.content;
        })
        .then(data => {
          sessionStorage.setItem('importRequestFile', JSON.stringify([{ name: 'gist_content', content: data }]));
          Log.info('Gist content loaded:', data);
          window.location.href = `${base}/`;
        })
        .catch(error => {
          Log.error('Error fetching Gist:', error);
        });
    }
  });
</script>