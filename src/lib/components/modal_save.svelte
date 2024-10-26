<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
  import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
  import { 
    Icon, 
    CloudArrowUp,
    Folder,
    ArrowUpTray,
    Link,
    ExclamationTriangle,
    ArrowDownOnSquare,
    ArrowDownOnSquareStack,
    InformationCircle,
    XMark,
  } from "svelte-hero-icons";

  import type DocumentSession from '$lib/doc_types';

  import { getModalStore } from '@skeletonlabs/skeleton';

  export let parent:SvelteComponent;

  const modalStore = getModalStore();

  const cButton: string           = 'fixed top-4 right-4 z-50 font-bold shadow-xl';
  const cBase: string             = 'card p-4 w-modal shadow-xl space-y-4';  

  const isPWA: boolean            = window.matchMedia('(display-mode: standalone)').matches;
  const isStaticServer: boolean   = __BUILD_TYPE__ == 'static';
  const isStatic: boolean         = isPWA || isStaticServer;
  let tabSet: number              = isStatic ? 1 : 0;

  // SAVE
  // If PWA:
  //   Save Remotely:
  //     If internet-connected & server available:
  //       Base-64 encoded https URI, server returns web URL
  //     Else:
  //       sadface.png
  //   Save Locally:
  //     Local save interface
  // 
  // If NOT PWA:
  //   Save Remotely:
  //     Remote save interface
  //   Save Locally:
  //     Base-64 encoded PWA URI

  // LOAD
  // If PWA:
  //   Load remotely 
  //     If internet-connected & server available:
  //       Browse/search: request raw script chosen /
  //     Else:
  //       sadface.png
  //   Load locally
  //     Local load interface
  //
  // If NOT PWA:
  //   Load remotely 
  //     Browse/search: load script chosen
  //   Load locally
  //     "Open PWA, stupid" message or install instructions

  const strSaveRemotely = "Save to Web";
  const strSaveLocally  = "Save Locally";
  const strExportFile   = "Export File";
  const strShareRawURL  = "Share External Resource";
</script>


{#if $modalStore[0]}
  <div class="{cBase}">
    <TabGroup>
      <Tab bind:group={tabSet} name="tab1" value={0}>
        <svelte:fragment slot="lead"><Icon src="{CloudArrowUp}" size="20" style="margin: 4px auto;" alt={strSaveRemotely} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Save to Web</span>
      </Tab>
      <Tab bind:group={tabSet} name="tab2" value={1}>
        <svelte:fragment slot="lead"><Icon src="{Folder}" size="20" style="margin: 4px auto;" alt={strSaveLocally} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Save Locally</span>
      </Tab>
      <Tab bind:group={tabSet} name="tab3" value={2}>
        <svelte:fragment slot="lead"><Icon src="{ArrowUpTray}" size="20" style="margin: 4px auto;" alt={strExportFile} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Export File</span>
      </Tab>
      <Tab bind:group={tabSet} name="tab3" value={3}>
        <svelte:fragment slot="lead"><Icon src="{Link}" size="20" style="margin: 4px auto;" alt={strShareRawURL} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Share External</span>
      </Tab>
      <svelte:fragment slot="panel">
        <div class="h-56 overflow-auto text-sm border border-primary-900/30 rounded">
        {#if tabSet === 0}
          <div class="card min-h-[100%] bg-surface-50-900-token shadow-inner divide-y divide-surface-400/10">
            <div class="flex justify-center p-1">
              <button disabled title="Publish" class="btn m-2 variant-soft-primary">
                <Icon src="{XMark}" size="20" style="margin: 2px auto;" solid/>
                <span>Publish</span>
              </button>
            </div>

            <Accordion>
              <AccordionItem open>
                <svelte:fragment slot="lead">
                  <Icon src="{InformationCircle}" size="20" style="margin: 4px auto;" alt={strSaveRemotely} solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strSaveRemotely}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p>Publish the script on the web.</p>
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
              <button title="Save" class="btn m-2 {$modalStore[0].session.unsavedChanges ? 'variant-ghost-primary' : 'variant-soft-primary'}" 
                on:click={$modalStore[0].localSaveDocCallback}>
                <Icon src="{ArrowDownOnSquare}" size="20" style="margin: 2px auto;" solid/>
                <span>Save</span>
              </button> 
              <button title="Save New" class="btn m-2 {$modalStore[0].session.unsavedChanges ? 'variant-ghost-primary' : 'variant-soft-primary'}"
                on:click={$modalStore[0].localSaveDocNewVersionCallback}>
                <Icon src="{ArrowDownOnSquareStack}" size="20" style="margin: 2px auto;" solid/>
                <span>Save v{$modalStore[0].session.versionActive}</span>
              </button>
            </div>

            <Accordion>
              <AccordionItem open>
                <svelte:fragment slot="lead">
                  <Icon src="{InformationCircle}" size="20" style="margin: 4px auto;" alt={strSaveLocally} solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strSaveLocally}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p>Save the script to local storage.</p>
                  <aside class="alert variant-soft-warning p-1">
                    <div class="alert-message">Note: <code class="code">localStorate</code> is limited to ~5MB.</div>
                  </aside>
                </svelte:fragment>
              </AccordionItem>
            </Accordion>
          </div>
        {:else if tabSet === 2}
          <div class="card min-h-[100%] bg-surface-50-900-token shadow-inner divide-y divide-surface-400/10">      
            <div class="flex justify-center p-1">
              <button title="Export" class="btn m-2 variant-ghost-primary" 
                on:click={$modalStore[0].exportFileCallback}>
                <Icon src="{ArrowUpTray}" size="20" style="margin: 2px auto;" solid/>
                <span>Export</span>
              </button> 
            </div>

            <Accordion>
              <AccordionItem open>
                <svelte:fragment slot="lead">
                  <Icon src="{InformationCircle}" size="20" style="margin: 4px auto;" alt={strExportFile} solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strExportFile}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p>Export the script as a plaintext file.</p>
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
                  <Icon src="{InformationCircle}" size="20" style="margin: 4px auto;" alt={strShareRawURL} solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strShareRawURL}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p>
                    Provide the URL of an externally-hosted <em>raw</em> script file or 
                    a gist ID and get a link to share it through the editor.
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
          {$modalStore[0].title ?? 'Save'}
      </div>
      <div class="flex justify-end">
          <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
      </div>
    </footer>
  </div>
{/if}