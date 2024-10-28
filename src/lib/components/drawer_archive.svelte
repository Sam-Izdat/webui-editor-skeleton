<script lang="ts">
  export let deleteDocCallback = () => {};
  export let loadDocCallback = () => {};


  import * as ds from '$lib/stores/doc_session';
  import type DocumentSession from '$lib/doc_types';

  export let isDrawerOpen = false;
  import { savedDocuments } from '$lib/stores';

  // Icons
  import { Icon } from 'svelte-hero-icons';
  import * as hero from 'svelte-hero-icons';
  import { CustomIcon } from '$lib/components/icons';
  import * as ico from '$lib/components/icons';
</script>




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
                <tr><td class="px-0 m-0 border-b border-primary-800/30">
                  <button 
                    class="btn flex justify-start items-center bg-surface-500/15 rounded gap-3 mx-0 my-1 px-2 py-1 w-full"
                    on:click={ () => { loadDocCallback(doc.docID); }}
                  >
                    <div class="placeholder w-16 h-12 rounded" />
                    <div class="flex flex-col items-start w-64">
                      <span class="text-sm font-regular truncate overflow-hidden text-ellipsis whitespace-nowrap text-left">
                        {doc.docName}
                      </span>
                      <span class="badge bg-tertiary-500/25 text-xs m-1 p-1 w-min h-min">
                        {doc.versionCount} {doc.versionCount > 1 ? 'versions' : 'version' }
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
                    }).format(new Date(doc.dateSaved))}
                    </p>
                </td>
                <td class="px-0 m-0 border-b border-primary-800/30">
                    


                  <div class="flex flex-row items-center p-1 w-min">
                    <button 
                      title="Delete" 
                      class="btn m-1 py-2 px-2 variant-ghost-error" 
                      on:click={ () => { deleteDocCallback(doc.docID); }}
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


