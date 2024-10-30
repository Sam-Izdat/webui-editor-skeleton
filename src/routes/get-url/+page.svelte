<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { Log } from '$lib';
  import { ScreenFailedFetch } from '$lib/components';

  $: failed = false;
  $: url = '';

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let rawURL: string = urlParams.get('q');
    
    const reqView       = urlParams.get('view');
    const reqAutoBuild  = urlParams.get('autobuild');
    const reqReadOnly   = urlParams.get('readonly');

    if (rawURL) {
      // cache bust
      rawURL += (rawURL.includes('?') ? '&' : '?') + `cacheBust=${Date.now()}`;
      fetch(rawURL)
        .then(response => {
          if (!response.ok) {
            failed = true;
            url = urlParams.get('q');
            Log.error('Network response was not ok');
          }
          return response.text(); 
        })
        .then(data => {
          sessionStorage.setItem('importRequestFile', JSON.stringify([{ name: 'raw_content', content: data }]));
          if (reqView !== null)       sessionStorage.setItem('importRequestView', reqView);
          if (reqAutoBuild !== null)  sessionStorage.setItem('importRequestAutoBuild', reqAutoBuild);
          if (reqReadOnly !== null)   sessionStorage.setItem('importRequestReadOnly', reqReadOnly);
          window.location.href = `${base}/`; 
        })
        .catch(error => {
          failed = true;
          url = urlParams.get('q');
          Log.error('Error fetching script:', error);
        });
    }
  });
</script>
{#if failed}
<ScreenFailedFetch url={url} />
{/if}