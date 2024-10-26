import { tick } from 'svelte';
import { get } from 'svelte/store';
import { orientationLandscape, currentView, isFullscreen } from '$lib/stores';
import * as panes from '$lib/panes';
import { Log } from '$lib';

export class MobileHandler {
  constructor(winRef, options = {}) {
    const {
      requestLandscapeOnFullscreen = true,
    } = options;
    this.requestLandscapeOnFullscreen = requestLandscapeOnFullscreen;

    this.winRef = winRef;
    this.landscape = get(orientationLandscape);
    this.view = get(currentView);
    this.fs = get(isFullscreen);
    this.unsubscribeAll = [
      orientationLandscape.subscribe(landscape => {
        this.landscape = landscape;        
      }),
      currentView.subscribe(view => {
        this.view = view;
      }),
      isFullscreen.subscribe(fs => {
        this.fs = fs;
        if (fs && this.requestLandscapeOnFullscreen) this.requestLandscape()
      }),
    ];
  }

  dispose() { this.unsubscribeAll.forEach(unsub => unsub()); }

  requestLandscape() {
    // Request landscape orientation
    if (this.winRef.screen.orientation && this.winRef.screen.orientation.lock) {
      this.winRef.screen.orientation.lock('landscape').catch((error) => {
        Log.debug(`Failed to lock orientation: ${error}`); // not important
      });
    }
  }

  async orientationChange() {
    if (this.landscape && this.winRef.screen.orientation.type.startsWith('portrait')) {
      panes.moveContentToStaging();
      orientationLandscape.set(false);     
      await tick(); // Wait for DOM to be updated
      panes.returnContentToSplit();
      if      (this.view == 1) panes.moveContent('ct1', 'cr-full');
      else if (this.view == 2) panes.moveContent('ct2', 'cr-full');
      else if (this.view == 3) panes.moveContent('ct3', 'cr-full');
      panes.showView(this.view);
    } else  {
      panes.moveContentToStaging();
      orientationLandscape.set(true);
      await tick();
      panes.returnContentToSplit();
      if      (this.view == 1) panes.moveContent('ct1', 'cr-full');
      else if (this.view == 2) panes.moveContent('ct2', 'cr-full');
      else if (this.view == 3) panes.moveContent('ct3', 'cr-full');
      panes.showView(this.view);
    }    
  };
}

