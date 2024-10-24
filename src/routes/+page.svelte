<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
  import { base } from '$app/paths';  
  import * as g from '$lib/globals';
  import { Log } from '$lib';
  import Device from 'svelte-device-info';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { strInitialEditorContents } from '$lib';
	import { strAboutText } from '$lib'

  setTimeout(() => Log.debug('This is a message', 123.21324, (2+2)));
  setTimeout(() => Log.debug('This is a different message'), 1000);
  setTimeout(() => Log.debug('This is a third longer message with a bunch of works to see what happens if the content is pretty long actually'), 2000);
  setTimeout(() => Log.toastInfo('This is an info toast'), 500);
  setTimeout(() => Log.toastSuccess('This is a success toast'), 1500);
  setTimeout(() => Log.toastWarning('This is a warning toast'), 2500);
  setTimeout(() => Log.toastError('This is an error toast'), 3500);

	// Monaco setup
	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	// Dark mode
	import  { LightSwitch, ScriptStatusIndicator }  from '$lib/components';
	import * as darkmode from '$lib/darkmode';

  // Code editor control
	let codeEditor = null;
	let readonly = false;

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

	// Pane defaults
  let sizeLandscapePaneLeft;
  let sizeLandscapePaneRight;
  let sizeLandscapePaneTopRight;
  let sizeLandscapePaneBottomRight;
  let sizePortraitPaneTop;
  let sizePortraitPaneMid;
  let sizePortraitPaneBot;

	const resetPaneSizes = () => {
	  sizeLandscapePaneLeft = 65;
	  sizeLandscapePaneRight = 35;
	  sizeLandscapePaneTopRight = 40;
	  sizeLandscapePaneBottomRight = 60;
	  sizePortraitPaneTop = 65;
	  sizePortraitPaneMid = 35;
	  sizePortraitPaneBot = 0;
	};

  // Fullescreen
  let isFullscreen = false;
  import * as fullscreen from '$lib/fullscreen';

  // Modal
  import { getModalStore } from '@skeletonlabs/skeleton';
	export const modalStore = getModalStore();
  import * as modals from '$lib/modals';



	// SPA Navigation
	const movePaneContent = (idContent, idContainer) => {
		const source = document.querySelector('#'+idContent);
		const dest = document.querySelector('#'+idContainer);
		dest.appendChild(source);
		dest.style.display = "block";
		if (currentView == 0) { // split pane
			document.querySelector('#cr-full').style.display = "none";
			document.querySelector('#cr-panes').style.display = "block";
		} else {			
			document.querySelector('#cr-full').style.display = "block";
			document.querySelector('#cr-panes').style.display = "none";
		}
	};

	const moveContentToStaging = () => {
		movePaneContent('ct1', 'cr-staging');
		movePaneContent('ct2', 'cr-staging');
		movePaneContent('ct3', 'cr-staging');
	};

	const returnContentToPanes = () => {
		movePaneContent('ct1', 'cr-pane1');
		movePaneContent('ct2', 'cr-pane2');
		movePaneContent('ct3', 'cr-pane3');
    document.querySelector('#cr-full').style.display = "none";
	};

  // Mobile orientation
  let orientationLandscape = true;

	const handleOrientationChange = async () => {
		if (orientationLandscape && screen.orientation.type.startsWith('portrait')) {
	    moveContentToStaging();
	    orientationLandscape = false;		  
		  await tick(); // Wait for DOM to be updated
	  	returnContentToPanes();
	  	if (currentView == 1) movePaneContent('ct1', 'cr-full');
	  	else if (currentView == 2) movePaneContent('ct2', 'cr-full');
	  	else if (currentView == 3) movePaneContent('ct3', 'cr-full');
	  } else  {
	    moveContentToStaging();
	    orientationLandscape = true;
		  await tick();
	  	returnContentToPanes();
	  	if (currentView == 1) movePaneContent('ct1', 'cr-full');
	  	else if (currentView == 2) movePaneContent('ct2', 'cr-full');
	  	else if (currentView == 3) movePaneContent('ct3', 'cr-full');
	  }
	};
	
	// When browser is ready...
	onMount(async () => {
		window.Log = Log;
		// Reset and populate paness
		resetPaneSizes();
		returnContentToPanes();

		// Set theme
		document.querySelector('body').setAttribute('data-theme', g.APP_THEME);

		// Import monaco
		monaco = (await import('./monaco')).default;

		codeEditor = monaco.editor.create(editorContainer, {
	    value: "",
	    language: "c",
	    minimap: {
	      enabled: false,
	    },
	    tabSize: 2,
	    automaticLayout: true,
	    theme: darkmode.isDarkMode() ? 'vs-dark' : 'vs-light',
	  });

    // Check if an uploaded file exists in sessionStorage or localStorage
    const fileData = sessionStorage.getItem('activeFile'); // Or localStorage if you prefer
    let contentToLoad = strInitialEditorContents; // Default content
    if (fileData) {
      const file = JSON.parse(fileData);
      Log.debug('@@@@@@ FILE DATA', file, file[0], file[0] || 'foo'); // FIXME
      contentToLoad = file[0].content || strInitialEditorContents; // Load the file content if it exists      
    } 
		
		// Start the monaco engine
		const model = monaco.editor.createModel('',	'c');
		codeEditor.setModel(model);
    codeEditor.setValue(contentToLoad);
		
		// Turn off mobile typing help bullshit, if any of it is on
		const monacoTextarea = document.querySelector('.monaco-editor textarea');
		monacoTextarea.setAttribute('autocomplete', 'off'); 
		monacoTextarea.setAttribute('autocorrect', 'off'); 
		monacoTextarea.setAttribute('autocapitalize', 'off');
		monacoTextarea.setAttribute('spellcheck', false);

		// Watch for changes from light to dark mode
		darkmode.observeThemeChange(monaco.editor);

		// Listen for orientation changes and do initial check
		window.screen.orientation.onchange = handleOrientationChange;
		handleOrientationChange();

		// Turn off editing by default on mobile devices, because soft keys suck
		if (Device.isMobile) disableEditing();
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
  	DocumentArrowUp,
  	DocumentArrowDown,
  	ArrowPathRoundedSquare
  } from "svelte-hero-icons";

	// Log.scriptError('Aaaa new error occurred!');
	Log.clearScriptLog();
	// Log.scriptError('Aaaa new error occurred!');
	// Log.scriptWarning('This is a warning message.');
	// Log.scriptInfo('Just an informational update.');
	// Log.scriptSuccess('Action completed successfully!');

</script>

<div class="card bg-surface-50-900-token rounded-none h-[100%] grid grid-cols-[auto_1fr] w-full">
	<AppRail class="w-8">
		<!-- <svelte:fragment slot="lead">
			<AppRailAnchor href="#" ><Icon src="{ArrowUp}" size="16" style="margin:auto;"/></AppRailAnchor>
		</svelte:fragment> -->
		<!-- --- -->
		<AppRailTile 
			title="View split-pane"
			on:click={() => {returnContentToPanes(); }} 
			bind:group={currentView} 
			name="tile-1" 
			value={0}>
			<svelte:fragment slot="lead">
				<Icon src="{ViewColumns}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View script"
			on:click={() => {returnContentToPanes(); movePaneContent('ct1', 'cr-full'); }} 
			bind:group={currentView} 
			name="tile-1" 
			value={1}>
			<svelte:fragment slot="lead">
				<Icon src="{CodeBracket}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View canvas"
			on:click={() => {returnContentToPanes(); movePaneContent('ct2', 'cr-full'); }} 
			bind:group={currentView} 
			name="tile-2" 
			value={2}>
			<svelte:fragment slot="lead">
				<Icon src="{Photo}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View controls" 
			on:click={() => {returnContentToPanes(); movePaneContent('ct3', 'cr-full'); }} 
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
			on:click={() => { isFullscreen = fullscreen.toggleFullscreen(); }} 
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
				on:click={resetPaneSizes}
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
		  <Pane minSize={20} bind:size={sizeLandscapePaneLeft}>
		  	<div id="cr-pane1"/>
		  </Pane>
		  <Pane minSize={20} bind:size={sizeLandscapePaneRight}>
		    <Splitpanes horizontal={true}>
		      <Pane minSize={15} bind:size={sizeLandscapePaneTopRight}>
		      	<div id="cr-pane2" />
		      </Pane>
		      <Pane bind:size={sizeLandscapePaneBottomRight}>
		      	<div id="cr-pane3" />
		      </Pane>
		    </Splitpanes>
		  </Pane>
		</Splitpanes>
		{:else}
		<Splitpanes theme="skeleton-theme" style="width: 100%; height: 100%;" horizontal={true}>
		  <Pane minSize={20} bind:size={sizePortraitPaneTop}>
		  	<div id="cr-pane1" />
		  </Pane>
      <Pane minSize={5} bind:size={sizePortraitPaneMid}>
      	<div id="cr-pane2" />
      </Pane>
      <Pane minSize={0} bind:size={sizePortraitPaneBot}>
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
  		<span class="badge variant-soft">This is where the controls would be.</span>
  		<span class="badge variant-soft">Current view: {currentView}</span>
  	</div>
	</div>
</div>
<style>
  @import '$lib/styles/main.css';
</style>