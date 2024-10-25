import * as ds from '$lib/stores/doc_session'; 
import { Log, strInitialEditorContents } from '$lib'; 
import { isReadOnly } from '$lib/stores';

export class DocHandler {
  constructor(session, editor) {
    this.editor = editor;
    this.session = session;
    this.unsubscribeAll = [
      isReadOnly.subscribe(readonly => {
        this.readonly = readonly;
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

  saveDocNewVersion = () => { };

  updateDoc = (content:string) => {
    ds.updateContentBuffer(content);
  };

  renameDoc = (docName:string = 'Foo') => {
    docName='FOOO';
    ds.updateSessionParams({docName: docName});
  };

  newDoc = (content:string = null) => {
    this.editor.setValue(content ?? strInitialEditorContents);
    ds.newSession();
    if (!content) Log.toastInfo('new script')
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