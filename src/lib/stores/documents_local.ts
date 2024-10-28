import { writable, type Writable } from 'svelte/store';
import { browser } from "$app/environment";
import * as ds from '$lib/stores/doc_session';
import type DocumentSession from '$lib/doc_types';

// Define the writable store with the type Writable<DocumentSession[]>
export const savedDocuments: Writable<DocumentSession[]> = writable(
  browser ? ds.listStoredSessions() : []
);