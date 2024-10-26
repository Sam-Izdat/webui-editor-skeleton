import { base } from '$app/paths';
import { strAboutText } from '$lib/strings';
import * as g from '$lib/globals';
import { Log } from '$lib';

const strNoCB = "I'm not hooked up to anything!";

export const modalAbout: ModalSettings = {
	type: 'component',
	component: 'modalInfo',
	logo: `${base}/icons/icon-128.png`,
	title: g.APP_TITLE,
	package: `${__APP_NAME__} ${__BUILD_TYPE__}`,
	version: __APP_VERSION__,
	body: strAboutText
};

export const modalSave: ModalSettings = {
	type: 'component',
	component: 'modalSave',
	title: 'Save / Export / Share',
	session: null,
	localSaveDocCallback: () => { Log.toastError(strNoCB); },
	localSaveDocNewVersionCallback: () => { Log.toastError(strNoCB); },
	exportFileCallback: () => { Log.toastError(strNoCB); },
};

export const modalLoad: ModalSettings = {
	type: 'component',
	component: 'modalLoad',
	title: 'Load / Import / Browse',
	localLoadDocCallback: () => { Log.toastError(strNoCB); },
	importFileCallback: () => { Log.toastError(strNoCB); },
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