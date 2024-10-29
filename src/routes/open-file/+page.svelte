<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let fileContentTest = 'foo';
  let filenameTest = 'bar';

  onMount(() => {
    console.log('baz');
    window.addEventListener('launch', (event) => {
      console.log('baz+');
      const files = event.files;

      if (files.length > 0) {
        console.log('baz++');
        const file = files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          console.log('baz+++');
          const fileContent = e.target.result; // This contains the file content as a string
          console.log("FILE", file.name);
          console.log("FILE", fileContent);
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