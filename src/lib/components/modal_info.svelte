<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  // Stores
  import { getModalStore } from '@skeletonlabs/skeleton';
  
  import * as key from '$lib/keymap';

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
    <div class="table-container w-full shadow-xl">
      <table class="table table-compact table-hover">
        <thead>
          <tr>
            <td>Keyboard shortcut</td>
            <td>Key</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New Script:</td>
            <td>{key.keySaveDoc}</td>
          </tr>
          <tr>
            <td>Save Script:</td>
            <td>{key.keySaveDoc}</td>
          </tr>
          <tr>
            <td>Save New Script Version:</td>
            <td>{key.keySaveDocNewVersion}</td>
          </tr>
          <tr>
            <td>Rename Script:</td>
            <td>{key.keyRenameDoc}</td>
          </tr>
          <tr>
            <td>Open Achive (save/load):</td>
            <td>{key.keyArchive}</td>
          </tr>
          <tr>
            <td>Build (without saving):</td>
            <td>{key.keyBuild}</td>
          </tr>
          <tr>
            <td>View Split:</td>
            <td>{key.keyViewSplit}</td>
          </tr>
          <tr>
            <td>View Code:</td>
            <td>{key.keyViewCode}</td>
          </tr>
          <tr>
            <td>View Canvas:</td>
            <td>{key.keyViewCanvas}</td>
          </tr>
          <tr>
            <td>View Controls:</td>
            <td>{key.keyViewControls}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <footer class="flex justify-between items-center p-2 m-0 bg-surface-50-900-token shadow-inner">
      <div class="text-left font-semibold text-lg">
          {$modalStore[0].title ?? 'Load'}
      </div>
      <div class="flex justify-end">
          <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
      </div>
    </footer>
  </div>
{/if}