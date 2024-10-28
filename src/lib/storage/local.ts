import type DocumentSession from '$lib/doc_types';
import { Log } from '$lib';
const prefix = 'saved-doc-';

export const save = (session: DocumentSession) => {
  const key = prefix + session.docID;
  localStorage.setItem(key, JSON.stringify({
    ...session,
    dateSaved: new Date().toISOString()  // Add a timestamp
  }));
};

export const load = (uuid: string) => {
  console.log(uuid);
  const key = prefix + uuid;
  const session = localStorage.getItem(key);
  console.log(session);
  return session ? JSON.parse(session) : null;
};

export const remove = (uuid: string) => {
  const key = prefix + uuid;
  return localStorage.removeItem(key);
};

export const rename = (uuid: string, newName: string) => {  
  const key = prefix + uuid;
  const session = localStorage.getItem(key);
  if (session) {
    const parsed = JSON.parse(session);
    parsed.docName = newName;
    localStorage.setItem(key, JSON.stringify(parsed));
    return true;
  } else {
    return false;
  }
};

export const search = (substring: string) => {
  const searchLower = substring.toLowerCase();
  return Object.keys(localStorage)
    .filter(key => key.startsWith('saved-doc'))
    .map(key => {
        const doc = JSON.parse(localStorage.getItem(key));
        return { id: key.replace('saved-doc-', ''), ...doc };
    })
    .filter(doc => doc.docName.toLowerCase().includes(searchLower));
};

export const list = (descending = true) => {
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