import type DocumentSession from '$lib/doc_types';
import { Log } from '$lib';
const prefix = 'saved-doc-';

export const save = async (session: DocumentSession) => {
  const key = prefix + session.docID;
  localStorage.setItem(key, JSON.stringify({
    ...session,
    dateSaved: new Date().toISOString()  // Add a timestamp
  }));
};

export const load = async (uuid: string) => {
  const key = prefix + uuid;
  const session = localStorage.getItem(key);
  return session ? JSON.parse(session) : null;
};

export const remove = async (uuid: string) => {
  const key = prefix + uuid;
  return localStorage.removeItem(key);
};

export const rename = async (uuid: string, newName: string) => {  
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

export const search = async (substring: string) => {
  const searchLower = substring.toLowerCase();
  let res =Object.keys(localStorage)
    .filter(key => key.startsWith('saved-doc'))
    .map(key => {
        const doc = JSON.parse(localStorage.getItem(key));
        return { id: key.replace('saved-doc-', ''), ...doc };
    })
    .filter(doc => doc.docName.toLowerCase().includes(searchLower));
  return res;
};

// Loads everything at present. Content can actually be excluded.
export const list = async (descending = true) => {
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