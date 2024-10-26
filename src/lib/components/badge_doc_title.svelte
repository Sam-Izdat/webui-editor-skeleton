<script lang="ts">
  import { isDark } from '$lib/stores';
  import { uuidToPrimaryColorDark, uuidToComplimentaryColorDark, uuidToPrimaryColorLight, uuidToComplimentaryColorLight } from '$lib';
  import { Log } from '$lib';
  import * as km from '$lib/keymap';
  export let session;
  export let renameCallback = () => {};
  export let switchVersionCallback = () => {};  
  export let switchVersionMenuCallback = () => {};  
  import { 
    Icon, 
    ChevronLeft,
    ChevronRight,
  } from "svelte-hero-icons";

  import { popup } from '@skeletonlabs/skeleton';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
  let comboboxValue: string;

  $: primColorDark    = uuidToPrimaryColorDark(session.docID);
  $: compColorDark    = uuidToComplimentaryColorDark(session.docID);
  $: primColorLight   = uuidToPrimaryColorLight(session.docID);
  $: compColorLight   = uuidToComplimentaryColorLight(session.docID);
  const popupCombobox: PopupSettings = {
    event: 'click',
    target: 'popupCombobox',
    placement: 'bottom',
    closeQuery: '.listbox-item'
  };
</script>

{#if $isDark}
<div class="shadow-[0_2px_6px_rgba(1,0,0,0.4)] p-0 m-1 inline-block" style="">
  <button 
    title="Rename (alt+{km.keyRenameDoc})" 
    class="badge m-0 p-2 relative inline-block" on:click={renameCallback} 
    style="
      background-color: {primColorDark}; 
      box-shadow: inset 3px 2px 22px {compColorDark}; 
      border-image-slice: 1;
      border-width: 2px;
      border-image-source: linear-gradient(to left, {primColorDark}, {compColorDark});
    ">
    <span class="drop-shadow-[0_0_2px_rgba(0,0,0,1.0)]">
      {session.docName}{#if session.unsavedChanges}&nbsp;*{/if}
    </span>
  </button> 
</div>
{:else}
<div class="shadow-[0_2px_6px_rgba(1,0,0,0.4)] p-0 m-1 inline-block" style="">
  <button 
    title="Rename (alt+{km.keyRenameDoc})" 
    class="badge m-0 p-2 relative inline-block" 
    on:click={renameCallback} style="
      background-color: {primColorLight}; 
      box-shadow: inset 3px 2px 22px {compColorLight}; 
      border-image-slice: 1;
      border-width: 2px;
      border-image-source: linear-gradient(to left, {primColorLight}, {compColorLight});
    ">
    <span>
      {session.docName}{#if session.unsavedChanges}&nbsp;*{/if}
    </span>
  </button> 
</div>
{/if}
<!-- <button 
  title="Previous version" 
  class="badge m-1 {session.versionActive > 0 ? 'variant-ghost-primary' : 'variant-soft-primary'}"
  on:click={() => {
    if (session.versionActive > 0) {
      switchVersionCallback(session.versionActive+1);
    } else {
      Log.toastInfo('this is the first version');
    }
  }}
>
  <Icon src="{ChevronLeft}" size="16" style="margin: 2px auto;" solid/>
</button>  -->
<!-- <button class="btn variant-filled w-48 justify-between">
  <span class="capitalize">{comboboxValue ?? 'Trigger'}</span>
  <span>↓</span>
</button> -->
<!-- on:click={switchVersionMenuCallback}  -->
<button 
  title="Switch version (alt+{km.keySwitchDocVersion})" 
  class="badge bg-surface-50-900-token m-1 p-2 relative inline-block border-2 border-secondary-900/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"  
  use:popup={popupCombobox}
>
  v{session.versionActive}
</button>
<div class="card w-20 shadow-xl py-2 max-h-32 overflow-y-auto overflow-x-hidden" data-popup="popupCombobox">
  <ListBox rounded="rounded-none" padding="px-4 py-1 text-sm">
    {#each Array.from({ length: session.versionCount+12 }, (_, i) => i + 1) as n, i}
    <ListBoxItem bind:group={comboboxValue} name="version" value="v{session.versionCount+12-1-i}">v{session.versionCount+12-1-i}</ListBoxItem>
    {/each}
  </ListBox>
  <div class="arrow bg-surface-100-800-token" />
</div>
          
<!-- <button 
  title="Next version" 
  class="badge m-1 {session.versionActive < (session.versionCount - 1) ? 'variant-ghost-primary' : 'variant-soft-primary'}"
  on:click={() => {
    if (session.versionActive < (session.versionCount - 1)) {
      switchVersionCallback(session.versionActive+1);
    } else {
      Log.toastInfo('this is the last version');
    }
  }}
>
  <Icon src="{ChevronRight}" size="16" style="margin: 2px auto;" solid/>
</button>  -->