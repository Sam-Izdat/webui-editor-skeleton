// SPA Navigation
import { get } from 'svelte/store';
import { currentView } from '$lib/stores/app_state';
import * as panes from '$lib/panes';
import { Log } from '$lib';

export class NavHandler {
  constructor() {
    this.view = get(currentView);
    this.unsubscribeAll = [
      currentView.subscribe(view => {
        this.view = view;
        this.switchView()
      }),
    ];
  }
  
  dispose() { this.unsubscribeAll.forEach(unsub => unsub()); }

  switchViewEvent(event: CustomEvent) {
    currentView.set(event.detail.view);
  }

  switchView() {
    switch (this.view) {
      case 0:
        panes.returnContentToSplit(); 
        panes.showView(this.view);
        break;
      case 1:
        panes.returnContentToSplit(); 
        panes.moveContent('ct1', 'cr-full'); 
        panes.showView(this.view);
        break;
      case 2:
        panes.returnContentToSplit(); 
        panes.moveContent('ct2', 'cr-full'); 
        panes.showView(this.view);
        break;
      case 3:
        panes.returnContentToSplit(); 
        panes.moveContent('ct3', 'cr-full'); 
        panes.showView(this.view);
        break;
      default:
        Log.error('somehow tried to switch to nonexistent view...')
    }
  }
}