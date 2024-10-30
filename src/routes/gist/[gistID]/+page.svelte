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
    const { gistID } = get(page).params; // Extract the gistID from the route parameters

    const urlParams = new URLSearchParams(window.location.search);

    const reqView       = urlParams.get('view');
    const reqAutoBuild  = urlParams.get('autobuild');
    const reqReadOnly   = urlParams.get('readonly');

    if (gistID) {
      // cache bust
      let rawURL: string = `https://api.github.com/gists/${gistID}`;
      rawURL += (rawURL.includes('?') ? '&' : '?') + `cacheBust=${Date.now()}`;
      fetch(rawURL)
        .then(response => {
          if (!response.ok) {
            failed = true;
            url = `https://api.github.com/gists/${gistID}`;
            Log.error('Network response was not ok');
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
          if (reqView !== null)       sessionStorage.setItem('importRequestView', reqView);
          if (reqAutoBuild !== null)  sessionStorage.setItem('importRequestAutoBuild', reqAutoBuild);
          if (reqReadOnly !== null)   sessionStorage.setItem('importRequestReadOnly', reqReadOnly);
          Log.info('Gist content loaded:', data);
          window.location.href = `${base}/`;
        })
        .catch(error => {
          failed = true;
          url = `https://api.github.com/gists/${gistID}`;
          Log.error('Error fetching Gist:', error);
        });
    }
  });
</script>
{#if failed}
<ScreenFailedFetch url={url} />
{/if}