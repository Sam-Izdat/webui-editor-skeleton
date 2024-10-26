<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import type { ComponentType } from 'svelte';
	import { writable } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived'; 
	import { beforeNavigate } from "$app/navigation";
	import { browser } from '$app/environment';
  import { base } from '$app/paths';  
  import Device from 'svelte-device-info';
	import { strAboutText } from '$lib';
	import type { editor } from 'monaco-editor';

  import * as g from '$lib/globals';
  import { Log } from '$lib';
	import * as ds from '$lib/stores/doc_session';	
	import * as km from '$lib/keymap';

	// Global state
	import { 
		currentView,
		paneSizes,
		isAutoBuild,
		isFullscreen,
		orientationLandscape,
		isReadOnly,
		isDark,
	} from '$lib/stores';

	// Sessions
  let dsCurrentSession;
	const unsubscribeSession = ds.documentSession.subscribe(session => {
    dsCurrentSession = session;
  });

	// Handlers
  import { 
  	DocHandler, 
  	NavHandler,
  	ScreenHandler,
  	MobileHandler
  } from '$lib';

  let docHandler;			// Document actions (e.g. update, save, new, rename, make read-only)
  let navHandler; 		// SPA "navigation"
  let screenHandler; 	// Fullscreen
  let mobileHandler; 	// Mobile-specific UI handling

  // I/O observers  
  import { observeKeyboard } from '$lib/keybind';

	// Core components
	import { MonacoEditor, AnchorLightSwitch, AnchorScriptStatus, DocTitleBadge }  from '$lib/components';
	import * as panes from '$lib/panes';

  // Modals
  import { getModalStore } from '@skeletonlabs/skeleton';
	export const modalStore = getModalStore();
  import * as modals from '$lib/modals';
	
	// Unsaved changes guardrails
  beforeNavigate(({ cancel }) => {
	  if (dsCurrentSession.unsavedChanges) {
	    if (!confirm('You are about to navigate away, but you have unsaved changes. Proceed?')) {
	      cancel();
	    }
	  }
	});

  // Create a promise to wait for the editor instance
  const waitForEditorInstance = () => {
    return new Promise((resolve) => {
      // This callback is passed to the Monaco component
      setEditorInstance = (instance) => {
        monacoEditor = instance.detail;
        resolve(monacoEditor);  // Resolve promise when editor is ready
      };
    });
  };

  let setEditorInstance;

  // UI actions
  const requestSaveDoc = () => {
		if (dsCurrentSession.unsavedChanges) {
			if (dsCurrentSession.versionActive != dsCurrentSession.versionCount - 1) {
				modalStore.trigger({
					...modals.modalConfirm, 
					message: `You are saving over an old version. Overwrite it?`,
					txtConfirm: `Overwrite v${dsCurrentSession.versionActive}`,
					txtCancel: `Save as v${dsCurrentSession.versionCount}`,
					onConfirm: docHandler.saveDoc,
					onCancel: docHandler.saveDocNewVersion,
				});
			} else { docHandler.saveDoc(); }
		} else { Log.toastInfo('no changes to save') }			      		
	};

	const requestSaveDocNewVersion = () => {
		if (dsCurrentSession.unsavedChanges) {
			docHandler.saveDocNewVersion();
			Log.toastWarning('requestSaveDocNewVersion');
		} else { Log.toastInfo('no changes to save') }
	};
	const requestSwitchDocVersion = () => {
		Log.toastWarning('requestSwitchDocVersion')
		// if (dsCurrentSession.unsavedChanges) {
		// 	docHandler.saveDocNewVersion();
		// 	Log.toastWarning('requestSaveDocNewVersion');
		// } else { Log.toastInfo('no changes to save') }
	};
	const requestNewDoc = () => {
		if (dsCurrentSession.unsavedChanges){
			modalStore.trigger({
				...modals.modalConfirm, 
				message: "Unsaved changes will be discarded. Create a new script anyway?",
				txtConfirm: "New Script",
				onConfirm: docHandler.newDoc
			});
		} else {
			docHandler.newDoc();
		}
	};

	const requestRename = () => {
		modalStore.trigger({
			...modals.modalInput, 
			message: 'What shall we call this?',
			placeholder: 'Script Name',
			inputValue: dsCurrentSession.docName,
			onConfirm: (inputVal) => { docHandler.renameDoc(inputVal); }
		})
	};

	const requestSaveMenu = () => {
		modalStore.trigger({
			...modals.modalSave, 
			session: dsCurrentSession,
			localSaveDocCallback: requestSaveDoc,
			localSaveDocNewVersionCallback: requestSaveDocNewVersion,
		})
	};

	let monacoEditor: editor.IStandaloneCodeEditor;

	// When browser stuff is available
	onMount(async () => {
		await waitForEditorInstance(); 

    // Listen for changes in Monaco editor and update the store
    monacoEditor.onDidChangeModelContent(() => {
      const content = monacoEditor.getValue();
      docHandler.updateDoc(content);
    });

		// Populate panes
		panes.returnContentToSplit();
		
		// Set up handlers
  	docHandler 		= new DocHandler(dsCurrentSession, monacoEditor);
  	navHandler 		= new NavHandler();
  	screenHandler = new ScreenHandler(window);
  	mobileHandler = new MobileHandler(window);

    // Check if an uploaded file exists in sessionStorage or localStorage
    const fileData = sessionStorage.getItem('activeFile'); 
    let contentToLoad; 
    if (fileData) {
      const file = JSON.parse(fileData);
      contentToLoad = file[0].content || null; 
    }


    docHandler.newDoc(contentToLoad);

		// Listen for orientation changes and do initial check
		window.screen.orientation.onchange = () => {
			// Don't shorten to just arrow - this has to be in curlies now... for some reason.
			mobileHandler.orientationChange();
		};
		mobileHandler.orientationChange();

		// Turn off editing by default on mobile devices, because soft keys suck
		if (Device.isMobile) docHandler.disableEditing();

		// Custom events from keybind
    observeKeyboard();
    window.addEventListener('save-document', requestSaveDoc);
    window.addEventListener('save-document-new-version', requestSaveDocNewVersion);
    window.addEventListener('switch-document-version', requestSwitchDocVersion);
    window.addEventListener('new-document', requestNewDoc);
    window.addEventListener('rename-document', requestRename);
    window.addEventListener('switch-view', navHandler.switchViewEvent);
	});

	// Not actually necessary in present state, but just to be thorough.
	onDestroy(() => {
		if ( browser ) {
	    // window.removeEventListener('save-document', requestSaveDoc);
	    // window.removeEventListener('save-document-new-version', requestSaveDocNewVersion);
	    // window.removeEventListener('switch-document-version', requestSwitchDocVersion);
	    // window.removeEventListener('new-document', requestNewDoc);
	    // window.removeEventListener('rename-document', requestRename);
	    // window.removeEventListener('switch-view', navHandler.switchViewEvent);

			monacoEditor?.dispose();
	  	docHandler?.dispose();
	  	navHandler?.dispose();
	  	screenHandler?.dispose();
	  	mobileHandler?.dispose();
		}

  	unsubscribeSession();
	});

 	import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';

  import { Pane, Splitpanes } from 'svelte-splitpanes';
  // let currentView: number = 0;

  // Icons

  import { 
  	Icon, 
  	ArrowUp, 
  	ViewColumns, 
  	CodeBracket, 
  	AdjustmentsHorizontal,
  	PlayCircle,
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
  	ArrowPath,
  	ArrowDownOnSquare,
  	ArrowDownOnSquareStack,
  	ArrowUpTray
  } from "svelte-hero-icons";
