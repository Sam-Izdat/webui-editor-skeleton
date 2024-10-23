<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
  import { 
    Icon, 
    CloudArrowUp,
    Folder,
    ArrowUpTray,
    Link,
    ExclamationTriangle,
  } from "svelte-hero-icons";

  // Stores
  import { getModalStore } from '@skeletonlabs/skeleton';

  // Props
  /** Exposes parent props to this component. */
  export let parent: SvelteComponent;

  const modalStore = getModalStore();

  const cButton = 'fixed top-4 right-4 z-50 font-bold shadow-xl';
  const cBase = 'card p-4 w-modal shadow-xl space-y-4';
  // const cHeader = 'text-2xl font-bold';

  const isPWA = true;
  const isStaticServer = true;
  let tabSet: number = isPWA ? 1 : 0;

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
  const strShareRaw     = "Share External Resource";
</script>


{#if $modalStore[0]}
  <div class="{cBase}">
    <TabGroup>
      <Tab bind:group={tabSet} name="tab1" value={0}>
        <svelte:fragment slot="lead"><Icon src="{CloudArrowUp}" size="20" style="margin: 4px auto;" alt={strSaveRemotely} solid/></svelte:fragment>
        
      </Tab>
      <Tab bind:group={tabSet} name="tab2" value={1}>
        <svelte:fragment slot="lead"><Icon src="{Folder}" size="20" style="margin: 4px auto;" alt={strSaveLocally} solid/></svelte:fragment>
        <!-- <span>Save Locally</span>       -->
      </Tab>
      <Tab bind:group={tabSet} name="tab3" value={2}>
        <svelte:fragment slot="lead"><Icon src="{ArrowUpTray}" size="20" style="margin: 4px auto;" alt={strExportFile} solid/></svelte:fragment>
        <!-- <span>Export File</span> -->
      </Tab>
      <Tab bind:group={tabSet} name="tab3" value={3}>
        <svelte:fragment slot="lead"><Icon src="{Link}" size="20" style="margin: 4px auto;" alt={strShareRaw} solid/></svelte:fragment>
        <!-- <span>Share RAW URL</span> -->
      </Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        <div class="h-56 overflow-auto">
        {#if tabSet === 0}
          <div class="card h-[100%] bg-surface-50-900-token shadow-inner">
            <div class="p-4 space-y-4">
              <h4 class="h4" data-toc-ignore>{strSaveRemotely}</h4>
              <article>                      
                {#if isStaticServer}
                <aside class="alert variant-soft-warning p-1">
                  <div class="alert-message">Server-side storage is not yet available.</div>
                </aside>
                {/if}
              </article>
            </div>
          </div>
        {:else if tabSet === 1}
          <div class="card h-[100%] bg-surface-50-900-token shadow-inner">
            <div class="p-4 space-y-4">
              <h4 class="h4" data-toc-ignore>{strSaveLocally}</h4>
              <article>
                .....
              </article>
            </div>
          </div>
        {:else if tabSet === 2}
          <div class="card h-[100%] bg-surface-50-900-token shadow-inner">
            <div class="p-4 space-y-4">
              <h4 class="h4" data-toc-ignore>{strExportFile}</h4>
              <article>
                .....
              </article>
            </div>
          </div>
        {:else if tabSet === 3}
          <div class="card h-[100%] bg-surface-50-900-token shadow-inner">
            <div class="p-4 space-y-4">
              <h4 class="h4" data-toc-ignore>{strShareRaw}</h4>
              <article>
                Specify the address of a <em>raw</em> script file and share it through the editor.
              </article>
            </div>
          </div>
          
        {/if}
        </div>
      </svelte:fragment>
    </TabGroup>
    <footer class="flex justify-between items-center p-2 m-0 bg-surface-50-900-token shadow-inner">
      <div class="text-left font-semibold text-lg">
          {$modalStore[0].title ?? 'Save'}
      </div>
      <div class="flex justify-end">
          <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
      </div>
    </footer>
  </div>
{/if}