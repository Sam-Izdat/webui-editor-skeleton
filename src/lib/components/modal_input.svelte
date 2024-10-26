<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton';
  export let parent: SvelteComponent;
  const modalStore = getModalStore();

  import { 
    Icon, 
    Check,
    XMark,
  } from "svelte-hero-icons";

  const cBase = 'card p-4 w-modal shadow-xl space-y-4 w-min';

  let inputValue = $modalStore[0].inputValue ?? '';

  const actionCancel = () => {
    $modalStore[0].onCancel();
    parent.onClose();
  };

  const actionConfirm = () => {
    $modalStore[0].onConfirm(inputValue);
    parent.onClose();
  }
</script>

{#if $modalStore[0]}
  <div class="{cBase}">
    <form on:submit|preventDefault={actionConfirm}>
      {#if $modalStore[0].message}
      <article class="text-center">{$modalStore[0].message ?? '(message missing)'}</article>
      {/if}
      <div class="card p-4 w-full text-token space-y-4">
        <label class="label text-sm">
          {#if $modalStore[0].inputName}
          <span>{$modalStore[0].inputName ?? '(input name missing)'}</span>
          {/if}
          <input 
            class="input w-80" 
            type="text" 
            bind:value={inputValue} 
            placeholder={$modalStore[0].placeholder ?? ''} 
            on:focus={(e) => e.target.select()}
          />
        </label>
      </div>
      <div class="flex justify-center">
        <button type="submit" class="btn variant-ghost-primary m-1">
          <Icon src="{Check}" size="16" style="margin: 2px auto;" solid/>
          <span>{$modalStore[0].txtConfirm ?? 'OK'}</span>
        </button>
        <button type="button" class="btn variant-ghost-primary m-1" on:click={actionCancel}>
          <Icon src="{XMark}" size="16" style="margin: 2px auto;" solid/>
          <span>{$modalStore[0].txtCancel ?? 'Cancel'}</span>
        </button>
      </div>
    </form>
  </div>
{/if}
