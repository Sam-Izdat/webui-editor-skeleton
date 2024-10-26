import { tick } from 'svelte';
import { get } from 'svelte/store';
import { orientationLandscape, currentView } from '$lib/stores';
import * as panes from '$lib/panes';

export class MobileHandler {
  constructor(screenRef) {
    this.screenRef = screenRef;
    this.landscape = get(orientationLandscape);
    this.view = get(currentView);
    this.unsubscribeAll = [
      orientationLandscape.subscribe(landscape => {
        this.landscape = landscape;
      }),
      currentView.subscribe(view => {
        this.view = view;
      }),
    ];
  }

  dispose() { this.unsubscribeAll.forEach(unsub => unsub()); }

  async orientationChange() {
    if (this.landscape && this.screenRef.orientation.type.startsWith('portrait')) {
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




    // // Request landscape orientation
    // if (this.screenRef.orientation && this.screenRef.orientation.lock) {
    //   this.screenRef.orientation.lock('landscape').catch((error) => {
    //     Log.debug(`Failed to lock orientation: ${error}`); // not important
    //   });
    // }