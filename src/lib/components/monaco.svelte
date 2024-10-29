<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
  import { observeThemeChange } from '$lib/stores/dark_mode';
  import { createEventDispatcher } from 'svelte';
  import { isDark } from '$lib/stores';
  import { cfg } from '$root/webui.config.js';

  const dispatch = createEventDispatcher();

  // Monaco setup
  let editor: Monaco.editor.IStandaloneCodeEditor;
  let monaco: typeof Monaco;
  let editorContainer: HTMLElement;
  export let editorInstance;

  onMount(async () => {
    // Import monaco
    monaco = (await import('./monaco.ts')).default;

    observeThemeChange(monaco.editor);

    // Actual editor setup
    editorInstance = monaco.editor.create(editorContainer, {
      value: "",
      language: "c",
      minimap: {
        enabled: false,
      },
      tabSize: 2,
      automaticLayout: true,
      theme: $isDark ? 'vs-dark' : 'vs-light',
    });

    // Turn off mobile typing help bullshit, if any of it is on
    const monacoTextarea = document.querySelector('.monaco-editor textarea');
    monacoTextarea.setAttribute('autocomplete', 'off'); 
    monacoTextarea.setAttribute('autocorrect', 'off'); 
    monacoTextarea.setAttribute('autocapitalize', 'off');
    monacoTextarea.setAttribute('spellcheck', false);

    // Start the monaco engine, start new doc session
    const model = monaco.editor.createModel('', cfg.EDITOR_LANGUAGE);
    editorInstance.setModel(model);
    dispatch('init', editorInstance);  // Emit the initialized editor
  });

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
  });
</script>

<div id="editor-wrap" bind:this={editorContainer} />                