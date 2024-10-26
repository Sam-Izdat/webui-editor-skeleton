import { Log } from '$lib';

// export let isFullscreen = false;
import { get } from 'svelte/store';
import { isFullscreen } from '$lib/stores';

export class ScreenHandler {
  constructor(winRef) {
    this.winRef = winRef;
    this.fs = get(isFullscreen);
    this.unsubscribeAll = [
      isFullscreen.subscribe(fs => {
        this.fs = fs;
      }),
    ];
  }

  dispose() { this.unsubscribeAll.forEach(unsub => unsub()); }

  enterFullscreen() {
    const docEl = this.winRef.document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
    isFullscreen.set(true);
    Log.toastInfo('fullscreen on');
  }

  exitFullscreen() {
    if (this.winRef.document.exitFullscreen) {
      this.winRef.document.exitFullscreen();
    } else if (this.winRef.document.mozCancelFullScreen) {
      this.winRef.document.mozCancelFullScreen();
    } else if (this.winRef.document.webkitExitFullscreen) {
      this.winRef.document.webkitExitFullscreen();
    } else if (this.winRef.document.msExitFullscreen) {
      this.winRef.document.msExitFullscreen();
    }
    isFullscreen.set(false);
    Log.toastInfo('fullscreen off');
  }

  toggleFullscreen = () => this.fs ? this.exitFullscreen() : this.enterFullscreen();
}
