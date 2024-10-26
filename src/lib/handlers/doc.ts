import { get } from 'svelte/store';
import * as ds from '$lib/stores/doc_session'; 
import { Log, strInitialEditorContents } from '$lib'; 
import { isReadOnly } from '$lib/stores';

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

  saveDoc = () => {
    if (!this.session.unsavedChanges) return;
    try {
      ds.commitContentBufferToActiveVersion();
      ds.saveSession();
      Log.toastSuccess('script saved');
    } catch(e) {
      Log.error(e);
      Log.toastError('save failed');
    }
  };

  loadVersion = (version) => {
    try {
      if (!(version >= 0 && version < this.session.versionCount)){
        throw new Error(`tried to load undefined doc version index ${version} of count ${this.session.versionCount}` );
      }
      this.editor.setValue(this.session.content[version] ?? strInitialEditorContents);
      ds.updateContentBuffer(this.session.content[version]);
      ds.setActiveVersion(version);
    } catch(e) {
      Log.error(e);
      Log.toastError('something went wrong');
    } 
  };

  loadLastVersion = () => {
    this.loadVersion(this.session.versionCount - 1);
  };

  saveDocNewVersion = () => {
    if (!this.session.unsavedChanges) return;
    try {
      ds.newVersion();
      ds.commitContentBufferToLastVersion();
      ds.saveSession();
      Log.toastSuccess('script saved');
    } catch(e) {
      Log.error(e);
      Log.toastError('save failed');
    }
  };

  updateDoc = (content:string) => {
    ds.updateContentBuffer(content);
  };

  renameDoc = (docName:string) => {
    ds.updateSessionParams({docName: docName});
  };

  newDoc = (content:string = null) => {
    this.editor.setValue(content ?? strInitialEditorContents);
    ds.newSession();
    if (!content) {
      Log.toastInfo('new script')
    } else {
      Log.toastInfo('imported script')
    }
  }; 

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