import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export type DocumentSession = {
  id: string;
  name: string;
  content: string;
  unsavedChanges: boolean;
};

export const documentSession = writable<DocumentSession>({
  id: uuidv4(),
  name: 'Untitled Session',
  content: '',
  unsavedChanges: false
});

export const newSession = (name = 'Untitled Session') => {
  documentSession.set({
    id: uuidv4(),
    name,
    content: '',
    unsavedChanges: false
  });
};

export const updateContent = (newContent: string) => {
  documentSession.update(session => {
    pulseEditorBackground();
    return {
      ...session,
      content: newContent,
      unsavedChanges: true
    };
  });
};

export const saveSession = () => {
    documentSession.update(session => {
        saveToLocalStorage(session);  // Save the current session to localStorage
        return {
            ...session,
            unsavedChanges: false
        };
    });
};

const loadSession = (uuid) => {
    const key = `saved-doc-${uuid}`;
    const session = localStorage.getItem(key);
    return session ? JSON.parse(session) : null;
};

const deleteSession = (uuid) => {
    const key = `saved-doc-${uuid}`;
    localStorage.removeItem(key);
};

const renameSession = (uuid, newName) => {
    const key = `saved-doc-${uuid}`;
    const session = localStorage.getItem(key);
    if (session) {
        const parsed = JSON.parse(session);
        parsed.name = newName;
        localStorage.setItem(key, JSON.stringify(parsed));
    }
};

const searchSessions = (substring) => {
    const searchLower = substring.toLowerCase();
    return Object.keys(localStorage)
        .filter(key => key.startsWith('saved-doc'))
        .map(key => {
            const doc = JSON.parse(localStorage.getItem(key));
            return { id: key.replace('saved-doc-', ''), ...doc };
        })
        .filter(doc => doc.name.toLowerCase().includes(searchLower));
};

export const saveToLocalStorage = (session: DocumentSession) => {
    const key = `saved-doc-${session.id}`;
    localStorage.setItem(key, JSON.stringify({
        name: session.name,
        content: session.content,
        dateSaved: new Date().toISOString()  // Add a timestamp
    }));
};

export const getSavedDocuments = (descending = true) => {
    return Object.keys(localStorage)
        .filter(key => key.startsWith('saved-doc'))
        .map(key => {
            const doc = JSON.parse(localStorage.getItem(key));
            return { id: key.replace('saved-doc-', ''), ...doc };
        })
        .sort((a, b) => {
            const dateA = new Date(a.dateSaved).getTime();
            const dateB = new Date(b.dateSaved).getTime();
            return descending ? dateB - dateA : dateA - dateB;  // Sort by dateSaved based on descending flag
        });
};

const pulseEditorBackground = (color = '#00ff00', duration = 100) => {
  const bg = document.querySelector('.monaco-editor-background');
  if (bg.style.transition != '') return;
  bg.style.transition = 'background 1s';
  bg.style.background = '#00ff00';
  setTimeout(() => bg.style.background = '', duration);
  setTimeout(() => bg.style.transition = '', duration * 2);
}