<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
  import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

  import { CodeBlock } from '@skeletonlabs/skeleton';
  import hljs from 'highlight.js/lib/core';
  import xml from 'highlight.js/lib/languages/xml';
  hljs.registerLanguage('xml', xml);
  import 'highlight.js/styles/github-dark-dimmed.css';
  import { storeHighlightJs } from '@skeletonlabs/skeleton';
  storeHighlightJs.set(hljs);

  import { getModalStore } from '@skeletonlabs/skeleton';

  import { Log } from '$lib';
  import { cfg } from '$root/webui.config.js';

  import * as ds from '$lib/stores/doc_session';
  import type DocumentSession from '$lib/doc_types';

  export let parent: SvelteComponent;
  const modalStore = getModalStore();

  const cButton: string           = 'fixed top-4 right-4 z-50 font-bold shadow-xl';
  const cBase: string             = 'card p-4 w-modal shadow-xl space-y-4';

  let tabSet: number              = 0; // DELETEME

  const strLoadRemotely: string = "Load from Web";
  const strLoadLocally: string  = "Load Locally";
  const strImportFile: string   = "Import File";
  const strImportRawURL: string = "About External Resources";

  const fileImportHandler = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    let baseFilename = 'Untitled Script';

    if (files && files.length > 0) {
      const file = files[0];

      const validExtensions = [cfg.PWA_FILE_EXT, '.txt']; // Add your valid extensions here
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (!validExtensions.includes(`.${extension}`)) {
        Log.toastError(`Invalid file type. Please upload a ${cfg.PWA_FILE_EXT} or .txt file.`);
        return; 
      }

      baseFilename = file.name.substring(0, file.name.lastIndexOf('.'));

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result; // This will be the file content
        $modalStore[0].importFileCallback(content, baseFilename);
      };

      reader.onerror = (error) => {
        Log.error('Error reading file:', error);
      };

      reader.readAsText(file);
    } else {
      Log.warning('No file selected.');
    }
  };
  
  const guessURL = (url: string): string => {
    // Define a list of URL transformation patterns
    const patterns = [
      {
        // Pattern to match GitHub blob URL structure
        regex: /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/,
        transform: (match: RegExpMatchArray) =>
          `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${match[3]}/${match[4]}`
      },
      {
        regex: /^https:\/\/gist\.github\.com\/([^/]+)\/(\w+)$/,
        transform: (match: RegExpMatchArray) =>
          `https://gist.githubusercontent.com/${match[1]}/${match[2]}/raw`
      },
      {
        // Pastebin URL to raw content, only if not already raw
        regex: /^https:\/\/pastebin\.com\/(?!raw\/)(\w+)$/,
        transform: (match: RegExpMatchArray) =>
          `https://pastebin.com/raw/${match[1]}`
      }
      // Add more patterns here if needed
    ];

    // Apply each pattern, return transformed URL if matched
    for (const { regex, transform } of patterns) {
      const match = url.match(regex);
      if (match) {
        return transform(match);
      }
    }

    // Return original string if no patterns match
    return url;
  };

  const copyToClipboard = () => {
    if (shareableURL) {
      navigator.clipboard.writeText(shareableURL).then(() => {
        Log.toastSuccess('copied to clipboard');
      }).catch(err => {
        Log.toastError('could not copy to clipboard');
        Log.error(err);
      });
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    extResourceValue = pastedText;
    makeURL();
  };

  let extResourceValue: string = '';
  let selectedOption: string = 'raw';
  let shareableURL: string = '';

  $: makeURL = () => {
    if (extResourceValue.trim() === '') {
      shareableURL = ''; 
      return; 
    }
    let rawURL = cfg.GUESS_RAW_URL ? guessURL(extResourceValue) : extResourceValue;
    const encodedURI = encodeURIComponent(rawURL.trim());
    if (selectedOption === 'raw') {      
      shareableURL = __BUILD_TYPE__ == 'static'
        ? `${cfg.APP_HOST_PATH}get-url?q=${encodedURI}`
        : `${cfg.APP_HOST_PATH}url/${encodedURI}`;
    } else if (selectedOption === 'gist') {
      shareableURL = __BUILD_TYPE__ == 'static'
        ? `${cfg.APP_HOST_PATH}get-gist?q=${encodedURI}`
        : `${cfg.APP_HOST_PATH}gist/${encodedURI}`;
    }
  };

  $: iframeWidth            = null;
  $: iframeHeight           = null;
  $: iframeView             = 0;
  $: iframeAutoBuild        = 0;
  $: iframeReadOnly         = 0;
  $: iframeAllowFullscreen  = 1;

  // Icons
  import { Icon } from 'svelte-hero-icons';
  import * as hero from 'svelte-hero-icons';
  import { CustomIcon } from '$lib/components/icons';
  import * as ico from '$lib/components/icons';
</script>


{#if $modalStore[0]}
  <div class="{cBase}">

    <TabGroup>
      <Tab bind:group={tabSet} name="tab3" value={0}>
        <svelte:fragment slot="lead"><Icon src="{hero.ArrowDownTray}" size="20" style="margin: 4px auto;" alt={strImportFile} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Import / Export File</span>
      </Tab>
      <Tab bind:group={tabSet} name="tab3" value={1}>
        <svelte:fragment slot="lead"><Icon src="{hero.Link}" size="20" style="margin: 4px auto;" alt={strImportRawURL} solid/></svelte:fragment>
        <span class="hidden lg:inline ml-2">Import / Share External</span>
      </Tab>
      <svelte:fragment slot="panel">
        <div class="h-full overflow-auto text-sm border border-primary-900/30">
        {#if tabSet === 0}
          <div class="card min-h-48 bg-surface-50-900-token shadow-inner divide-y divide-surface-400/10 rounded h-56 overflow-y-auto">  
            <FileDropzone name="files" class="h-28" on:change={fileImportHandler}>    
              <svelte:fragment slot="lead">
                <Icon src="{hero.ArrowDownTray}" size="20" class="mx-auto" solid/>
              </svelte:fragment>
              <svelte:fragment slot="message">Import</svelte:fragment>
              <svelte:fragment slot="meta">browse or drag: {cfg.PWA_FILE_EXT}, .txt</svelte:fragment>
            </FileDropzone>
            <div class="flex justify-center p-1">
              <button title="Export" class="btn mt-8 variant-ghost-primary" 
                on:click={$modalStore[0].exportFileCallback}>
                <Icon src="{hero.ArrowUpTray}" size="20" style="margin: 2px auto;" solid/>
                <span>Export</span>
              </button> 
            </div>
          </div>
        {:else if tabSet === 1}
          <div class="card min-h-48 bg-surface-50-900-token shadow-inner divide-y divide-surface-400/10 h-56 overflow-y-auto">

          <form on:submit|preventDefault>
            <div class="card p-4 w-full text-token space-y-4">
              <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                <div class="input-group-shim">
                  <Icon src="{hero.Link}" size="20" solid/>
                </div>
                <input 
                  type="text" 
                  placeholder="URL/URI" 
                  bind:value={extResourceValue} 
                  on:input={makeURL} 
                  on:paste={handlePaste} 
                  class="flex-grow" 
                />
                <select bind:value={selectedOption} on:change={makeURL}>
                  <option value='raw'>Raw URL</option>
                  <option value='gist'>Gist ID</option>
                </select>
              </div>
            </div>
          </form>



            <Accordion>
              <AccordionItem>
                <svelte:fragment slot="lead">
                  <Icon src="{hero.InformationCircle}" size="20" style="margin: 4px auto;" alt="About" solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">{strImportRawURL}</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <p class="text-sm">
                    You can import externally-hosted scripts if you have a URL to a raw script file or a 
                    <a href="https://gist.github.com/" target="_blank">gist</a> ID. 
                    The import link generated will be shareable and will stay up to date if the file changes on the external host. 
                    You can also embed this editor with its external resource in an iframe - e.g. to post on a blog.
                  </p>
                </svelte:fragment>
              </AccordionItem>
              <AccordionItem open>
                <svelte:fragment slot="lead">
                  <Icon src="{hero.Share}" size="20" style="margin: 4px auto;" alt="link" solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">Shareable Link</p></svelte:fragment>
                <svelte:fragment slot="content">


                  <div class="card variant-soft-secondary">
                    <div class="flex items-center justify-between p-2">
                      <div class="flex-grow truncate overflow-hidden text-ellipsis whitespace-nowrap text-left max-w-[calc(100%-64px)]">
                        {shareableURL}
                      </div>
                      <div class="flex space-x-2">
                        <button on:click={copyToClipboard} title="Copy to Clipboard">
                          <Icon src="{hero.ClipboardDocumentCheck}" size="20" solid/>
                        </button>
                        <button on:click={() => window.open(shareableURL, '_blank')} title="Go">
                          <Icon src="{hero.ArrowRightCircle}" size="20" solid/>
                        </button>
                      </div>
                    </div>
                  </div>


                </svelte:fragment>
              </AccordionItem>
              <AccordionItem>
                <svelte:fragment slot="lead">
                  <Icon src="{hero.CodeBracketSquare}" size="20" style="margin: 4px auto;" alt="link" solid/>
                </svelte:fragment>
                <svelte:fragment slot="summary"><p class="font-semibold text-base">Embed</p></svelte:fragment>
                <svelte:fragment slot="content">
                  <div>
                    <div class="flex items-center justify-center">
                      <input 
                        class="input w-28 display-inline-block m-1" 
                        title="Width" 
                        type="text" 
                        placeholder="Width" 
                        bind:value={iframeWidth}
                      />
                      <input 
                        class="input w-28 display-inline-block m-1" 
                        title="Height" 
                        type="text" 
                        placeholder="Height" 
                        bind:value={iframeHeight}
                      />
                      <RadioGroup class="mx-1">
                        <RadioItem 
                          bind:group={iframeAllowFullscreen} 
                          on:click={() => {iframeAllowFullscreen = +!iframeAllowFullscreen;}}
                          name="iframe-allow-fullscreen" value={1} title="Allow Fullscreen"
                        >
                          <Icon src="{hero.ArrowsPointingOut}" size="16" class="mx-0 my-1" solid/>
                        </RadioItem>
                      </RadioGroup>
                    </div>
                    <div class="flex items-center justify-center my-1">
                      <RadioGroup class="mx-1">
                        <RadioItem bind:group={iframeView} name="iframe-view" value={0} title="Split-Pane">
                          <Icon src="{hero.ViewColumns}" size="16" class="mx-0 my-1" solid/>
                        </RadioItem>
                        <RadioItem bind:group={iframeView} name="iframe-view" value={1} title="View Code">
                          <Icon src="{hero.CodeBracket}" size="16" class="mx-0 my-1" solid/>
                        </RadioItem>
                        <RadioItem bind:group={iframeView} name="iframe-view" value={2} title="View Canvas">
                          <Icon src="{hero.Photo}" size="16" class="mx-0 my-1" solid/>
                        </RadioItem>
                        <RadioItem bind:group={iframeView} name="iframe-view" value={3} title="View Controls">
                          <Icon src="{hero.AdjustmentsHorizontal}" size="16" class="mx-0 my-1" solid/>
                        </RadioItem>
                      </RadioGroup>
                      <RadioGroup class="mx-1">
                        <RadioItem 
                          bind:group={iframeAutoBuild} 
                          on:click={() => {iframeAutoBuild = +!iframeAutoBuild;}}
                          name="iframe-autobuild" value={1} title="Auto-Build"
                        >
                          <Icon src="{hero.PlayCircle}" size="16" class="mx-0 my-1" solid/>
                        </RadioItem>
                      </RadioGroup>
                      <RadioGroup class="mx-1">
                        <RadioItem 
                          bind:group={iframeReadOnly} 
                          on:click={() => {iframeReadOnly = +!iframeReadOnly;}}
                          name="iframe-readonly" value={1} title="Read-Only"
                        >
                          <Icon src="{iframeReadOnly ? hero.LockClosed : hero.LockOpen}" size="16" class="mx-0 my-1" solid/>
                        </RadioItem>
                      </RadioGroup>
                    </div>
                  </div>
                  <CodeBlock language="html" code={
                  `<iframe ` +
                  `\n  width="${iframeWidth || 800}" `+
                  `\n  height="${iframeHeight || 600}" ` + 
                  `${iframeAllowFullscreen ? '\n  allow="fullscreen" ' : ''}` + 
                  `\n  src="${shareableURL || '[PROVIDE URL ABOVE]'}${shareableURL.includes('?') ? '&' : '?'}` +
                    `view=${iframeView}&` +
                    `autobuild=${iframeAutoBuild}&` +
                    `readonly=${iframeReadOnly}` +
                  `" ` + 
                  `\n  title="${cfg.APP_TITLE}">`}>                    
                  </CodeBlock>
                </svelte:fragment>
              </AccordionItem>
            </Accordion>
          </div>
        {/if}
        </div>
      </svelte:fragment>
    </TabGroup>
    <footer class="flex justify-between items-center p-2 m-0 border border-primary-800/30 rounded shadow-xl">
      <div class="text-left pl-4">
          <h4 class="h4">{$modalStore[0].title ?? 'Import / Export'}</h4>
      </div>
      <div class="flex justify-end">
          <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
      </div>
    </footer>
  </div>
{/if}