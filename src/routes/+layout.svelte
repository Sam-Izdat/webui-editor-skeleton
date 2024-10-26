<script lang="ts">
	import '../app.postcss';
	import * as g from '$lib/globals';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { assets, base, resolveRoute } from '$app/paths';

	import { autoModeWatcher } from '@skeletonlabs/skeleton';

	import { browser } from '$app/environment';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// Modals, Toasts/Growls
	import { initializeStores, Modal, Toast } from '@skeletonlabs/skeleton';
	initializeStores();

	import  { ModalInfo, ModalSave, ModalLoad, ModalConfirm, ModalInput }  from '$lib/components';
	const modalRegistry: Record<string, ModalComponent> = {
		modalInfo: 		{ ref: ModalInfo },
		modalSave: 		{ ref: ModalSave },
		modalLoad: 		{ ref: ModalLoad },
		modalConfirm: { ref: ModalConfirm },
		modalInput: 	{ ref: ModalInput },
	};

  import { Log } from '$lib';

  const dev_mode = import.meta.env.MODE === 'development';
  new Log({
  	baseLogLevel: 		Log.Level[dev_mode ? g.LOG_LEVEL_DEV : g.LOG_LEVEL_PROD], 
  	baseTraceLevel: 	Log.Level[dev_mode ? g.TRACE_LEVEL_DEV : g.TRACE_LEVEL_PROD],
  });
</script>

<svelte:head>
	{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}
	<link rel="manifest" href="./manifest.json">
	<meta name="theme-color" content="{g.PWA_THEME_COLOR}">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content">
</svelte:head>
<Modal components={modalRegistry} />
<Toast />
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 h-[100%] p-4">
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
/*	min-height: 100dvh !important;*/
/*	overflow-y: auto;*/
/*	height: 100dvh;*/
	background: #333 !important;
/*	overflow-y: hidden;*/
}

/*Important*/
:global(#page-content) {
	max-height: 100%;
	overflow-y: hidden;
}

/* When the soft keyboard is open, use --vh */
/*:global(body.keyboard-open) {
  height: calc(var(--vh, 1vh) * 100);
}*/
</style>