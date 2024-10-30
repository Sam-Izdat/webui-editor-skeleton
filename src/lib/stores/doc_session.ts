import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type DocumentSession from '$lib/doc_types';
import { get } from 'svelte/store';
import { browser } from "$app/environment";

// IndexedDB
import * as storageAdapterIDB from '$lib/storage/indexedDB';

// LocalStorage
import * as storageAdapterLS from '$lib/storage/local';

// Server
import * as storageAdapterRemote from '$lib/storage/remote';


// TODO: This should handle remote storage when running a nonstatic build

const peristentStorageAvailable = async () => browser ? await navigator.storage.persist() : false;

// ----------------------------------------------------------------------------
// These are synchronous and don't need the storage adapter...
// Errors should be caught by doc handler.
// ----------------------------------------------------------------------------

export const documentSession = writable<DocumentSession>({
  docID: uuidv4(),
  docName: 'Untitled Script',
  versionActive: 0,    
  versionCount: 1,
  content: [''],
  unsavedChanges: false
});

export const newSession = (docName: string = 'Untitled Script', content:string = '') => {
  documentSession.set({
    docID: uuidv4(),
    docName: docName,
    versionActive: 0,
    versionCount: 1,
    content: [content],
    contentBuffer: content,
    unsavedChanges: false
  });
};

export const newVersion = () => {  
  documentSession.update(session => {
    session.content.push('');
    session.versionCount += 1;
    return session;
  });
};

export const setActiveVersion = (version: number) => {  
  documentSession.update(session => {
    session.versionActive = version;
    session.unsavedChanges = false;
    return session;
  });
};

export const updateContentBuffer = (newContent: string) => {
  documentSession.update(session => {
    // pulseEditorBackground();
    session.contentBuffer = newContent;
    session.unsavedChanges = true;
    return session;
  });
};

export const commitContentBufferToActiveVersion = () => {
  documentSession.update(session => {
    session.content[session.versionActive] = session.contentBuffer;
    return session;
  });
};

export const commitContentBufferToLastVersion = () => {
  documentSession.update(session => {
    session.content[session.versionCount - 1] = session.contentBuffer;
    return session;
  });
};

export const updateSessionParams = (sessionParams) => {
  documentSession.update(session => {
    return {...session, ...sessionParams, unsavedChanges: true};
  });
};

export const getLastVersionContent = (version: int) => documentSession.content[documentSession.versionCount - 1];

export const getVersionContent = (version: int) => documentSession.content[version];

// ----------------------------------------------------------------------------
// These are asynchronous storage-involved operations... promises, promises.
// Errors should be caught by doc handler.
// ----------------------------------------------------------------------------

export const loadSession = async (uuid: string, adapter: string) => {
  let sessionLoaded: DocumentSession;
  if (adapter == 'idb') {
    sessionLoaded = await storageAdapterIDB.load(uuid);
  } else if (adapter == 'ls') {
    sessionLoaded = await storageAdapterLS.load(uuid);
  } else {
    throw new Error('unknown adapter:', adapter);
  }

  documentSession.set(sessionLoaded);
  documentSession.update(session => {
    session.unsavedChanges = false;
    return session;
  });
};

export const saveSession = async () => {
  if (await peristentStorageAvailable()) {
    await storageAdapterIDB.save({ ...get(documentSession), contentBuffer: '', unsavedChanges: false, adapter: 'idb'}); 
  } else {
    await storageAdapterLS.save({ ...get(documentSession), contentBuffer: '', unsavedChanges: false, adapter: 'ls'})
  }
  
  documentSession.update(session => {      
    session.unsavedChanges = false;
    return session; 
  });
};

// Storage only operations (active session is not automatically updated)

export const deleteStoredSession = async (uuid: string, adapter: string) => {
  if (adapter == 'idb') {
    await storageAdapterIDB.remove(uuid);
  } else if (adapter == 'ls') {
    await storageAdapterLS.remove(uuid);
  } else {
    throw new Error('unknown adapter:', adapter);
  }
}

// export const renameStoredSession = async (uuid: string, newName: string) => await storageAdapterIDB.rename(uuid, newName);

export const searchStoredSessions = async (substring: string) => {
  let idbSearch = await storageAdapterIDB.search(substring);
  let lsSearch = await storageAdapterLS.search(substring);
  return lsSearch.concat(idbSearch);
};

export const listStoredSessions = async (descending: boolean = true) => {
  let idbList = await storageAdapterIDB.list(descending);
  let lsList = await storageAdapterLS.list(descending);  
  return lsList.concat(idbList);
};