<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import type { ComponentType } from 'svelte';
	import { writable } from 'svelte/store';
	import { propertyStore } from 'svelte-writable-derived'; 
	import { beforeNavigate } from "$app/navigation";
	import { browser } from '$app/environment';
  import { base } from '$app/paths';  
  import Device from 'svelte-device-info';
	import { pulseEditorBackground } from '$lib';
	import type { editor } from 'monaco-editor';

  import { cfg } from '$root/webui.config.js';
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
	import { MonacoEditor, AnchorLightSwitch, AnchorScriptStatus, DocTitleBadge, DocMenuBadge }  from '$lib/components';
	import * as panes from '$lib/panes';

  // Modals, Drawers
  import { getModalStore, getDrawerStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	const drawerStore = getDrawerStore();
  import * as modals from '$lib/modals';

  import { drawerContentStore } from '$lib/stores/drawer';
  import DrawerArchive from '$lib/components/drawer_archive.svelte';
	import { get } from 'svelte/store';
	const drawerSettings: DrawerSettings = {
		id: 'archive-drawer',
		width: 'w-[340px] md:w-[720px]',
		padding: 'p-0',
		position: 'right',
	};

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
	const reqOpenArchiveDrawer = async () => {
		if (!$drawerStore.open){
	    await docHandler.refreshDocList();
	    drawerContentStore.set({
	      id: 'archive',
	      component: DrawerArchive,
	      props: {
	      	deleteDocCallback: reqDeleteDoc,
	      	loadDocCallback: reqLoadDoc,
	      	saveDocCallback: reqSaveDoc,
	      	saveDocNewVersionCallback: reqSaveDocNewVersion,
	      },
	    });
			drawerStore.open(drawerSettings);
		} else {
			drawerStore.close();
		}
  };

  const reqResetPanes = () => paneSizes.set({...panes.resetPaneSizes()});

  let autoBuildTimeoutID: number;

  const reqBuild = () => {
  	Log.clearScriptLog();

  	let buildSuccessFul = true;
  	let flashCol = buildSuccessFul 
			? ($isDark ? cfg.BUILD_COL_SUCCESS[0] : cfg.BUILD_COL_SUCCESS[1])
			: ($isDark ? cfg.BUILD_COL_FAILURE[0] : cfg.BUILD_COL_FAILURE[1]);
  	pulseEditorBackground(flashCol, cfg.BUILD_FLASH_DUR) ;

  	// Insert your build code here

  	if (buildSuccessFul) {
  		Log.scriptSuccess('Build successful (except not really because this is a template)')	
  	} else {
  		Log.scriptError('There was a problem! (except not really because this is a template)')
  	}
  	
  }
	const reqNewDoc = () => {
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
		Log.clearScriptLog();
	};

	const reqLoadDoc = async (uuid: string, adapter: string) => {
		if (dsCurrentSession.unsavedChanges){
			modalStore.trigger({
				...modals.modalConfirm, 
				message: "Unsaved changes will be discarded. Load a new script anyway?",
				txtConfirm: "Load Script",
				onConfirm: async () => { 
					await docHandler.loadDoc(uuid, adapter); 
					drawerStore.close(); 
				},
			});
		} else {
			docHandler.loadDoc(uuid, adapter); 
			drawerStore.close();
		}
		Log.clearScriptLog();
	};

	const reqForkDoc = () => {
		if (dsCurrentSession.unsavedChanges){
			modalStore.trigger({
				...modals.modalConfirm, 
				message: "Unsaved changes will be discarded. Fork script anyway?",
				txtConfirm: "Fork Script",
				onConfirm: docHandler.forkDoc,
			});
		} else {
			docHandler.forkDoc();
		}
		reqRenameDoc();
		Log.clearScriptLog();
	};

	const reqImportFile = (content: string, baseFilename?: string) => {
		if (dsCurrentSession.unsavedChanges){
			modalStore.trigger({
				...modals.modalConfirm, 
				message: "Unsaved changes will be discarded. Import file anyway?",
				txtConfirm: "Import File",
				onConfirm: () => { docHandler.newDoc(content, baseFilename ?? ''); },
			});
		} else {
			docHandler.newDoc(content, baseFilename ?? '');
		}
		modalStore.close();
		reqRenameDoc(baseFilename ?? '');
		Log.clearScriptLog();
	};

	const reqExportFile = () => {
		let content:string = docHandler.getCurrentEditorContent();
		let filename = dsCurrentSession.docName;
		const blob = new Blob([content], { type: "application/octet-stream" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = filename.trim().replace(/[\/:*?"<>|]/g, "")+cfg.PWA_FILE_EXT;
	  document.body.appendChild(link);
	  link.click();
	  document.body.removeChild(link);
	  URL.revokeObjectURL(link.href);
	};

  const reqSaveDoc = async () => {
		if (dsCurrentSession.unsavedChanges) {
			if (dsCurrentSession.versionActive != dsCurrentSession.versionCount - 1) {
				modalStore.trigger({
					...modals.modalConfirm, 
					message: `You are saving over an old version. Overwrite it?`,
					txtConfirm: `Overwrite v${dsCurrentSession.versionActive}`,
					txtCancel: `Save as v${dsCurrentSession.versionCount}`,
					onConfirm: async () => { await docHandler.saveDoc() },
					onCancel: reqSaveDocNewVersion,
				});
			} else { 
				await docHandler.saveDoc(); 
				await docHandler.refreshDocList(); 
			}
		} else { Log.toastInfo('no changes to save') }
		reqBuild();
	};

	const reqSaveDocNewVersion = async () => {
		if (dsCurrentSession.unsavedChanges) {
			await docHandler.saveDocNewVersion();
			docHandler.loadLastVersion();
    	docHandler.refreshDocList();
		} else { Log.toastInfo('no changes to save') }
		reqBuild();
	};

	const reqDeleteDoc = async (uuid: string, adapter: string) => {
		modalStore.trigger({
			...modals.modalConfirm, 
			message: "Delete script?",
			txtConfirm: "Delete",
			onConfirm: async () => { 
				await docHandler.deleteDoc(uuid, adapter);
				await docHandler.refreshDocList();
			},
		});
	};

	const reqSwitchDocVersion = (v) => {
		if (dsCurrentSession.unsavedChanges){
			modalStore.trigger({
				...modals.modalConfirm, 
				message: "Unsaved changes will be discarded. Load version anyway?",
				txtConfirm: `Switch to v${v}`,
				onConfirm: () => { docHandler.loadVersion(parseInt(v)); },
			});
		} else {
			docHandler.loadVersion(parseInt(v));
		}
		Log.clearScriptLog();
	};

	const reqRevertDoc = () => {
		if (dsCurrentSession.unsavedChanges){
			modalStore.trigger({
				...modals.modalConfirm, 
				message: "Revert to last saved changes?",
				txtConfirm: `Revert`,
				onConfirm: () => { docHandler.loadVersion(parseInt(dsCurrentSession.versionActive)); },
			});
		} else {
			Log.toastInfo('no changes to revert')
		}
		Log.clearScriptLog();
	}

	const reqRenameDoc = (name?: string) => {
		modalStore.trigger({
			...modals.modalInput, 
			message: 'What shall we call this?',
			placeholder: 'Script Name',
			inputValue: typeof name === 'string' ? name : dsCurrentSession.docName,
			txtConfirm: 'Rename',
			onConfirm: (inputVal) => { docHandler.renameDoc(inputVal); }
		})
		Log.clearScriptLog();
	};

	const reqSaveMenu = () => {
		modalStore.trigger({
			...modals.modalSave, 
			session: dsCurrentSession,
			localSaveDocCallback: reqSaveDoc,
			localSaveDocNewVersionCallback: reqSaveDocNewVersion,
		})
	};

	let monacoEditor: editor.IStandaloneCodeEditor;

  $: fileSystemAccessSupported = false;
  $: persistentStorageAvailable = false;

  let checkStorageSupport = async () => {
    if (browser){
      fileSystemAccessSupported = ('showOpenFilePicker' in self);
      persistentStorageAvailable = await navigator.storage.persist();
    }
  }

	// When browser stuff is available
	onMount(async () => {
    document.querySelector('body').setAttribute('data-theme', cfg.APP_THEME);

    try {
    	await checkStorageSupport();
    } catch(e) {
    	Log.error(e);
    }

		await waitForEditorInstance(); 
		
    // Listen for changes in Monaco editor and update the store
    monacoEditor.onDidChangeModelContent(() => {
      const content = monacoEditor.getValue();
      docHandler.updateDoc(content);
  		Log.clearScriptLog();
      if ($isAutoBuild) {
		  	clearTimeout(autoBuildTimeoutID);  	
		  	autoBuildTimeoutID = setTimeout(reqBuild, cfg.AUTOBUILD_DELAY);
      }
    });

		// Populate panes
		panes.returnContentToSplit();
		
		// Set up handlers
  	docHandler 		= new DocHandler(dsCurrentSession, monacoEditor);
  	navHandler 		= new NavHandler();
  	screenHandler = new ScreenHandler(window);
  	mobileHandler = new MobileHandler(window);

    // Check if an uploaded file exists in sessionStorage
    const fileData = sessionStorage.getItem('importRequestFile'); 
    sessionStorage.removeItem('importRequestFile');
    const importRequestView = sessionStorage.getItem('importRequestView');
    if (importRequestView !== null && +importRequestView <= 3 && +importRequestView >= 0) {
    	$currentView = parseInt(importRequestView);
    	sessionStorage.removeItem('importRequestView');
    }
    const importRequestAutoBuild = sessionStorage.getItem('importRequestAutoBuild');
    if (importRequestAutoBuild !== null) {
    	isAutoBuild.set(!!+importRequestAutoBuild)
    	sessionStorage.removeItem('importRequestAutoBuild');
    }
    const importRequestReadOnly = sessionStorage.getItem('importRequestReadOnly');
    if (importRequestReadOnly !== null) {
    	!!+importRequestReadOnly ? docHandler.disableEditing() : docHandler.enableEditing();
    	sessionStorage.removeItem('importRequestReadOnly');
    }

    let contentToLoad; 
    if (fileData) {
      const file = JSON.parse(fileData);
      contentToLoad = file[0].content || null; 
    }


    docHandler.newDoc(contentToLoad);

		// Listen for orientation changes and do initial check
		window.screen.orientation.onchange = () => {
			// Don't shorten to just arrow - this has to be in curlies... for some reason.
			mobileHandler.orientationChange();
		};
		mobileHandler.orientationChange();

		// Turn off editing by default on mobile devices, because soft keys suck
		if (Device.isMobile && cfg.MOBILE_READONLY) docHandler.disableEditing();

		// Custom events from keybind
    observeKeyboard();
    window.addEventListener('save-document', reqSaveDoc);
    window.addEventListener('save-document-new-version', reqSaveDocNewVersion);
    window.addEventListener('new-document', reqNewDoc);
    window.addEventListener('rename-document', reqRenameDoc);
    window.addEventListener('archive-shelf', reqOpenArchiveDrawer);
    window.addEventListener('switch-view', navHandler.switchViewEvent);
    window.addEventListener('build-script', reqBuild);

    reqBuild();
	});

	// Not actually necessary in present state, but just to be thorough.
	onDestroy(() => {
		if (browser) {
	    window.removeEventListener('save-document', reqSaveDoc);
	    window.removeEventListener('save-document-new-version', reqSaveDocNewVersion);
	    window.removeEventListener('new-document', reqNewDoc);
	    window.removeEventListener('rename-document', reqRenameDoc);
    	window.removeEventListener('archive-shelf', reqOpenArchiveDrawer);
	    window.removeEventListener('switch-view', navHandler.switchViewEvent);
    	window.removeEventListener('build-script', reqBuild);

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

  // Icons
  import { Icon } from 'svelte-hero-icons';
  import * as hero from 'svelte-hero-icons';
  import { CustomIcon } from '$lib/components/icons';
  import * as ico from '$lib/components/icons';
</script>

<div class="card bg-surface-50-900-token rounded-none h-[100%] grid grid-cols-[auto_1fr] w-full">
	<AppRail class="w-8">
		<AppRailTile 
			title="Split-Pane"
			bind:group={$currentView} 
			name="tile-0" 
			value={0}>
			<svelte:fragment slot="lead">
				<Icon src="{hero.ViewColumns}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View Code"
			bind:group={$currentView} 
			name="tile-1" 
			value={1}>
			<svelte:fragment slot="lead">
				<Icon src="{hero.CodeBracket}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View Canvas"
			bind:group={$currentView} 
			name="tile-2" 
			value={2}>
			<svelte:fragment slot="lead">
				<Icon src="{hero.Photo}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<AppRailTile 
			title="View Controls" 
			bind:group={$currentView} 
			name="tile-3" 
			value={3}>
			<svelte:fragment slot="lead">
				<Icon src="{hero.AdjustmentsHorizontal}" size="16" style="margin: 4px auto;" solid/>
			</svelte:fragment>
		</AppRailTile>
		<hr classs="hr m-1"/>
		<AnchorScriptStatus buildCallback={reqBuild} />
		<AppRailAnchor 
			href="#" 
			title="Toggle Auto-Build" 
			on:click={() => { isAutoBuild.set(!$isAutoBuild); }} 
			class={$isAutoBuild ? 'bg-tertiary-500' : ''} 
			style="display:block;">
			<Icon src="{hero.PlayCircle}" size="16" style="margin: 4px auto;" solid/>
		</AppRailAnchor>
		<hr classs="hr m-1"/>
		<AppRailAnchor 
			href="#" 
			title="Toggle Read-Only" 
			on:click={docHandler.toggleEditing} 
			class={$isReadOnly ? 'bg-tertiary-500' : ''} 
			style="display:block;">
			<Icon src="{$isReadOnly ? hero.LockClosed : hero.LockOpen}" size="16" style="margin: 4px auto;" solid/>
		</AppRailAnchor>
		<AppRailAnchor 
			href="#" 
			title="Toggle Fullscreen" 
			on:click={screenHandler.toggleFullscreen} 
			class={$isFullscreen ? 'bg-tertiary-500' : ''} 
			style="display:block;">
			<Icon src="{hero.ArrowsPointingOut}" size="16" style="margin: 4px auto;" solid/>
		</AppRailAnchor>
		<svelte:fragment slot="trail">
			<AppRailAnchor 
				href="#" 
				title="New Script (alt+{km.keyNewDoc})" 
				on:click={reqNewDoc}
				style="display:block;">
				<Icon src="{hero.Document}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AppRailAnchor 
				href="#" 
				title="Archive (alt+{km.keyArchive})" 
				on:click={reqOpenArchiveDrawer}
				style="display:block;">
				<Icon src="{hero.Folder}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AppRailAnchor 
				href="#" 
				title="Import / Export" 
				on:click={() => modalStore.trigger({
					...modals.modalImportExport, 
					importFileCallback: reqImportFile,
					exportFileCallback: reqExportFile,
				})}
				style="display:block;">
				<Icon src="{hero.ArrowsUpDown}" size="16" style="margin: 4px auto;" solid/>
			</AppRailAnchor>
			<AnchorLightSwitch />
			<AppRailAnchor 
				href="#" 
				title="About" 
				on:click={() => modalStore.trigger(modals.modalAbout)}
				style="display:block;">
				<Icon src="{hero.QuestionMarkCircle}" size="16" style="margin: 4px auto;" solid/>
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
	<div id="cr-full" class="cr-dynamic hidden" />
	<div id="cr-staging" class="hidden">
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
  	<div id="ct3" class="divide-y divide-surface-400/10">
  		<div class="overflow-x-auto flex p-1">
		    <button 
		    	title="Save (alt+{km.keySaveDoc} / ctrl+{km.keySaveDoc})" 
		    	class="badge m-1 {dsCurrentSession.unsavedChanges ? 'variant-ghost-primary' : 'variant-soft-primary'}" 
		      on:click={reqSaveDoc}
		    >
		      <Icon src="{hero.ArrowDownOnSquare}" size="16" style="margin: 2px auto;" solid/>
		      <span class="hidden lg:inline ml-2">Save</span>
		    </button> 
		    <button 
		    	title="Save v{dsCurrentSession.versionCount} (alt+{km.keySaveDocNewVersion})"
		    	class="badge m-1 {dsCurrentSession.unsavedChanges ? 'variant-ghost-primary' : 'variant-soft-primary'}"
		      on:click={reqSaveDocNewVersion}
		    >
		      <Icon src="{hero.ArrowDownOnSquareStack}" size="16" style="margin: 2px auto;" solid/>
		      <span class="hidden lg:inline ml-2">Save v{dsCurrentSession.versionCount}</span>
		    </button>
			  <div class="ml-auto flex">
				  <DocTitleBadge renameCallback={reqRenameDoc} switchVersionCallback={reqSwitchDocVersion} />
				  <DocMenuBadge 
				  	revertCallback={reqRevertDoc} 
				  	resetPanesCallback={reqResetPanes} 
				  	forkCallback={reqForkDoc} 
				  	exportCallback={reqExportFile}
				  />
			  </div>
			</div>
			<div class="flex p-1">
	  		<span class="badge variant-soft">This is where the controls would be.</span>
	  		<span class="badge variant-soft">Current view: {$currentView}</span>
	  	</div>
  	</div>
	</div>
</div>
<style>
  @import '$lib/styles/main.css';
  @import '$lib/styles/panes.css';
</style>