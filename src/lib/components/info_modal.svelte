<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	const cButton = 'fixed top-4 right-4 z-50 font-bold shadow-xl';
	const cImage = 'max-w-[90%] max-h-[90%] rounded-container-token overflow-hidden float-left m-5';
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>


{#if $modalStore[0]}
	<div class="{cBase}">
		<h2 class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</h2>
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
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
    </footer>
	</div>
{/if}