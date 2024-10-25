import { Log } from '$lib';

// export let isFullscreen = false;
import { isFullscreen } from '$lib/stores';

export class ScreenHandler {
  constructor(docRef, screenRef) {
    this.docRef = docRef;
    this.screenRef = screenRef;
    this.unsubscribeAll = [
      isFullscreen.subscribe(fs => {
        this.fs = fs;
      }),
    ];
  }

  dispose() { this.unsubscribeAll.forEach(unsub => unsub()); }

  enterFullscreen() {
    const docEl = this.docRef.documentElement;
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
  }

  exitFullscreen() {
    if (this.docRef.exitFullscreen) {
      this.docRef.exitFullscreen();
    } else if (this.docRef.mozCancelFullScreen) {
      this.docRef.mozCancelFullScreen();
    } else if (this.docRef.webkitExitFullscreen) {
      this.docRef.webkitExitFullscreen();
    } else if (this.docRef.msExitFullscreen) {
      this.docRef.msExitFullscreen();
    }
    isFullscreen.set(false);
  }

  toggleFullscreen = () => this.fs ? this.exitFullscreen() : this.enterFullscreen();
}
