import { writable, type Writable } from 'svelte/store';
import { onMount } from 'svelte';
import { browser } from "$app/environment";
import * as ds from '$lib/stores/doc_session';
import type DocumentSession from '$lib/doc_types';

export const docListStore: Writable<DocumentSession[]> = writable([]);

const fetchDocs = async () => {
  if (browser) {
    docListStore.set(await ds.listStoredSessions());
  } 
}

fetchDocs();