</script>

<div class="card bg-surface-50-900-token rounded-none h-[100%] grid grid-cols-[auto_1fr] w-full">
	<AppRail class="w-8">
		<!-- <svelte:fragment slot="lead">
			<AppRailAnchor href="#" ><Icon src="{ArrowUp}" size="16" style="margin:auto;"/></AppRailAnchor>
		</svelte:fragment> -->
		<!-- --- -->
		<AppRailTile 
			title="Split-Pane"
			bind:group={$currentView} 
			name="tile-0" 
			value={0}>
			<svelte:fragment slot="lead">
				<Icon src="{ViewColumns}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View Script"
			bind:group={$currentView} 
			name="tile-1" 
			value={1}>
			<svelte:fragment slot="lead">
				<Icon src="{CodeBracket}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View Canvas"
			bind:group={$currentView} 
			name="tile-2" 
			value={2}>
			<svelte:fragment slot="lead">
				<Icon src="{Photo}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View Controls" 
			bind:group={$currentView} 
			name="tile-3" 
			value={3}>
			<svelte:fragment slot="lead">
				<Icon src="{AdjustmentsHorizontal}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<hr classs="hr m-1"/>
		<AnchorScriptStatus />
		<hr classs="hr m-1"/>
		<AppRailAnchor 
			href="#" 
			title="Toggle Auto-Build" 
			on:click={() => { isAutoBuild.set(!$isAutoBuild); }} 
			class={$isAutoBuild ? 'bg-tertiary-500' : ''} 
			style="display:block;">
			<Icon src="{PlayCircle}" size="16" style="margin: 4px auto;" solid/>
		</AppRailAnchor>
		<AppRailAnchor 
			href="#" 
			title="Toggle Fullscreen" 
			on:click={screenHandler.toggleFullscreen} 
			class={$isFullscreen ? 'bg-tertiary-500' : ''} 
			style="display:block;">
			<Icon src="{ArrowsPointingOut}" size="16" style="margin: 4px auto;" solid/>
		</AppRailAnchor>
		<AppRailAnchor 
			href="#" 
			title="Toggle Read-Only" 
			on:click={docHandler.toggleEditing} 
			class={$isReadOnly ? 'bg-tertiary-500' : ''} 
			style="display:block;">
			<Icon src="{$isReadOnly ? LockClosed : LockOpen}" size="16" style="margin: 4px auto;" solid/>
		</AppRailAnchor>
		<svelte:fragment slot="trail">
			<AppRailAnchor 
				href="#" 
				title="New Script (alt+{km.keyNewDoc})" 
				on:click={requestNewDoc}
				style="display:block;">
				<Icon src="{Document}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AppRailAnchor 
				href="#" 
				title="Save / Export / Share" 
				on:click={requestSaveMenu}
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
				title="Reset Panes" 
				on:click={() => {paneSizes.set({...panes.resetPaneSizes()});}}
				style="display:block;">
				<Icon src="{ArrowPath}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AnchorLightSwitch />
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
		{#if $orientationLandscape}
		<Splitpanes theme="skeleton-theme" style="width: 100%; height: 100%;">
		  <Pane minSize={20} bind:size={$paneSizes.sizeLandscapePaneLeft}>
		  	<div id="cr-pane1"/>
		  </Pane>
		  <Pane minSize={20} bind:size={$paneSizes.sizeLandscapePaneRight}>
		    <Splitpanes horizontal={true}>
		      <Pane minSize={15} bind:size={$paneSizes.sizeLandscapePaneTopRight}>
		      	<div id="cr-pane2" />
		      </Pane>
		      <Pane bind:size={$paneSizes.sizeLandscapePaneBottomRight}>
		      	<div id="cr-pane3" />
		      </Pane>
		    </Splitpanes>
		  </Pane>
		</Splitpanes>
		{:else}
		<Splitpanes theme="skeleton-theme" style="width: 100%; height: 100%;" horizontal={true}>
		  <Pane minSize={20} bind:size={$paneSizes.sizePortraitPaneTop}>
		  	<div id="cr-pane1" />
		  </Pane>
      <Pane minSize={5} bind:size={$paneSizes.sizePortraitPaneMid}>
      	<div id="cr-pane2" />
      </Pane>
      <Pane minSize={0} bind:size={$paneSizes.sizePortraitPaneBot}>
      	<div id="cr-pane3"/>
      </Pane>
		</Splitpanes>
		{/if}
	</div>
	<div id="cr-full" class="cr-dynamic" />
	<div id="cr-staging">
		<div id="ct1">
	 		<MonacoEditor editorInstance={monacoEditor} on:init={setEditorInstance} />
		</div>
  	<div id="ct2">
  		<!-- Replace this with actual canvas -->
  		<div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-[100%] w-[100%]">
  			<span class="badge variant-soft">This is where the canvas would be.</span>
  			<span class="badge variant-soft">Current view: {$currentView}</span>
  		</div>
  		<!-- / Replace this with actual canvas -->
    </div>	      
  	<div id="ct3">
  		<div class="overflow-x-auto flex">
			  <DocTitleBadge session={dsCurrentSession} renameCallback={requestRename} switchVersionCallback={requestSwitchDocVersion} />
			  <div class="ml-auto flex">
			    <button 
			    	title="Save (alt+{km.keySaveDoc} / ctrl+{km.keySaveDoc})" 
			    	class="badge m-1 {dsCurrentSession.unsavedChanges ? 'variant-ghost-primary' : 'variant-soft-primary'}" 
			      on:click={requestSaveDoc}
			    >
			      <Icon src="{ArrowDownOnSquare}" size="16" style="margin: 2px auto;" solid/>
			      <span class="hidden lg:inline ml-2">Save</span>
			    </button> 
			    <button 
			    	title="Save New (alt+{km.keySaveDocNewVersion})"
			    	class="badge m-1 {dsCurrentSession.unsavedChanges ? 'variant-ghost-primary' : 'variant-soft-primary'}"
			      on:click={requestSaveDocNewVersion}
			    >
			      <Icon src="{ArrowDownOnSquareStack}" size="16" style="margin: 2px auto;" solid/>
			      <span class="hidden lg:inline ml-2">Save v{dsCurrentSession.versionActive}</span>
			    </button>
			    <button title="Export" class="badge m-1 variant-ghost-primary">
			      <Icon src="{ArrowUpTray}" size="16" style="margin: 2px auto;" solid/>
			      <span class="hidden lg:inline ml-2">Export</span>
			    </button>
			  </div>
			</div>
			<hr class="hr m-1" />
  		<span class="badge variant-soft">This is where the controls would be.</span>
  		<span class="badge variant-soft">Current view: {$currentView}</span>
  	</div>
	</div>
</div>
<style>
  @import '$lib/styles/main.css';
  @import '$lib/styles/panes.css';
</style>