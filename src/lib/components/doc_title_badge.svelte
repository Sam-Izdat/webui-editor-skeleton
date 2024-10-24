<script lang="ts">
  import uniqolor from 'uniqolor';
  import { darkModeStore, observeThemeChange } from '$lib/stores/dark_mode';
  // $: isDark = $darkModeStore;

  export let sessionID;
  export let sessionName;
</script>
{#if $darkModeStore}
<span class="badge m-1 relative inline-block border-2 border-primary-900/30" style="
      background-color: {uniqolor(sessionID, {lightness: 55, saturation: [35, 50]}).color}; 
      box-shadow: inset 3px 2px 18px {`#${(0xffffff^(+('0x'+uniqolor(sessionID, {lightness: 75, saturation: [60, 80]}).color.slice(1)))).toString(16).padStart(6, '0')}`}; 
    ">
  <span class="drop-shadow-[0_0_2px_rgba(0,0,0,1.0)]">{sessionName}</span>
</span> 
{:else}
<span class="badge m-1 relative inline-block border-2 border-primary-500/30" style="
      background-color: {uniqolor(sessionID, {lightness: 70, saturation: [50, 70]}).color}; 
      box-shadow: inset 3px 2px 18px {`#${(0xffffff^(+('0x'+uniqolor(sessionID, {lightness: 30, saturation: [50, 70]}).color.slice(1)))).toString(16).padStart(6, '0')}`}; 
    ">
  <span>{sessionName}</span>
</span> 
{/if}