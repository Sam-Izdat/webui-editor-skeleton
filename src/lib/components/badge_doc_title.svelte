<script lang="ts">
  import { darkModeStore, observeThemeChange } from '$lib/stores/dark_mode';
  import { uuidToPrimaryColorDark, uuidToComplimentaryColorDark, uuidToPrimaryColorLight, uuidToComplimentaryColorLight } from '$lib';
  export let session;
</script>
{#if $darkModeStore}
<span class="badge m-1 p-2 relative inline-block border-2 border-primary-900/30" style="
    background-color: {uuidToPrimaryColorDark(session.id)}; 
    box-shadow: inset 3px 2px 18px {uuidToComplimentaryColorDark(session.id)}; 
  ">
  <span class="drop-shadow-[0_0_2px_rgba(0,0,0,1.0)]">
    {session.name}{#if session.unsavedChanges}&nbsp;*{/if}
  </span>
</span> 
{:else}
<span class="badge m-1 p-2 relative inline-block border-2 border-primary-500/30" style="
    background-color: {uuidToPrimaryColorLight(session.id)}; 
    box-shadow: inset 3px 2px 18px {uuidToComplimentaryColorLight(session.id)}; 
  ">
  <span>
    {session.name}{#if session.unsavedChanges}&nbsp;*{/if}
  </span>
</span> 
{/if}