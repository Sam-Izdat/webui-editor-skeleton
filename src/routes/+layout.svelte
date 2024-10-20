<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { assets, base, resolveRoute } from '$app/paths';

	import { autoModeWatcher } from '@skeletonlabs/skeleton';

	//DELETEME
	import { browser } from '$app/environment';
	// if (browser) document.documentElement.classList.add('dark')
</script>

<!-- App Shell -->
<svelte:head>
	{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}

	<link rel="manifest" href="/manifest.json">
	<meta name="theme-color" content="#000000">
</svelte:head>
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
<!-- 	<svelte:fragment slot="sidebarLeft">
		<nav class="list-nav">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/about">About</a></li>
			</ul>
		</nav>
	</svelte:fragment> -->

	<!-- <svelte:fragment slot="header">
		<AppBar class="p-0">
			<svelte:fragment slot="lead">
				<strong class="text-sm uppercase">Foo</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="badge variant-ghost-surface"
					href="{base}/foo"
				>
					Foo
				</a>
				<a
					class="badge variant-ghost-surface"
					href="{base}/bar"
				>
					Bar
				</a>
				<a
					class="badge variant-ghost-surface"
					href="{base}/"
				>
					Baz
				</a>
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment> -->

	<!-- Page Route Content -->
	<slot />
</AppShell>

<style>
:global(body) {
/*Some problems with this on mobile, and doesn't accomplish goal of hiding addressbar with PWA manifest:*/
/*	min-height: 100vh;*/
/*	overflow-y: auto;*/
	background: #333 !important;
}
</style>