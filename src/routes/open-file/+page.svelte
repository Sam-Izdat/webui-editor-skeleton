<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from "$app/environment";
  import { Log } from '$lib';

  onMount(() => {
    if (browser) {
      const reader = new FileReader();
      if ("launchQueue" in window) {
        launchQueue.setConsumer(async (launchParams) => {
          let fileHandle;
          for (const file of launchParams.files) {
            fileHandle = await file.getFile();

            reader.onload = (event) => {
              const data = event.target?.result; 
              sessionStorage.setItem('importRequestFile', JSON.stringify([{ name: 'file_content', content: data }]));
              window.location.href = `${base}/`;
            };

            reader.onerror = (error) => {
              Log.error('Error reading file:', error);
              Log.toastError('error reading file');
            };

            reader.readAsText(fileHandle);
          }
        });
      }
    }
  });
</script>