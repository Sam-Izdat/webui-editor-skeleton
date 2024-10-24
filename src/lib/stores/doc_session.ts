import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import * as localStorageEngine from '$lib/storage/local';
import * as remoteStorageEngine from '$lib/storage/remote';
import type DocumentSession from '$lib/doc_types';

// TODO: This should handle remote storage when running a nonstatic build

export const documentSession = writable<DocumentSession>({
  id: uuidv4(),
  name: 'Untitled Script',
  content: '',
  unsavedChanges: false
});

export const newSession = (name: string = 'Untitled Script') => {
  documentSession.set({
    id: uuidv4(),
    name,
    content: '',
    unsavedChanges: false
  });
};

export const updateContent = (newContent: string) => {
  documentSession.update(session => {
    // pulseEditorBackground();
    return {
      ...session,
      content: newContent,
      unsavedChanges: true
    };
  });
};

export const saveSession = () => {
    documentSession.update(session => {
        localStorageEngine.save(session);  // Save the current session to localStorage
        return {
            ...session,
            unsavedChanges: false
        };
    });
};

const loadSession = (uuid: string) => localStorageEngine.load(uuid);

const deleteSession = (uuid: string) => localStorageEngine.remove(uuid);

const renameSession = (uuid: string, newName: string) => localStorageEngine.rename(uuid, newName);

const searchSessions = (substring: string) => localStorageEngine.search(substring);

export const listSessions = (descending: boolean = true) => localStorageEngine.list(descending);

const pulseEditorBackground = (color: string = '#00ff00', duration: number = 100) => {
  const bg = document.querySelector('.monaco-editor-background');
  if (bg.style.transition != '') return;
  bg.style.transition = 'background 1s';
  bg.style.background = '#00ff00';
  setTimeout(() => bg.style.background = '', duration);
  setTimeout(() => bg.style.transition = '', duration * 2);
}