<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { Log } from '$lib';
  import { get } from 'svelte/store';
  import { ScreenFailedFetch } from '$lib/components';

  $: failed = false;
  $: url = '';

  onMount(() => {
    let { rawURL } = get(page).params;

    const urlParams = new URLSearchParams(window.location.search);

    const reqView       = urlParams.get('view');
    const reqAutoBuild  = urlParams.get('autobuild');
    const reqReadOnly   = urlParams.get('readonly');
    
    if (rawURL) {
      // cache bust
      let origURL = rawURL;
      rawURL += (rawURL.includes('?') ? '&' : '?') + `cacheBust=${Date.now()}`;
      fetch(rawURL)
        .then(response => {
          if (!response.ok) {
            failed = true;
            url = origURL;
            Log.error('Network response was not ok');
          }
          Log.warning(response.text);
          return response.text();
        })
        .then(data => {
          sessionStorage.setItem('importRequestFile', JSON.stringify([{ name: 'raw_content', content: data }]));
          if (reqView !== null)       sessionStorage.setItem('importRequestView', reqView);
          if (reqAutoBuild !== null)  sessionStorage.setItem('importRequestAutoBuild', reqAutoBuild);
          if (reqReadOnly !== null)   sessionStorage.setItem('importRequestReadOnly', reqReadOnly);
          Log.info('script content loaded:', data); 
          window.location.href = `${base}/`;
        })
        .catch(error => {
          failed = true;
          url = origURL;
          Log.error('Error fetching script:', error);
        });
    }
  });
</script>
{#if failed}
<ScreenFailedFetch url={url} />
{/if}