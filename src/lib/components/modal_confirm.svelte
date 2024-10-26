<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton';
  export let parent: SvelteComponent;
  const modalStore = getModalStore();

  import { 
    Icon, 
    Check,
    XMark,
  } from "svelte-hero-icons";

  const cBase:string = 'card p-4 w-modal shadow-xl space-y-4 w-min';

  const actionCancel = () => {
    $modalStore[0].onCancel();
    parent.onClose();
  };

  const actionConfirm = () => {
    $modalStore[0].onConfirm();
    parent.onClose();
  }
</script>

{#if $modalStore[0]}
  <div class="{cBase}">
    <article class="text-center">{$modalStore[0].message ?? 'Confirmation needed'}</article>
    <div class="flex justify-center">
      <button class="btn variant-filled-warning m-1" on:click={actionConfirm}>
        <Icon src="{Check}" size="16" style="margin: 2px auto;" solid/>
        <span>{$modalStore[0].txtConfirm ?? 'Confirm'}</span>
      </button>
      <button class="btn variant-ghost-primary m-1" on:click={actionCancel}>
        <Icon src="{XMark}" size="16" style="margin: 2px auto;" solid/>
        <span>{$modalStore[0].txtCancel ?? 'Cancel'}</span>
    </button>
    </div>
  </div>
{/if}