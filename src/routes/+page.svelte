<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { strInitialEditorContents } from '$lib';
	import { strAboutText } from '$lib'

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	import  { LightSwitch }  from '$lib/components';


	// Dark-vs-Light mode
  const isDarkMode = () => {
    return document.documentElement.classList.contains('dark');
  };

  const switchMonacoTheme = (theme: string) => {
    monaco.editor.setTheme(theme);
  };

  const observeThemeChange = () => {
    const observer = new MutationObserver(() => {
      const theme = isDarkMode() ? 'vs-dark' : 'vs-light';
      switchMonacoTheme(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'] // Watch for changes to the class attribute
    });
  };

  // Code editor control
	let codeEditor = null;
	let readonly = false;

	const disableEditing = () => {
		codeEditor.updateOptions({ readOnly: true });
		readonly = true;
	};

	const enableEditing = () => {
		codeEditor.updateOptions({ readOnly: false });
		readonly = false;
	};

	const toggleEditing = () => {
		if (readonly) {
			enableEditing();
		} else {
			disableEditing();
		}
	};

  // Fullescreen
  let isFullscreen = false;

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
    isFullscreen = !isFullscreen; // Toggle the state
  };

  const enterFullscreen = () => {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }

	  // Request landscape orientation
	  if (screen.orientation && screen.orientation.lock) {
	    screen.orientation.lock('landscape').catch((error) => {
	      console.error(`Failed to lock orientation: ${error}`);
	    });
	  }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  // Modal
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	const modalAbout: ModalSettings = {
		type: 'component',
		component: 'modalInfo',
		logo: './icons/icon-128.png',
		title: 'Webui Editor Skeleton',
		package: __APP_NAME__,
		version: __APP_VERSION__,
		body: strAboutText
	};
	const modalExport: ModalSettings = {
		type: 'component',
		component: 'modalInfo',
		title: 'Export',
		body: 'This is the export page.'
	};

	// Popups
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';


	// SPA Navigation
	const movePaneContent = (id_content, id_container, fullPage = true) => {
		const source = document.querySelector('#'+id_content);
		const dest = document.querySelector('#'+id_container);
		dest.appendChild(source);
		dest.style.display = "block";
		if (fullPage) {
			document.querySelector('#cr_full').style.display = "block";
			document.querySelector('#cr_panes').style.display = "none";
		} else {			
			document.querySelector('#cr_full').style.display = "none";
			document.querySelector('#cr_panes').style.display = "block";
		}
	};

	const returnContentToPanes = () => {
		movePaneContent('ct1', 'cr_pane1', false);
		movePaneContent('ct2', 'cr_pane2', false);
		movePaneContent('ct3', 'cr_pane3', false);
    document.querySelector('#cr_full').style.display = "none";
		// document.querySelector('#cr_panes').style.display = "block";
	};

	onMount(async () => {
		returnContentToPanes();

		// Import our 'monaco.ts' file here
		// (onMount() will only be executed in the browser, which is what we want)
		monaco = (await import('./monaco')).default;

		// Your monaco instance is ready, let's display some code!
		codeEditor = monaco.editor.create(editorContainer, {
	    value: "",
	    language: "c",
	    minimap: {
	      enabled: false,
	    },
	    tabSize: 2,
	    automaticLayout: true,
	    theme: isDarkMode() ? 'vs-dark' : 'vs-light',
	  });

		const model = monaco.editor.createModel(strInitialEditorContents,	'c');
		codeEditor.setModel(model);
		
		observeThemeChange();
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		codeEditor?.dispose();
	});

	import type { ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived';
 
 	import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';

  import { Pane, Splitpanes } from 'svelte-splitpanes';
  let currentView: number = 0;
  let activePane = 'split'; // Possible values: 'split', 'pane1', 'pane2', 'pane3'


  // DELETME
  const setActivePane = (pane) => {
    activePane = pane;
  }

  // Icons

  import { 
  	Icon, 
  	ArrowUp, 
  	ViewColumns, 
  	CodeBracket, 
  	AdjustmentsHorizontal, 
  	ArrowsPointingOut, 
  	Photo, 
  	LockOpen, 
  	LockClosed,
  	ExclamationTriangle,
  	ExclamationCircle,
  	QuestionMarkCircle,
  	DocumentArrowUp
  } from "svelte-hero-icons";

</script>

		<div class="card bg-surface-50-900-token rounded-none h-[100%] grid grid-cols-[auto_1fr] w-full">
			<AppRail class="w-8">
				<!-- <svelte:fragment slot="lead">
					<AppRailAnchor href="#" ><Icon src="{ArrowUp}" size="16" style="margin:auto;"/></AppRailAnchor>
				</svelte:fragment> -->
				<!-- --- -->
				<AppRailTile 
					title="View split-pane"
					on:click={() => {setActivePane('split'); returnContentToPanes(); }} 
					bind:group={currentView} 
					name="tile-1" 
					value={0}>
					<svelte:fragment slot="lead">
						<Icon src="{ViewColumns}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile>
				<AppRailTile 
					title="View script"
					on:click={() => {setActivePane('pane1'); returnContentToPanes(); movePaneContent('ct1', 'cr_full', true) }} 
					bind:group={currentView} 
					name="tile-1" 
					value={1}>
					<svelte:fragment slot="lead">
						<Icon src="{CodeBracket}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile>
				<AppRailTile 
					title="View controls"
					on:click={() => {setActivePane('pane2'); returnContentToPanes(); movePaneContent('ct2', 'cr_full', true) }} 
					bind:group={currentView} 
					name="tile-2" 
					value={2}>
					<svelte:fragment slot="lead">
						<Icon src="{AdjustmentsHorizontal}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile>
				<AppRailTile 
					title="View canvas" 
					on:click={() => {setActivePane('pane3'); returnContentToPanes(); movePaneContent('ct3', 'cr_full', true) }} 
					bind:group={currentView} 
					name="tile-3" 
					value={3}>
					<svelte:fragment slot="lead">
						<Icon src="{Photo}" size="16" style="margin: 4px auto;" solid/>
					</svelte:fragment>
				</AppRailTile>

				<AppRailAnchor 
					href="#" 
					title="Toggle fullscreen" 
					on:click={toggleFullscreen} 
					class={isFullscreen ? 'bg-secondary-500' : ''} 
					style="display:block;">
					<Icon src="{ArrowsPointingOut}" size="16" style="margin: 4px auto;" solid/>
				</AppRailAnchor>
				<AppRailAnchor 
					href="#" 
					title="Toggle read-only" 
					on:click={toggleEditing} 
					class={readonly ? 'bg-secondary-500' : ''} 
					style="display:block;">
					<Icon src="{readonly ? LockClosed : LockOpen}" size="16" style="margin: 4px auto;" solid/>
				</AppRailAnchor>
				<AppRailAnchor 
					href="#" 
					title="Errors and warnings" 
					class={true ? 'bg-error-500' : ''} 
					style="display:block;">
					<div use:popup={{ event: 'click', target: 'error-popup', placement: 'right' }}>
						<Icon src="{ExclamationTriangle}" size="16" style="margin: 4px auto;" solid/>
					</div>
				</AppRailAnchor>
				<svelte:fragment slot="trail">
					<AppRailAnchor 
						href="#" 
						title="Export" 
						on:click={() => modalStore.trigger(modalExport)}
						style="display:block;">
						<Icon src="{DocumentArrowUp}" size="16" style="margin: 4px auto;" solid/>
					</AppRailAnchor>
					<AppRailAnchor 
						href="#" 
						title="About" 
						on:click={() => modalStore.trigger(modalAbout)}
						style="display:block;">
						<Icon src="{QuestionMarkCircle}" size="16" style="margin: 4px auto;" solid/>
					</AppRailAnchor>
					<AppRailAnchor href="#" title="Toggle light or dark mode.">
						<LightSwitch />
					</AppRailAnchor>
				</svelte:fragment>
			</AppRail>
			<div id="cr_panes" class="grid cr_dynamic">
				<Splitpanes theme="skeleton-theme" style="width: 100%; height: 100%;">
				  <Pane minSize={20}>
				  	<div id="cr_pane1">
							<div id="ct1">
						 		<div id="editor-wrap" bind:this={editorContainer} /><!-- <textarea>fff</textarea> </div> --> 
						 		
							</div>
						</div>
				  </Pane>
				  <Pane minSize={20}>
				    <Splitpanes horizontal={true}>
				      <Pane minSize={15}>
				      	<div id="cr_pane2">
					      	<div id="ct2">
					      		<!-- Replace this with actual canvas -->
					      		<div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-[100%] w-[100%]">
					      			<span class="badge variant-soft">Current view: {currentView}</span>
					      		</div>
					      		<!-- / Replace this with actual canvas -->
						      </div>
						     </div>
				      </Pane>
				      <Pane>
				      	<div id="cr_pane3">
					      	<div id="ct3">
					      		<span class="badge variant-soft">This is where the controls would be.</span>
					      		<span class="badge variant-soft">Current view: {currentView}</span>
					      	</div>
					      </div>
				      </Pane>
				      <!-- <Pane>4</Pane> -->
				    </Splitpanes>
				  </Pane>
				  <!-- <Pane>5</Pane> -->
				</Splitpanes>
			</div>
			<div id="cr_full" class="cr_dynamic" />
		</div>
		<div 
			class="card place-content-stretch p-1 max-w-72 bg-gradient-to-br variant-gradient-error-warning shadow shadow-error-900" 
			data-popup="error-popup"
			style="z-index: 100;">
			<div class="card p-1 variant-filled-surface">
				<aside class="alert variant-filled-error p-1 m-1">
					<div class="alert-message  text-xs">
						Error error womp womp!
					</div>
				</aside>
				<aside class="alert variant-filled-warning p-1 m-1">
					<div class="alert-message  text-xs">
						Also another thing!
					</div>
				</aside>
				<aside class="alert variant-filled-warning p-1 m-1">
					<div class="alert-message  text-xs">
						This is a longer and more verbose warning message about something or other.
					</div>
				</aside>
				<div class="arrow bg-gradient-to-br  variant-gradient-error-warning" />
			</div>
		</div>
<style>	
:global(body) {
  margin: 0 !impoortant;
  padding: 0 !important;
}
:global(#cr_panes, #cr_full) {
	display: block;
	max-height: 100%;
	overflow: hidden;
}
:global(#cr_pane1, #cr_pane2, #cr_pane3, #ct1, #ct2, #ct3) {
	display: block;
	height: 100%;
	width: 100%;
	overflow:hidden;
}
:global(#editor-wrap) {
  height: 100dvh !important;
  overflow: hidden;
}

:global(.splitpanes.skeleton-theme .splitpanes__pane) {
  background-color: rgba(210, 210, 210, 0.2) !important;
}
:global(.dark .splitpanes.skeleton-theme .splitpanes__pane) {
  background-color: rgba(60, 60, 60, 0.2) !important;
}
:global(.splitpanes.skeleton-theme .splitpanes__splitter) {
  background-color: rgba(210, 210, 210, 0.7) !important;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
}
:global(.dark .splitpanes.skeleton-theme .splitpanes__splitter) {
  background-color: rgba(60, 60, 60, 0.7) !important;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
}
:global(.splitpanes.skeleton-theme .splitpanes__splitter:before, .splitpanes.skeleton-theme .splitpanes__splitter:after) {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s;
}
:global(.splitpanes.skeleton-theme .splitpanes__splitter:hover:before, .splitpanes.skeleton-theme .splitpanes__splitter:hover:after) {
  background-color: rgba(0, 0, 0, 0.25);
}

:global(.splitpanes.skeleton-theme .splitpanes__splitter:first-child) {
  cursor: auto;
}

:global(.skeleton-theme.splitpanes .splitpanes .splitpanes__splitter) {
  z-index: 1;
}

:global(.skeleton-theme.splitpanes--vertical > .splitpanes__splitter,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter) {
  width: 4px;
  background-color: rgba(210, 210, 210, 1) !important;
  cursor: col-resize;
}
:global(.dark .skeleton-theme.splitpanes--vertical > .splitpanes__splitter,
.dark .skeleton-theme .splitpanes--vertical > .splitpanes__splitter) {
  width: 4px;
  background-color: rgba(60, 60, 60, 1) !important;
  cursor: col-resize;
}

:global(.skeleton-theme.splitpanes--vertical > .splitpanes__splitter:before, .skeleton-theme.splitpanes--vertical > .splitpanes__splitter:after,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter:before,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter:after) {
  transform: translateY(-50%);
  width: 1px;
  height: 30px;
}

:global(.skeleton-theme.splitpanes--vertical > .splitpanes__splitter:before,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter:before) {
  margin-left: -2px;
}
:global(.skeleton-theme.splitpanes--vertical > .splitpanes__splitter:after,
.skeleton-theme .splitpanes--vertical > .splitpanes__splitter:after) {
  margin-left: 1px;
}
:global(.skeleton-theme.splitpanes--horizontal > .splitpanes__splitter,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter) {
  height: 4px;
  border-top: rgba(210, 210, 210, 1) !important;
  cursor: row-resize;
}
:global(.dark .skeleton-theme.splitpanes--horizontal > .splitpanes__splitter,
.dark .skeleton-theme .splitpanes--horizontal > .splitpanes__splitter) {
  height: 4px;
  border-top: rgba(255, 0, 0, 1) !important;
  cursor: row-resize;
}
:global(.skeleton-theme.splitpanes--horizontal > .splitpanes__splitter:before, .skeleton-theme.splitpanes--horizontal > .splitpanes__splitter:after,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter:before,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter:after) {
  transform: translateX(-50%);
  width: 30px;
  height: 1px;
}
:global(.skeleton-theme.splitpanes--horizontal > .splitpanes__splitter:before,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter:before) {
  margin-top: -2px;
}
:global(.skeleton-theme.splitpanes--horizontal > .splitpanes__splitter:after,
.skeleton-theme .splitpanes--horizontal > .splitpanes__splitter:after) {
  margin-top: 1px;
}
</style>