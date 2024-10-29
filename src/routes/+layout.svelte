<script lang="ts">
  import '../app.postcss';
  import { cfg } from '$root/webui.config.js';
  import { AppShell, AppBar } from '@skeletonlabs/skeleton';
  import { autoModeWatcher } from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  // Modals, Toasts/Growls, Drawers
  import { initializeStores, Modal, Toast, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';  
  import type { DrawerSettings, DrawerStore } from '@skeletonlabs/skeleton';
  import { drawerContentStore  } from '$lib/stores/drawer';
  initializeStores();
  let drawerContent;
  let props = {};

  // Subscribe to updates to dynamically load the component
  drawerContentStore.subscribe(({ component, props: componentProps }) => {
    drawerContent = component;
    props = componentProps;
  });

  import  { ModalInfo, ModalImportExport, ModalConfirm, ModalInput }  from '$lib/components';
  const modalRegistry: Record<string, ModalComponent> = {
    modalInfo:          { ref: ModalInfo },
    modalImportExport:  { ref: ModalImportExport },
    modalConfirm:       { ref: ModalConfirm },
    modalInput:         { ref: ModalInput },
  };

  import { Log } from '$lib';

  const dev_mode = import.meta.env.MODE === 'development';
  new Log({
    baseLogLevel:     Log.Level[dev_mode ? cfg.LOG_LEVEL_DEV : cfg.LOG_LEVEL_PROD], 
    baseTraceLevel:   Log.Level[dev_mode ? cfg.TRACE_LEVEL_DEV : cfg.TRACE_LEVEL_PROD],
  });
</script>

<svelte:head>
  {@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}
  <meta name="theme-color" content="{cfg.PWA_THEME_COLOR}">
  <meta name="description" content={cfg.APP_DESCRIPTION} />
  <title>{cfg.APP_TITLE}</title>
</svelte:head>
<Modal components={modalRegistry} />
<Drawer>
  {#if drawerContent}
    <svelte:component this={drawerContent} {...props} />
  {/if}
</Drawer>
<Toast class="!z-[1000]" />
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 h-[100%] p-4">
  <slot />
</AppShell>