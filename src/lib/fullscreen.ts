import { Log } from '$lib';

export let isFullscreen = false;

export const toggleFullscreen = () => {
  if (!isFullscreen) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
  isFullscreen = !isFullscreen; 
  return isFullscreen;
};

export const enterFullscreen = () => {
  const docEl = document.documentElement;
  if (docEl.requestFullscreen) {
    docEl.requestFullscreen();
  } else if (docEl.mozRequestFullScreen) {
    docEl.mozRequestFullScreen();
  } else if (docEl.webkitRequestFullscreen) {
    docEl.webkitRequestFullscreen();
  } else if (docEl.msRequestFullscreen) {
    docEl.msRequestFullscreen();
  }

  // Request landscape orientation
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch((error) => {
      Log.error(`Failed to lock orientation: ${error}`);
    });
  }
};

export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};