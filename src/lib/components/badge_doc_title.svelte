<script lang="ts">
  import { isDark } from '$lib/stores';
  import { 
    uuidToPrimaryColorDark, 
    uuidToComplimentaryColorDark, 
    uuidToPrimaryColorDarkAlt, 
    uuidToPrimaryColorLight, 
    uuidToComplimentaryColorLight,
    uuidToPrimaryColorLightAlt, 
  } from '$lib';
  import { Log } from '$lib';
  import * as km from '$lib/keymap';
  import * as ds from '$lib/stores/doc_session'; 

  $: session = ds.documentSession;

  export let renameCallback = () => {};
  export let switchVersionCallback = (v: number) => {};  
  import { 
    Icon, 
    ChevronLeft,
    ChevronRight,
    ArrowUturnLeft, // revert   
  } from "svelte-hero-icons";

  import {
    Fork
  } from '$lib/components/icons';

  import { popup } from '@skeletonlabs/skeleton';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
  let valueCBVersion: string;

  $: primColorDark    = $session.unsavedChanges ? uuidToPrimaryColorDarkAlt($session.docID)  : uuidToPrimaryColorDark($session.docID);
  $: primColorLight   = $session.unsavedChanges ? uuidToPrimaryColorLightAlt($session.docID) : uuidToPrimaryColorLight($session.docID);
  $: compColorDark    = uuidToComplimentaryColorDark($session.docID);
  $: compColorLight   = uuidToComplimentaryColorLight($session.docID);
  const popupCBVersion: PopupSettings = {
    event: 'click',
    target: 'popup_doc_version',
    placement: 'bottom',
    closeQuery: '.listbox-item'
  };
  let getBorder = () => $session.unsavedChanges ? {primColorDark} : 'rgba(0,0,0,0)';

  $: savedStatusClasses = $session.unsavedChanges ? 'border-l-2 !border-primary-500/25' : '';
</script>

{#if $isDark}
<div class="shadow-[0_2px_6px_rgba(0,0,0,0.4)] p-0 m-1 inline-block {savedStatusClasses}">
  <button 
    title="Rename (alt+{km.keyRenameDoc})" 
    class="badge m-0 p-2 relative inline-block truncate overflow-hidden text-ellipsis whitespace-nowrap text-left max-w-80" 
    on:click={renameCallback} 
    style="
      background-color: {primColorDark}; 
      box-shadow: inset 3px 2px 22px {compColorDark}; 
      border-image-slice: 1;
      border-width: 2px;
      border-image-source: linear-gradient(to left, {primColorDark}, {compColorDark});
    ">
    <span class="drop-shadow-[0_0_2px_rgba(0,0,0,1.0)]">
      {$session.docName}
    </span>
  </button> 
</div>
{:else}
<div class="shadow-[0_2px_6px_rgba(1,0,0,0.4)] p-0 m-1 inline-block {savedStatusClasses}">
  <button 
    title="Rename (alt+{km.keyRenameDoc})" 
    class="badge m-0 p-2 relative inline-block truncate overflow-hidden text-ellipsis whitespace-nowrap text-left max-w-80" 
    on:click={renameCallback} style="
      background-color: {primColorLight}; 
      box-shadow: inset 3px 2px 22px {compColorLight}; 
      border-image-slice: 1;
      border-width: 2px;
      border-image-source: linear-gradient(to left, {primColorLight}, {compColorLight});
    ">
    <span>
      {$session.docName}
    </span>
  </button> 
</div>
{/if}
<button 
  title="Switch version (alt+{km.keySwitchDocVersion})" 
  class="badge bg-surface-50-900-token m-1 p-2 relative inline-block border-2 border-secondary-900/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"  
  use:popup={popupCBVersion}
>
  v{$session.versionActive}
</button>
<div class="card w-fit shadow-xl py-2 max-h-36 overflow-y-auto overflow-x-hidden" data-popup="popup_doc_version">
  <ListBox rounded="rounded-none" padding="px-4 py-1 text-sm">
    {#each Array.from({ length: $session.versionCount}, (_, i) => i + 1) as n, i}
    <ListBoxItem 
      name='version' 
      value={$session.versionCount-1-i}
      bind:group={valueCBVersion} 
      on:change={() => { switchVersionCallback(valueCBVersion); valueCBVersion = null; } }
    >
      v{$session.versionCount-1-i}
    </ListBoxItem>
    {/each}
  </ListBox>
</div>