import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import * as localStorageEngine from '$lib/storage/local';
import * as remoteStorageEngine from '$lib/storage/remote';
import type DocumentSession from '$lib/doc_types';
import { Log } from '$lib';
import { get } from 'svelte/store';

// TODO: This should handle remote storage when running a nonstatic build
// Make activeContent to avoid slicing constantly
// Active-Session operations

export const documentSession = writable<DocumentSession>({
  docID: uuidv4(),
  docName: 'Untitled Script',
  versionActive: 0,    
  versionCount: 1,
  content: [''],
  unsavedChanges: false
});

export const newSession = (docName: string = 'Untitled Script') => {
  documentSession.set({
    docID: uuidv4(),
    docName: docName,
    versionActive: 0,
    versionCount: 1,
    content: [''],
    contentBuffer: '',
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

// export const commitContentBufferToVersion = (newContent: string, version: int) => {
//   documentSession.update(session => {
//     return {
//       ...session,
//       content: [
//         ...session.content.slice(0, version),
//         newContent,
//         ...session.content.slice(version + 1)
//       ],
//       unsavedChanges: true
//     };
//   });
// };

export const updateSessionParams = (sessionParams) => {
  documentSession.update(session => {
    return {...session, ...sessionParams, unsavedChanges: true};
  });
};

export const updateName = (newContent: string) => { };

export const getLastVersionContent = (version: int) => documentSession.content[documentSession.versionCount - 1];

export const getVersionContent = (version: int) => documentSession.content[version];

// Active-Session/Storage operations (active session is automatically updated)

export const saveSession = () => {
    documentSession.update(session => {
      localStorageEngine.save({...session, contentBuffer: '', unsavedChanges: false});  
      return {...session, unsavedChanges: false}; 
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