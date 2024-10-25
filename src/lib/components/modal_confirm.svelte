<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton';
  export let parent: SvelteComponent;
  const modalStore = getModalStore();

  // export let message: string = "Are you sure?";
  export let onConfirm = () => {};
  export let onCancel = () => {};
  console.log($modalStore[0]);

  const cBase = 'card p-4 w-modal shadow-xl space-y-4 w-min';

  const actionCancel = () => {
    onCancel();
    parent.onClose();
  };
</script>


{#if $modalStore[0]}
  <div class="{cBase}">
    <article class="text-center">{$modalStore[0].message ?? 'Confirmation needed'}</article>
    <div class="flex justify-end">
      <button class="btn variant-filled-warning m-1" on:click={onConfirm}>{$modalStore[0].txtConfirm ?? 'Confirm'}</button>
      <button class="btn variant-soft-primary m-1" on:click={actionCancel}>{$modalStore[0].txtCancel ?? 'Cancel'}</button>
    </div>
  </div>
{/if}