import { get } from 'svelte/store';
import * as ds from '$lib/stores/doc_session'; 
import { Log, strInitialEditorContents } from '$lib'; 
import { isReadOnly } from '$lib/stores';
import { docListStore } from '$lib/stores';
// import type DocumentSession from '$lib/doc_types';

export class DocHandler {
  constructor(session, editor) {
    this.editor = editor;
    this.readonly = get(isReadOnly);
    this.session = get(ds.documentSession);
    this.unsubscribeAll = [
      isReadOnly.subscribe(readonly => {
        this.readonly = readonly;
      }),
      ds.documentSession.subscribe(session => {
        this.session = session;
      }),
    ];
  }

  dispose() { this.unsubscribeAll.forEach(unsub => unsub()); }

  saveDoc = async () => {
    if (!this.session.unsavedChanges) return;
    try {
      ds.commitContentBufferToActiveVersion();
      await ds.saveSession();
      Log.toastSuccess('script saved');
    } catch(e) {
      Log.error(e);
      Log.toastError('save failed');
    }
  };


  loadDoc = async (uuid: string, adapter: string) => {
    try {
      await ds.loadSession(uuid, adapter);
      this.editor.setValue(this.session.content[this.session.versionCount - 1] ?? '');
      ds.updateContentBuffer(this.session.content[this.session.versionCount - 1]);
      ds.setActiveVersion(this.session.versionCount - 1);
      Log.toastSuccess('script loaded');
    } catch(e) {
      Log.error(e);
      Log.toastError('load failed');
    }
  };

  forkDoc = () => {    
    try {
      ds.newSession(this.session.docName, this.session.content[this.session.versionActive] ?? '');
      Log.toastSuccess('script forked');
    } catch(e) {
      Log.error(e);
      Log.toastError('fork script failed');
    } 
  }

  loadVersion = (version: number) => {
    try {
      if (!(version >= 0 && version < this.session.versionCount)){
        throw new Error(`tried to load undefined doc version index ${version} of count ${this.session.versionCount}` );
      }
      this.editor.setValue(this.session.content[version] ?? strInitialEditorContents);
      ds.updateContentBuffer(this.session.content[version]);
      ds.setActiveVersion(version);
    } catch(e) {
      Log.error(e);
      Log.toastError('load version failed');
    } 
  };

  loadLastVersion = () => {
    this.loadVersion(this.session.versionCount - 1);
  };

  saveDocNewVersion = async () => {
    if (!this.session.unsavedChanges) return;
    try {
      ds.newVersion();
      ds.commitContentBufferToLastVersion();
      await ds.saveSession();
      Log.toastSuccess('script saved');
    } catch(e) {
      Log.error(e);
      Log.toastError('save failed');
    }
  };

  updateDoc = (content:string) => {
    ds.updateContentBuffer(content);
  };

  renameDoc = (docName: string) => {
    ds.updateSessionParams({docName: docName});
  };

  newDoc = (content:string = null) => {
    this.editor.setValue(content ?? strInitialEditorContents);
    ds.newSession('Untitled Script', content ?? strInitialEditorContents);
    if (!content) {
      Log.toastInfo('new script')
    } else {
      Log.toastSuccess('imported script')
    }
  }; 

  getCurrentEditorContent = () => {
    return this.editor.getValue();
  }

  refreshDocList = async () => {
    docListStore.set(await ds.listStoredSessions());
  };

  deleteDoc = async (uuid: string, adapter: string) => {
    try {
      await ds.deleteStoredSession(uuid, adapter);
    } catch(e) {
      Log.error(e);
      Log.toastInfo('failed to delete script');
    }
    Log.toastInfo('script deleted');
  }

  disableEditing = () => {
    this.editor.updateOptions({ readOnly: true });
    document.querySelector('.monaco-editor textarea').readOnly = true;
    isReadOnly.set(true);
    Log.toastInfo('read-only mode on')
  };

  enableEditing = () => {
    this.editor.updateOptions({ readOnly: false });
    document.querySelector('.monaco-editor textarea').readOnly = false;
    isReadOnly.set(false);
    Log.toastInfo('read-only mode off')
  };

  toggleEditing = () => this.readonly ? this.enableEditing() : this.disableEditing();
}