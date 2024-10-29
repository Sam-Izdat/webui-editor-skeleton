<script lang="ts">
  export let deleteDocCallback = () => {};
  export let loadDocCallback = () => {};
  export let saveDocCallback = () => {};
  export let saveDocNewVersionCallback = () => {};
  export let formAction = () => {}

  import * as ds from '$lib/stores/doc_session';
  import type DocumentSession from '$lib/doc_types';
  
  import { savedDocuments } from '$lib/stores';

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






  onMount(() => {
    if (browser){



          // -------------------------------------------------

          if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().then((persistent) => {
              if (persistent) {
                console.log("Storage will not be cleared except by explicit user action");
              } else {
                console.log("Storage may be cleared by the UA under storage pressure.");
              }
            });
          }


          const dbName = 'TestDB';
          const storeName = 'JunkStore';
          const chunkSize = 1024 * 1024 * 5; // 5 MB per chunk
          const totalSize = 1024 * 1024 * 15; // 15 MB
          let written = 0;

          function generateRandomData(size) {
              let randomData = '';
              for (let i = 0; i < size; i++) {
                  randomData += String.fromCharCode(Math.floor(Math.random() * 256));
              }
              return randomData;
          }

          // Create 5 MB of junk data
          const junk = generateRandomData(chunkSize);

          // Function to open or create an IndexedDB database
          function openDatabase() {
              return new Promise((resolve, reject) => {
                  const request = indexedDB.open(dbName, 1);
                  request.onupgradeneeded = (event) => {
                      const db = event.target.result;
                      db.createObjectStore(storeName, { autoIncrement: true });
                  };
                  request.onsuccess = (event) => resolve(event.target.result);
                  request.onerror = (event) => reject('Database error: ' + event.target.errorCode);
              });
          }

          // Function to write a single chunk to IndexedDB
          async function writeChunk(db) {
              return new Promise((resolve, reject) => {
                  const transaction = db.transaction(storeName, 'readwrite');
                  const store = transaction.objectStore(storeName);
                  store.add(junk);

                  transaction.oncomplete = () => resolve();
                  transaction.onerror = (event) => reject('Transaction error: ' + event.target.error);
              });
          }

          // Function to write all chunks to IndexedDB
          async function writeToIndexedDB() {
              const db = await openDatabase();
              while (written < totalSize) {
                  try {
                      await writeChunk(db);
                      written += chunkSize;
                      document.getElementById('status').textContent = `Written: ${(written / (1024 * 1024)).toFixed(2)} MB`;
                  } catch (error) {
                      console.error('Error writing chunk:', error);
                      break;
                  }
              }
              document.getElementById('status').textContent = '15 MB written to IndexedDB';
          }

          // Function to request persistent storage
          async function requestPersistentStorage() {
              if ('storage' in navigator) {
                  try {
                      const persisted = await navigator.storage.persist();
                      console.log(persisted);
                      if (persisted) {
                          console.log('Storage is now persistent.');
                      } else {
                          console.log('Storage is not persistent.');
                      }
                  } catch (error) {
                      console.error('Error requesting persistent storage:', error);
                  }
              } else {
                  console.warn('StorageManager API not supported.');
              }
          }

          // Start process
          document.getElementById('start').addEventListener('click', async () => {
              await requestPersistentStorage(); // Request persistent storage
              writeToIndexedDB(); // Start writing to IndexedDB
          });



          // -------------------------------------------------




      if ('showOpenFilePicker' in self) {
        // The `showOpenFilePicker()` method of the File System Access API is supported.
        fileSystemAccessSupported = true;
      } 
    }
  });
</script>
<div>
fileSystemAccessSupported? {fileSystemAccessSupported ? 'Yes.' : "No."}
</div>



    <h1>IndexedDB Storage Test</h1>
    <button id="start">Write 15 MB to IndexedDB</button>
    <div id="status"></div>



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
        on:input={() => { savedDocuments.set(ds.searchStoredSessions(inputValue)); } }
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
        {#each $savedDocuments as doc}
        <tr>
          <td class="px-0 m-0 border-b border-primary-800/30">
            <button 
              title={doc.docName ?? 'unknown'}
              class="btn flex justify-start items-center bg-surface-500/15 rounded gap-3 mx-0 my-1 px-2 py-1 w-full"
              on:click={ () => { loadDocCallback(doc.docID); }}
            >
              <div class="placeholder w-16 h-12 rounded" />
              <div class="flex flex-col items-start w-64">
                <span class="text-sm font-regular truncate overflow-hidden text-ellipsis whitespace-nowrap text-left max-w-96">
                  {doc.docName ?? 'unknown'}
                </span>
                <span class="badge bg-tertiary-500/25 text-xs m-1 p-1 w-min h-min">
                  {doc.versionCount ?? 'unknown'} {(doc.versionCount ?? 1) > 1 ? 'versions' : 'version' }
                </span>
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
                on:click={ () => { deleteDocCallback(doc.docID ?? 0); }}
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