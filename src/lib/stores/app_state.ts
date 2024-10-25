import { writable } from 'svelte/store';
import * as panes from '$lib/panes';

export const isAutoBuild          = writable(true);
export const isFullscreen         = writable(false);
export const isReadOnly           = writable(false);  
export const isDark               = writable(true);
export const orientationLandscape = writable(true);
export const currentView          = writable(0);
export const paneSizes            = writable({...panes.resetPaneSizes()});