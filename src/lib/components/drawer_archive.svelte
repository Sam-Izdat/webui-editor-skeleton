<script lang="ts">
  export let deleteDocCallback = (uuid, adapter) => {};
  export let loadDocCallback = (uuid, adapter) => {};
  export let saveDocCallback = () => {};
  export let saveDocNewVersionCallback = () => {};
  export let formAction = () => {}

  import * as ds from '$lib/stores/doc_session';
  import type DocumentSession from '$lib/doc_types';
  
  import { docListStore } from '$lib/stores';
  import { get } from 'svelte/store';
  import { Log } from '$lib';

  let inputValue = '';

  import * as km from '$lib/keymap';

  // Icons
  import { Icon } from 'svelte-hero-icons';
  import * as hero from 'svelte-hero-icons';
  import { CustomIcon } from '$lib/components/icons';
  import * as ico from '$lib/components/icons';
  
  const isPWA: boolean            = window.matchMedia('(display-mode: standalone)').matches;
  const isStaticServer: boolean   = __BUILD_TYPE__ == 'static';
  const isStatic: boolean         = isPWA || isStaticServer;

  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { browser } from "$app/environment";


  $: fileSystemAccessSupported = false;
  $: persistentStorageAvailable = false;

  let checkStorageSupport = async () => {
    fileSystemAccessSupported = ('showOpenFilePicker' in self);
    persistentStorageAvailable = await navigator.storage.persist();
  };

  onMount(async () => {    
    if (browser) await checkStorageSupport();
  });


  import { getModalStore, getDrawerStore } from '@skeletonlabs/skeleton';
  const drawerStore = getDrawerStore();
</script>

<div class="flex justify-between items-center p-2 m-0 border border-primary-800/30 rounded shadow-xl">
  <div class="text-left pl-4">
      <h3 class="h3">Archive</h3>
  </div>
  <div class="flex justify-end">
      <button class="btn variant-ghost-primary" on:click={drawerStore.close}>Close</button>
  </div>
</div>

{#if !persistentStorageAvailable}
    <aside class="alert variant-ghost-warning">
        <div>
          <Icon src="{hero.ExclamationTriangle}" size="20" style="margin: 4px auto;" alt="Warning" solid/>
        </div>
        <div class="alert-message">
            <h5 class="h5">Warning: Storage Restricted</h5>
            <p class="text-sm">
              Failed to acquire browser permission for <code>IndexedDB</code> persistent storage! 
              <code>LocalStorage</code> is being used as fallback for safety. Total storage capacity may 
              be limited to ~5 MB. Any scripts below marked as still being in <code>IndexedDB</code> 
              storage are in danger of <em>potentially</em> being deleted by your browser, if and when
              it decides to do so. Back them up by manually exporting/downloading them to prevent data loss.
            </p>
        </div>
    </aside>
{/if}


<div class="overflow-x-auto flex p-1 items-center justify-center">
  <button 
    title="Save (alt+{km.keySaveDoc} / ctrl+{km.keySaveDoc})" 
    class="badge m-1 variant-ghost-primary" 
    on:click={saveDocCallback}
  >
    <Icon src="{hero.ArrowDownOnSquare}" size="16" style="margin: 2px auto;" solid/>
    <span class="hidden lg:inline ml-2">Save</span>
  </button> 
  <button 
    title="Save New Version (alt+{km.keySaveDocNewVersion})"
    class="badge m-1 variant-ghost-primary"
    on:click={saveDocNewVersionCallback}
  >
    <Icon src="{hero.ArrowDownOnSquareStack}" size="16" style="margin: 2px auto;" solid/>
    <span class="hidden lg:inline ml-2">Save New Version</span>
  </button>
</div>
<form on:submit|preventDefault={formAction}>
  <div class="card p-4 w-full text-token space-y-4">
    <label class="label text-sm">
      <input 
        class="input w-full m-1 p-1" 
        type="text" 
        bind:value={inputValue} 
        on:input={async () => { docListStore.set(await ds.searchStoredSessions(inputValue)); } } 
        placeholder='Search'
        on:focus={(e) => e.target.select()}
      />
    </label>
  </div>
</form>

<div class="flex flex-col w-full h-full">
  <div class="p-0">
      <table class="w-full text-left table-auto min-w-max">
      <thead>
        <tr>
          <th class="p-4 transition-colors cursor-pointer border-b border-primary-800/30">
            <span class="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-primary-700/60">
              Script Name
            </span>
          </th>
          <th class="p-4 transition-colors cursor-pointer border-b border-primary-800/30">
            <span class="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-primary-700/60">
            Last Save
            </span>
          </th>
          <th class="p-4 transition-colors cursor-pointer border-b border-primary-800/30">
          </th>
        </tr>
      </thead>
      <tbody>




        {#each $docListStore as doc}
        <tr>
          <td class="px-0 m-0 border-b border-primary-800/30">
            <button 
              title={doc.docName ?? 'unknown'}
              class="btn flex justify-start items-center bg-surface-500/15 rounded gap-3 mx-0 my-1 px-2 py-1 w-full"
              on:click={ async () => { await loadDocCallback(doc.docID, doc.adapter); }}
            >
              <div class="placeholder w-16 h-12 rounded" />
              <div class="flex flex-col items-start w-64">
                <div class="text-sm font-regular truncate overflow-hidden text-ellipsis whitespace-nowrap text-left max-w-96">
                  {doc.docName ?? 'unknown'}
                </div>
                <div>
                  <span class="badge bg-tertiary-500/25 text-xs m-1 p-1">
                    {doc.versionCount ?? 'unknown'} {(doc.versionCount ?? 1) > 1 ? 'versions' : 'version' }
                  </span>
                  <span class="badge bg-secondary-500/25 text-xs m-1 p-1">
                    {doc.adapter == 'idb' ? 'IndexedDB' : (doc.adapter == 'ls' ? 'LocalStorage' : 'unknown') }
                  </span>
                  {#if doc.adapter == 'idb' && !persistentStorageAvailable}
                  <span class="badge bg-error-500/50 text-xs m-1 p-1">
                    DATA LOSS RISK
                  </span>
                  {/if}
                </div>
              </div>
            </button>
          </td>
          <td class="px-2 border-b border-primary-800/30 text-center">
              <p class="text-xs">
              {new Intl.DateTimeFormat(navigator.language, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(doc.dateSaved ?? 'unknown'))}
              </p>
          </td>
          <td class="px-0 m-0 border-b border-primary-800/30">
            <div class="flex flex-row items-center p-1 w-min">
              <button 
                title="Delete" 
                class="btn m-1 py-2 px-2 variant-ghost-error" 
                on:click={ async () => { await deleteDocCallback(doc.docID ?? 0, doc.adapter); }}
              >
                <Icon src="{hero.XMark}" size="20" style="margin: 2px auto;" solid/>
              </button>
            </div>
          </td>
        </tr>
        {/each}





      </tbody>
      </table>
  </div>
</div>