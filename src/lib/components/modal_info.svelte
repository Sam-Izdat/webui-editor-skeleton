<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  // Stores
  import { getModalStore } from '@skeletonlabs/skeleton';

  import {InfoKeyboard} from '$lib/components';

  // Props
  /** Exposes parent props to this component. */
  export let parent: SvelteComponent;
  const modalStore = getModalStore();

  const cBase = 'card p-4 w-modal shadow-xl space-y-4';
  const cButton = 'fixed top-4 right-4 z-50 font-bold shadow-xl';
  const cImage = 'max-w-[90%] max-h-[90%] rounded-container-token overflow-hidden float-left m-5';
  const cHeader = 'text-2xl font-bold';
</script>


{#if $modalStore[0]}
  <div class="{cBase}">
    {#if $modalStore[0].logo}
      <img src={$modalStore[0].logo} class={cImage} alt="logo" />
    {/if}
    {#if $modalStore[0].package}
      <span class="text-xs md:text-xs">{$modalStore[0].package ?? '(package missing)'}</span>
    {/if}
    {#if $modalStore[0].version}
      <span class="text-xs md:text-xs">Version {$modalStore[0].version ?? '(version missing)'}</span>
    {/if}
    <article>{$modalStore[0].body ?? '(body missing)'}</article>

    {#if $modalStore[0].showKeyboardShortcuts}
      <InfoKeyboard />
    {/if}
    <footer class="flex justify-between items-center p-2 m-0 border border-primary-800/30 rounded shadow-xl">
      <div class="text-left font-semibold text-lg">
          {$modalStore[0].title ?? 'About'}
      </div>
      <div class="flex justify-end">
          <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
      </div>
    </footer>
  </div>
{/if}