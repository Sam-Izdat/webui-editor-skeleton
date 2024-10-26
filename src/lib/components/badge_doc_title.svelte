<script lang="ts">
  import { isDark } from '$lib/stores';
  import { uuidToPrimaryColorDark, uuidToComplimentaryColorDark, uuidToPrimaryColorLight, uuidToComplimentaryColorLight } from '$lib';
  import * as km from '$lib/keymap';
  export let session;
  export let renameCallback = () => {};
  export let switchVersionCallback = () => {};
</script>
{#if $isDark}
<button 
  title="Rename (alt+{km.keyRenameDoc})" 
  class="badge m-1 p-2 relative inline-block border-2 border-primary-900/30" on:click={renameCallback} 
  style="
    background-color: {uuidToPrimaryColorDark(session.docID)}; 
    box-shadow: inset 3px 2px 18px {uuidToComplimentaryColorDark(session.docID)}; 
  ">
  <span class="drop-shadow-[0_0_2px_rgba(0,0,0,1.0)]">
    {session.docName}{#if session.unsavedChanges}&nbsp;*{/if}
  </span>
</button> 
{:else}
<button 
  title="Rename (alt+{km.keyRenameDoc})" 
  class="badge m-1 p-2 relative inline-block border-2 border-primary-500/30" 
  on:click={renameCallback} style="
    background-color: {uuidToPrimaryColorLight(session.docID)}; 
    box-shadow: inset 3px 2px 18px {uuidToComplimentaryColorLight(session.docID)}; 
  ">
  <span>
    {session.docName}{#if session.unsavedChanges}&nbsp;*{/if}
  </span>
</button> 
{/if}
<button 
  title="Switch version (alt+{km.keySwitchDocVersion})" 
  class="badge bg-surface-50-900-token m-1 p-2 relative inline-block border-2 border-secondary-900/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
  on:click={switchVersionCallback}
>
  v{session.versionActive}
</button>