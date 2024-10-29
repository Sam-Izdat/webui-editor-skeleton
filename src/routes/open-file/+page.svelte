<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  $: fileContentTest = '';
  $: filenameTest = '';

  onMount(() => {
    window.addEventListener('launch', (event) => {
      const files = event.files;

      // Dumbest way:
      // sessionStorage.setItem('activeFile', JSON.stringify(files));

      // More robust:
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const fileContent = e.target.result; // This contains the file content as a string
          fileNameTest = file.name;
          fileContentTest = fileContent;
          sessionStorage.setItem('activeFile', JSON.stringify([{ name: file.name, content: fileContent }]));
        };
        
        reader.readAsText(file);
      }

      //window.location.href = `${base}/`;
    });
  });
</script>

<div>
  {filenameTest}
</div>
<div>
  {fileContentTest}
</div>