<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let name: string;
	export let file: Writable<string>;

	onMount(() => {
		console.log('mount', name);

		return () => {
			console.log('unmount', name);
		};
	});
</script>

<label class="label">
	<span>Input {name}</span>
	<input type="text" class="input py-0" bind:value={$file} />
</label>