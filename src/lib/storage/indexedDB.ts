import type DocumentSession from '$lib/doc_types';
import { cfg } from '$root/webui.config.js';
import { Log } from '$lib';

// See: https://www.w3.org/TR/IndexedDB/
// See: https://web.dev/articles/persistent-storage

const dbName = cfg.IDB_DB_NAME;
const storeName = cfg.IDB_DOC_STORE_NAME;

async function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'docID' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const save = async (session: DocumentSession) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const data = {
      ...session,
      docID: session.docID,
      dateSaved: new Date().toISOString(),
    };
    store.put(data);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const load = async (uuid: string) => {
  const db = await openDB();
  return new Promise<DocumentSession | null>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(uuid);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const remove = async (uuid: string) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(uuid);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const rename = async (uuid: string, newName: string) => {
  const session = await load(uuid);
  if (session) {
    session.docName = newName;
    await save(session);
    return true;
  }
  return false;
};

export const search = async (substring: string) => {
  const db = await openDB();
  const results: DocumentSession[] = [];
  return new Promise<DocumentSession[]>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const doc = cursor.value;
        if (doc.docName.toLowerCase().includes(substring.toLowerCase())) {
          results.push(doc);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

// Loads everything at present. Content can actually be excluded.
export const list = async (descending = true) => {
  const db = await openDB();
  const results: DocumentSession[] = [];
  return new Promise<DocumentSession[]>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        results.sort((a, b) => {
          const dateA = new Date(a.dateSaved).getTime();
          const dateB = new Date(b.dateSaved).getTime();
          return descending ? dateB - dateA : dateA - dateB;
        });
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
};
