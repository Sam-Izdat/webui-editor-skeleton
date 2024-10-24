<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { beforeNavigate } from "$app/navigation";
  import { base } from '$app/paths';  
  import * as g from '$lib/globals';
  import { Log } from '$lib';
  import Device from 'svelte-device-info';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { strInitialEditorContents } from '$lib';
	import { strAboutText } from '$lib';
	import * as ds from '$lib/stores/doc_session';

	// Monaco setup
	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	// Dark mode
	import { LightSwitch, ScriptStatusIndicator, DocTitleBadge }  from '$lib/components';
	import { darkModeStore, observeThemeChange } from '$lib/stores/dark_mode';

  // Code editor control
	let codeEditor;
	let readonly;	
  let dsCurrentSession;

	const disableEditing = () => {
		codeEditor.updateOptions({ readOnly: true });
		document.querySelector('.monaco-editor textarea').readOnly = true;
		readonly = true;
	};

	const enableEditing = () => {
		codeEditor.updateOptions({ readOnly: false });
		document.querySelector('.monaco-editor textarea').readOnly = false;
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
  import * as fs from '$lib/fullscreen';

  // Modal
  import { getModalStore } from '@skeletonlabs/skeleton';
	export const modalStore = getModalStore();
  import * as modals from '$lib/modals';

	// SPA Navigation
	import * as panes from '$lib';
	let paneSizes = {...panes.resetPaneSizes()};
	
  // Mobile orientation
  let orientationLandscape = true;

	const handleOrientationChange = async () => {
		if (orientationLandscape && screen.orientation.type.startsWith('portrait')) {
	    panes.moveContentToStaging();
	    orientationLandscape = false;		  
		  await tick(); // Wait for DOM to be updated
	  	panes.returnContentToSplit();
	  	if (currentView == 1) panes.moveContent('ct1', 'cr-full');
	  	else if (currentView == 2) panes.moveContent('ct2', 'cr-full');
	  	else if (currentView == 3) panes.moveContent('ct3', 'cr-full');
	  	panes.showView(currentView);
	  } else  {
	    panes.moveContentToStaging();
	    orientationLandscape = true;
		  await tick();
	  	panes.returnContentToSplit();
	  	if (currentView == 1) panes.moveContent('ct1', 'cr-full');
	  	else if (currentView == 2) panes.moveContent('ct2', 'cr-full');
	  	else if (currentView == 3) panes.moveContent('ct3', 'cr-full');
	  	panes.showView(currentView);
	  }
	};
	
  // Subscribe to documentSession store
  const unsubscribe = ds.documentSession.subscribe(session => {
    dsCurrentSession = session;
  });

  beforeNavigate(({ cancel }) => {
	  if (dsCurrentSession.unsavedChanges) {
	    if (!confirm('You are about to navigate away, but you have unsaved changes. Proceed?')) {
	      cancel();
	    }
	  }
	});

	// When browser is ready...
	onMount(async () => {
		// Populate paness
		panes.returnContentToSplit(currentView);

		// Set theme
		document.querySelector('body').setAttribute('data-theme', g.APP_THEME);

		// Import monaco
		monaco = (await import('$lib/monaco')).default;
		
		// Watch for changes from light to dark mode
		observeThemeChange(monaco.editor);

		codeEditor = monaco.editor.create(editorContainer, {
	    value: "",
	    language: "c",
	    minimap: {
	      enabled: false,
	    },
	    tabSize: 2,
	    automaticLayout: true,
	    theme: $darkModeStore ? 'vs-dark' : 'vs-light',
	  });

    // Check if an uploaded file exists in sessionStorage or localStorage
    const fileData = sessionStorage.getItem('activeFile'); // Or localStorage if you prefer
    let contentToLoad = strInitialEditorContents; // Default content
    if (fileData) {
      const file = JSON.parse(fileData);
      Log.debug('@@@@@@ FILE DATA', file, file[0], file[0] || 'foo'); // FIXME
      contentToLoad = file[0].content || strInitialEditorContents; // Load the file content if it exists      
    } 


    // Listen for changes in Monaco editor and update the store
    codeEditor.onDidChangeModelContent(() => {
      const content = codeEditor.getValue();
      ds.updateContent(content);
    });

		// Start the monaco engine
		const model = monaco.editor.createModel('',	'c');
		codeEditor.setModel(model);
    codeEditor.setValue(dsCurrentSession.content);

    // if (codeEditor) {
    //   codeEditor.setValue(session.content);  // Update Monaco with the session content
    // }
		
		// Turn off mobile typing help bullshit, if any of it is on
		const monacoTextarea = document.querySelector('.monaco-editor textarea');
		monacoTextarea.setAttribute('autocomplete', 'off'); 
		monacoTextarea.setAttribute('autocorrect', 'off'); 
		monacoTextarea.setAttribute('autocapitalize', 'off');
		monacoTextarea.setAttribute('spellcheck', false);


		// Listen for orientation changes and do initial check
		window.screen.orientation.onchange = handleOrientationChange;
		handleOrientationChange();

		// Turn off editing by default on mobile devices, because soft keys suck
		if (Device.isMobile) disableEditing();

    // Cleanup
		onDestroy(() => {
			monaco?.editor.getModels().forEach((model) => model.dispose());
			codeEditor?.dispose();
		});

    return () => unsubscribe();  // Clean up subscription
	});

	import type { ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived';
 
 	import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';

  import { Pane, Splitpanes } from 'svelte-splitpanes';
  let currentView: number = 0;

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
  	Document,
  	DocumentArrowUp,
  	DocumentArrowDown,
  	ArrowPathRoundedSquare
  } from "svelte-hero-icons";

  const dsHandleSave = () => {
    ds.saveSession();  // Mark the document as saved
  };

  const dsNewSession = () => {
    ds.newSession('Untitled Script');  // Start a new session
  };
</script>

<div class="card bg-surface-50-900-token rounded-none h-[100%] grid grid-cols-[auto_1fr] w-full">
	<AppRail class="w-8">
		<!-- <svelte:fragment slot="lead">
			<AppRailAnchor href="#" ><Icon src="{ArrowUp}" size="16" style="margin:auto;"/></AppRailAnchor>
		</svelte:fragment> -->
		<!-- --- -->
		<AppRailTile 
			title="View split-pane"
			on:click={() => {panes.returnContentToSplit(); panes.showView(currentView); }} 
			bind:group={currentView} 
			name="tile-1" 
			value={0}>
			<svelte:fragment slot="lead">
				<Icon src="{ViewColumns}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View script"
			on:click={() => {panes.returnContentToSplit(); panes.moveContent('ct1', 'cr-full'); panes.showView(currentView); }} 
			bind:group={currentView} 
			name="tile-1" 
			value={1}>
			<svelte:fragment slot="lead">
				<Icon src="{CodeBracket}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View canvas"
			on:click={() => {panes.returnContentToSplit(); panes.moveContent('ct2', 'cr-full'); panes.showView(currentView); }} 
			bind:group={currentView} 
			name="tile-2" 
			value={2}>
			<svelte:fragment slot="lead">
				<Icon src="{Photo}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View controls" 
			on:click={() => {panes.returnContentToSplit(); panes.moveContent('ct3', 'cr-full'); panes.showView(currentView); }} 
			bind:group={currentView} 
			name="tile-3" 
			value={3}>
			<svelte:fragment slot="lead">
				<Icon src="{AdjustmentsHorizontal}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailAnchor 
			href="#" 
			title="Toggle fullscreen" 
			on:click={() => { isFullscreen = fs.toggleFullscreen(); }} 
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
		<ScriptStatusIndicator />
		<svelte:fragment slot="trail">
			<AppRailAnchor 
				href="#" 
				title="New Script" 
				on:click={dsNewSession}
				style="display:block;">
				<Icon src="{Document}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AppRailAnchor 
				href="#" 
				title="Save / Export / Share" 
				on:click={() => modalStore.trigger(modals.modalSave)}
				style="display:block;">
				<Icon src="{DocumentArrowUp}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AppRailAnchor 
				href="#" 
				title="Load / Import / Browse" 
				on:click={() => modalStore.trigger(modals.modalLoad)}
				style="display:block;">
				<Icon src="{DocumentArrowDown}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AppRailAnchor 
				href="#" 
				title="Reset panes" 
				on:click={() => {paneSizes = {...panes.resetPaneSizes()};}}
				style="display:block;">
				<Icon src="{ArrowPathRoundedSquare}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AppRailAnchor href="#" title="Toggle light or dark mode.">
				<LightSwitch />
			</AppRailAnchor>
			<AppRailAnchor 
				href="#" 
				title="About" 
				on:click={() => modalStore.trigger(modals.modalAbout)}
				style="display:block;">
				<Icon src="{QuestionMarkCircle}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
		</svelte:fragment>
	</AppRail>
	<div id="cr-panes" class="grid cr-dynamic">
		{#if orientationLandscape}
		<Splitpanes theme="skeleton-theme" style="width: 100%; height: 100%;">
		  <Pane minSize={20} bind:size={paneSizes.sizeLandscapePaneLeft}>
		  	<div id="cr-pane1"/>
		  </Pane>
		  <Pane minSize={20} bind:size={paneSizes.sizeLandscapePaneRight}>
		    <Splitpanes horizontal={true}>
		      <Pane minSize={15} bind:size={paneSizes.sizeLandscapePaneTopRight}>
		      	<div id="cr-pane2" />
		      </Pane>
		      <Pane bind:size={paneSizes.sizeLandscapePaneBottomRight}>
		      	<div id="cr-pane3" />
		      </Pane>
		    </Splitpanes>
		  </Pane>
		</Splitpanes>
		{:else}
		<Splitpanes theme="skeleton-theme" style="width: 100%; height: 100%;" horizontal={true}>
		  <Pane minSize={20} bind:size={paneSizes.sizePortraitPaneTop}>
		  	<div id="cr-pane1" />
		  </Pane>
      <Pane minSize={5} bind:size={paneSizes.sizePortraitPaneMid}>
      	<div id="cr-pane2" />
      </Pane>
      <Pane minSize={0} bind:size={paneSizes.sizePortraitPaneBot}>
      	<div id="cr-pane3"/>
      </Pane>
		</Splitpanes>
		{/if}
	</div>
	<div id="cr-full" class="cr-dynamic" />
	<div id="cr-staging">
		<div id="ct1">
	 		<div id="editor-wrap" bind:this={editorContainer} />						 		
		</div>
  	<div id="ct2">
  		<!-- Replace this with actual canvas -->
  		<div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-[100%] w-[100%]">
  			<span class="badge variant-soft">This is where the canvas would be.</span>
  			<span class="badge variant-soft">Current view: {currentView}</span>
  		</div>
  		<!-- / Replace this with actual canvas -->
    </div>	      
  	<div id="ct3">
  		<div class="overflow-x-auto flex">
  			<DocTitleBadge sessionID={dsCurrentSession.id} sessionName={dsCurrentSession.name} />
				<div class="ml-auto flex">
					<button class="badge m-1 {dsCurrentSession.unsavedChanges ? 'variant-ghost-primary' : 'variant-soft-primary'}" on:click={dsHandleSave}>
						Save
					</button> 
					<button class="badge m-1 variant-ghost-primary">
						Save Copy
					</button>
				</div>
			</div>
			<hr class="hr m-1" />
  		<span class="badge variant-soft">This is where the controls would be.</span>
  		<span class="badge variant-soft">Current view: {currentView}</span>
  	</div>
	</div>
</div>
<style>
  @import '$lib/styles/main.css';
  @import '$lib/styles/panes.css';
</style>