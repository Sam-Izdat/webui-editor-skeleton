<script lang="ts">
  import { Log } from '$lib';
  import { onDestroy } from 'svelte';
  import { popup } from '@skeletonlabs/skeleton';
  import { Icon, Play, CheckCircle, ExclamationTriangle, ExclamationCircle } from "svelte-hero-icons";
  import { scriptErrorLog } from '$lib/stores'; // Store for message queue
  import { AppRailAnchor } from '@skeletonlabs/skeleton';
  import * as km from '$lib/keymap';

  export let buildCallback = () => {};

  // Define the types for messages
  type MessageType = 'info' | 'success' | 'warning' | 'error';

  interface Message {
    type: MessageType;
    message: string;
  }

  let messages: Message[] = [];
  
  // Subscribe to the store for message updates
  scriptErrorLog.subscribe((log) => {
    messages = log;
  });
  // Helper function to get the class based on the message type
  const getClass = (type: MessageType) => {
    switch (type) {
      case 'info':
        return 'variant-filled-info';
      case 'success':
        return 'variant-filled-success';
      case 'warning':
        return 'variant-filled-warning';
      case 'error':
        return 'variant-filled-error';
      default:
        return '';
    }
  }

  // Reactive variable to hold the class based on script status
  let statusClass = '';
  let activeIcon = Play;
  
  // Subscribe to the scriptStatus store
  const unsubscribe = Log.getInstance().scriptStatus.subscribe(status => {
    statusClass = '';
    activeIcon = Play;
    if (status & Log.ScriptStatus.SUCCESS) {
      statusClass = 'bg-success-500';
      activeIcon = CheckCircle;
    }
    if (status & Log.ScriptStatus.WARNING) {
      statusClass = 'bg-warning-500';
      activeIcon = ExclamationTriangle;
    }
    if (status & Log.ScriptStatus.ERROR) {
      statusClass = 'bg-error-500';
      activeIcon = ExclamationCircle;
    }
  });

  // Cleanup subscription when component is destroyed
  onDestroy(() => {
    unsubscribe();
  });
</script>

<!-- Need wrapper because AppRailAnchor can't use popup -->
<div class="m-0 p-0" 
  use:popup={{ event: 'click', target: 'error-popup', placement: 'right' }}
>
<AppRailAnchor 
  href="#" 
  title="Build (alt+{km.keyBuild})" 
  class={statusClass} 
  style="display:block;"
  on:click={buildCallback}
>
  <Icon src="{activeIcon}" size="16" style="margin: 4px auto;" solid />
  <div 
    class="card place-content-stretch text-left font-normal p-1 max-w-72 bg-gradient-to-br variant-gradient-error-warning shadow shadow-error-900" 
    data-popup="error-popup"
    style="z-index: 100;">
    <div class="card p-1 variant-filled-surface max-h-screen overflow-y-auto">
      {#each messages as { type, message } (message)}
        <aside class="alert p-1 m-1 {getClass(type)}">
          <div class="alert-message text-xs">
            {message}
          </div>
        </aside>
      {/each}
      <div class="arrow bg-gradient-to-br variant-gradient-error-warning" />
    </div>
  </div>
</AppRailAnchor>
</div>