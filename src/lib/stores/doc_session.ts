import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import * as localStorageEngine from '$lib/storage/local';
import * as remoteStorageEngine from '$lib/storage/remote';
import type DocumentSession from '$lib/doc_types';
import { Log } from '$lib';

// TODO: This should handle remote storage when running a nonstatic build
// Make activeContent to avoid slicing constantly
// Active-Session operations

export const documentSession = writable<DocumentSession>({
  id: uuidv4(),
  name: 'Untitled Script',
  versionCurrent: 0,    
  versionCount: 1,
  content: [''],
  unsavedChanges: false
});

export const newSession = (name: string = 'Untitled Script') => {
  documentSession.set({
    id: uuidv4(),
    name,
    versionCurrent: 0,
    versionCount: 1,
    content: [''],
    unsavedChanges: false
  });
};

export const updateActiveContent = (newContent: string) => {
  documentSession.update(session => {
    // pulseEditorBackground();
    session.content[session.versionCurrent] = newContent;
    session.unsavedChanges = true;
    return session;
  });
};

export const updateVersionContent = (newContent: string, version: int) => {
  documentSession.update(session => {
    return {
      ...session,
      content: [
        ...session.content.slice(0, version),
        newContent,
        ...session.content.slice(version + 1)
      ],
      unsavedChanges: true
    };
  });
};

export const updateAny = (sessionParams) => {
  documentSession.update(session => {
    return {
      ...session,
      ...sessionParams
    };
  });
};

export const updateName = (newContent: string) => { };

export const getLastVersionContent = (version: int) => documentSession.content[documentSession.versionCount - 1];

export const getVersionContent = (version: int) => documentSession.content[version];

// Active-Session/Storage operations (active session is automatically updated)

export const saveSession = () => {
    documentSession.update(session => {
      localStorageEngine.save(session);  
      return {
          ...session,
          unsavedChanges: false
      }; 
    });
};

// TODO: Update active
export const loadSession = (uuid: string) => localStorageEngine.load(uuid);

// Storage only operations (active session is not automatically updated)

export const deleteStoredSession = (uuid: string) => localStorageEngine.remove(uuid);

export const renameStoredSession = (uuid: string, newName: string) => localStorageEngine.rename(uuid, newName);

export const searchStoredSessions = (substring: string) => localStorageEngine.search(substring);

export const listStoredSessions = (descending: boolean = true) => localStorageEngine.list(descending);

const pulseEditorBackground = (color: string = '#00ff00', duration: number = 100) => {
  const bg = document.querySelector('.monaco-editor-background');
  if (bg.style.transition != '') return;
  bg.style.transition = 'background 1s';
  bg.style.background = '#00ff00';
  setTimeout(() => bg.style.background = '', duration);
  setTimeout(() => bg.style.transition = '', duration * 2);
}