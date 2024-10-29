<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { Log } from '$lib';

  onMount(() => {
    // Extract the search parameters from the current URL
    const urlParams = new URLSearchParams(window.location.search);
    let rawURL: string = urlParams.get('q'); // Get the rawURL from the query parameter

    if (rawURL) {
      // cache bust
      rawURL += (rawURL.includes('?') ? '&' : '?') + `cacheBust=${Date.now()}`;
      fetch(rawURL)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text(); // Fetch the response text
        })
        .then(data => {
          sessionStorage.setItem('importRequestFile', JSON.stringify([{ name: 'raw_content', content: data }]));
          window.location.href = `${base}/`; // Redirect after loading the content
        })
        .catch(error => {
          Log.error('Error fetching script:', error);
        });
    }
  });
</script>