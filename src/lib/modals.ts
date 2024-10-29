import { base } from '$app/paths';
import { cfg } from '$root/webui.config.js';
import { Log } from '$lib';

const strNoCB = "I'm not hooked up to anything!";

export const modalAbout: ModalSettings = {
  type:                   'component',
  component:              'modalInfo',
  logo:                   `${base}/icons/icon-128.png`,
  title:                  cfg.APP_TITLE,
  package:                `${__APP_NAME__} ${__BUILD_TYPE__}`,
  version:                __APP_VERSION__,
  body:                   cfg.APP_DESCRIPTION,
  showKeyboardShortcuts:  true,
};

export const modalImportExport: ModalSettings = {
  type: 'component',
  component: 'modalImportExport',
  title: 'Import / Export / Link',
  importFileCallback: () => { Log.toastError(strNoCB); },
  exportFileCallback: () => { Log.toastError(strNoCB); },
};

export const modalConfirm: ModalSettings = {
  type: 'component',
  component: 'modalConfirm',
  message: 'Are you sure?',
  txtConfirm: 'Confirm',
  txtCancel: 'Cancel',
  onConfirm: () => { Log.toastError(strNoCB); },
  onCancel: () => {}, // no need for toast - cancel should be omittable
};

export const modalInput: ModalSettings = {
  type: 'component',
  component: 'modalInput',
  message: '',
  inputName: '',
  inputValue: '',
  placeholder: '',
  txtConfirm: 'OK',
  txtCancel: 'Cancel',
  onConfirm: () => { Log.toastError(strNoCB); },
  onCancel: () => {},
};