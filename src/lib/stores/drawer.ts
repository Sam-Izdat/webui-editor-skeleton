import { writable } from 'svelte/store';

export const drawerContentStore = writable({
  id: null,
  component: null,
  props: {},
});