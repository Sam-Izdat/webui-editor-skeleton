import { writable } from 'svelte/store';
import { resetPaneSizes } from '$lib/panes';
import type { PaneSizes } from '$lib/panes';

// Global (SPA) state
export const isAutoBuild:boolean          = writable(false);
export const isFullscreen:boolean         = writable(false);
export const isReadOnly:boolean           = writable(false);  
export const isDark:boolean               = writable(true);
export const orientationLandscape:boolean = writable(true);
export const currentView:number           = writable(0);
export const paneSizes                    = writable<PaneSizes>({...resetPaneSizes()});