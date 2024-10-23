<script lang="ts">
  import { onMount } from 'svelte';

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
          sessionStorage.setItem('activeFile', JSON.stringify([{ name: file.name, content: fileContent }]));
        };
        
        reader.readAsText(file);
      }

      window.location.href = '../';
    });
  });
</script>