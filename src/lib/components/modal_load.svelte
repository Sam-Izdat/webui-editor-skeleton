<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
  import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
  import { 
    Icon, 
    CloudArrowDown,
    Folder,
    ArrowDownTray,
    Link,
    ExclamationTriangle,
    ArrowUpOnSquare,
    ArrowUpOnSquareStack,
    InformationCircle,
    Pencil,
    XMark,
  } from "svelte-hero-icons";

  import { getModalStore } from '@skeletonlabs/skeleton';

  import * as ds from '$lib/stores/doc_session';
  import type DocumentSession from '$lib/doc_types';

  // Props
  /** Exposes parent props to this component. */
  export let parent: SvelteComponent;
  const modalStore = getModalStore();

  const cButton: string           = 'fixed top-4 right-4 z-50 font-bold shadow-xl';
  const cBase: string             = 'card p-4 w-modal shadow-xl space-y-4';  

  const isPWA: boolean            = window.matchMedia('(display-mode: standalone)').matches;
  const isStaticServer: boolean   = __BUILD_TYPE__ == 'static';
  const isStatic: boolean         = isPWA || isStaticServer;
  let tabSet: number              = isStatic ? 1 : 0;

  const savedDocuments = ds.listStoredSessions();

  const strLoadRemotely = "Load from Web";
  const strLoadLocally  = "Load Locally";
  const strImportFile   = "Import File";
  const strImportRawURL = "Import External Resource";
</script>


