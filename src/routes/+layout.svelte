<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
<!-- 	<svelte:fragment slot="sidebarLeft">
		<nav class="list-nav">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/about">About</a></li>
			</ul>
		</nav>
	</svelte:fragment> -->
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-m uppercase">Lorem Ipsum</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="badge variant-ghost-surface"
					href="/foo"
					rel="noreferrer"
				>
					Foo
				</a>
				<a
					class="badge variant-ghost-surface"
					href="/bar"
					rel="noreferrer"
				>
					Bar
				</a>
				<a
					class="badge variant-ghost-surface"
					href="/"
					rel="noreferrer"
				>
					Baz
				</a>
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>

<style>
body {
	background: #333 !important;
}
</style>