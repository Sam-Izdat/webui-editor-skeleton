<script lang="ts">
  import { popup } from '@skeletonlabs/skeleton';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

  export let forkCallback = () => {};
  export let revertCallback = () => {};
  export let resetPanesCallback = () => {};
  export let exportCallback = () => {};

  let valueCBDocMenu: string;

  const popupCBDocMenu: PopupSettings = {
    event: 'click',
    target: 'popup_doc_menu',
    placement: 'bottom',
    closeQuery: '.listbox-item'
  };

  // Icons
  import { Icon } from 'svelte-hero-icons';
  import * as hero from 'svelte-hero-icons';
  import { CustomIcon } from '$lib/components/icons';
  import * as ico from '$lib/components/icons';
</script>
<button 
  class="badge m-1 py-0 px-1 variant-ghost-primary"
  title="Options Menu" 
  use:popup={popupCBDocMenu}
>
  <Icon src="{hero.EllipsisVertical}" size="16" style="margin: 2px auto;" solid/>
</button>
<div class="card w-fit shadow-xl py-2 overflow-y-auto overflow-x-hidden" data-popup="popup_doc_menu">
  <ListBox rounded="rounded-none" padding="px-4 py-1 text-sm">
    <ListBoxItem 
    name='doc_menu'
    value='fork'
    bind:group={valueCBDocMenu} 
    on:change={() => { forkCallback(); valueCBDocMenu = null; } }
    >
      <CustomIcon src={ico.Fork} size='16' class="inline-block !mr-4" />
      Fork
    </ListBoxItem>
    <ListBoxItem 
    name='doc_menu' 
    value='revert'
    bind:group={valueCBDocMenu} 
    on:change={() => { revertCallback(); valueCBDocMenu = null; } }
    >
      <Icon src={hero.ArrowUturnLeft} size='16' class="inline-block !mr-4" />
      Revert
    </ListBoxItem>
    <ListBoxItem 
    name='doc_menu' 
    value='export'
    bind:group={valueCBDocMenu} 
    on:change={() => { exportCallback(); valueCBDocMenu = null; } }
    >
      <Icon src={hero.ArrowUpTray} size='16' class="inline-block !mr-4" />
      Export
    </ListBoxItem>
    <ListBoxItem 
    name='doc_menu' 
    value='reset_panes'
    bind:group={valueCBDocMenu} 
    on:change={() => { resetPanesCallback(); valueCBDocMenu = null; } }
    >
      <Icon src={hero.ArrowPath} size='16' class="inline-block !mr-4" />
      Reset Panes
    </ListBoxItem>
  </ListBox>
</div>