{#if $modalStore[0]}
  <div class="{cBase}">

    <TabGroup>
      <Tab bind:group={tabSet} name="tab1" value={0}>
        <svelte:fragment slot="lead"><Icon src="{CloudArrowDown}" size="20" style="margin: 4px auto;" alt={strLoadRemotely} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Load from Web</span>
      </Tab>
      <Tab bind:group={tabSet} name="tab2" value={1}>
        <svelte:fragment slot="lead"><Icon src="{Folder}" size="20" style="margin: 4px auto;" alt={strLoadLocally} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Load Locally</span>
      </Tab>
      <Tab bind:group={tabSet} name="tab3" value={2}>
        <svelte:fragment slot="lead"><Icon src="{ArrowDownTray}" size="20" style="margin: 4px auto;" alt={strImportFile} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Import File</span>
      </Tab>
      <Tab bind:group={tabSet} name="tab3" value={3}>
        <svelte:fragment slot="lead"><Icon src="{Link}" size="20" style="margin: 4px auto;" alt={strImportRawURL} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Import External</span>
      </Tab>
      <svelte:fragment slot="panel">
        <div class="h-56 overflow-auto text-sm border border-primary-900/30 rounded">
        {#if tabSet === 0}
          <div class="card min-h-[100%] bg-surface-50-900-token shadow-inner divide-y divide-surface-400/10">
            <div class="flex justify-center p-1">
              <button disabled title="Publish" class="btn m-2 variant-soft-primary">
                <Icon src="{XMark}" size="20" style="margin: 2px auto;" solid/>
                <span>Browse</span>
              </button>
            </div>

            <Accordion>
              <AccordionItem open>
                <svelte:fragment slot="lead">
                  <Icon src="{InformationCircle}" size="20" style="margin: 4px auto;" alt={strLoadRemotely} solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strLoadRemotely}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p>Load scripts from the web.</p>
                  {#if isStaticServer}
                  <aside class="alert variant-soft-error p-1">
                    <div class="alert-message">Server-side storage is not currently available.</div>
                  </aside>
                  {/if}
                </svelte:fragment>
              </AccordionItem>
            </Accordion>
          </div>
        {:else if tabSet === 1}
          <div class="card min-h-[100%] bg-surface-50-900-token shadow-inner divide-y divide-surface-400/10">
            <div class="flex justify-center p-1">




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
              {#each savedDocuments as doc}
                <tr>
                <td class="px-0 m-0 border-b border-primary-800/30">
                    <div class="flex items-center gap-3 px-2">
                      <div class="placeholder w-16 h-12 rounded" />
                      <div class="flex flex-col w-64">
                          <span class="text-sm font-semibold truncate">
                          {doc.docName}
                          </span>
                          <span class="badge bg-primary-500/20 text-xs m-1 p-1 w-min h-min">
                          {doc.versionCount} {doc.versionCount > 1 ? 'versions' : 'version' }
                          </span>
                      </div>
                    </div>
                </td>
                <td class="px-0 m-0 border-b border-primary-800/30">
                    <p class="text-xs">
                    {new Intl.DateTimeFormat(navigator.language, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(doc.dateSaved))}
                    </p>
                </td>
                <td class="px-0 m-0 border-b border-primary-800/30">
                    


                  <div class="flex flex-col items-center p-1 w-min">
                    <button title="Load" class="btn m-1 py-1 px-2 variant-ghost-primary">
                      <Icon src="{ArrowUpOnSquare}" size="16" style="margin: 2px auto;" solid/>
                      <span class="text-xs">Load</span>
                    </button>
                    <button title="Delete" class="btn m-1 py-1 px-2 variant-ghost-error">
                      <Icon src="{XMark}" size="16" style="margin: 2px auto;" solid/>
                      <span class="text-xs">Delete</span>
                    </button>
                  </div>





                </td>
                </tr>

              {/each}
            </tbody>
            </table>
        </div>
    </div>




            <!-- <dl class="list-dl w-[100%]">
              <div>
                <span class="badge bg-primary-500">💀</span>
                <span class="flex-auto">
                  <dt>{doc.docName}</dt>
                  <dd class="text-xs">{doc.docID}</dd>
                </span>
              </div>
            </dl> -->

            </div>

            <Accordion>
              <AccordionItem open>
                <svelte:fragment slot="lead">
                  <Icon src="{InformationCircle}" size="20" style="margin: 4px auto;" alt={strLoadLocally} solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strLoadLocally}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p>Load a script to local storage.</p>
                </svelte:fragment>
              </AccordionItem>
            </Accordion>
          </div>
        {:else if tabSet === 2}
          <div class="card min-h-[100%] bg-surface-50-900-token shadow-inner divide-y divide-surface-400/10">      
            <div class="flex justify-center p-1">
              <button title="Import" class="btn m-2 variant-ghost-primary" 
                on:click={$modalStore[0].importFileCallback}>
                <Icon src="{ArrowDownTray}" size="20" style="margin: 2px auto;" solid/>
                <span>Import</span>
              </button> 
            </div>

            <Accordion>
              <AccordionItem open>
                <svelte:fragment slot="lead">
                  <Icon src="{InformationCircle}" size="20" style="margin: 4px auto;" alt={strImportFile} solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strImportFile}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p>Import a script as a plaintext file.</p>
                </svelte:fragment>
              </AccordionItem>
            </Accordion>
          </div>
        {:else if tabSet === 3}
          <div class="card min-h-[100%] bg-surface-50-900-token shadow-inner divide-y divide-surface-400/10">      
            <div class="flex justify-center p-1">
              <button disabled title="Publish" class="btn m-2 variant-soft-primary">
                <Icon src="{XMark}" size="20" style="margin: 2px auto;" solid/>
                <span>Womp Womp</span>
              </button>
            </div>
            
            <Accordion>
              <AccordionItem open>
                <svelte:fragment slot="lead">
                  <Icon src="{InformationCircle}" size="20" style="margin: 4px auto;" alt={strImportRawURL} solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strImportRawURL}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p>
                    Provide the URL of an externally-hosted <em>raw</em> script file or 
                    a gist ID and import it into the editor.
                  </p>
                </svelte:fragment>
              </AccordionItem>
            </Accordion>
          </div>
        {/if}
        </div>
      </svelte:fragment>
    </TabGroup>
    <footer class="flex justify-between items-center p-2 m-0 border border-primary-800/30 rounded shadow-xl">
      <div class="text-left font-semibold text-lg">
          {$modalStore[0].title ?? 'Load'}
      </div>
      <div class="flex justify-end">
          <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
      </div>
    </footer>
  </div>
{/if}