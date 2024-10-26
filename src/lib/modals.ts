import { base } from '$app/paths';
import { strAboutText } from '$lib';
import * as g from '$lib/globals';

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
	localSaveDocCallback: () => {},
	localSaveDocNewVersionCallback: () => {},
};

export const modalLoad: ModalSettings = {
	type: 'component',
	component: 'modalLoad',
	title: 'Load / Import / Browse'
};

export const modalConfirm: ModalSettings = {
	type: 'component',
	component: 'modalConfirm',
	message: 'Are you sure?',
	txtConfirm: 'Confirm',
	txtCancel: 'Cancel',
	onConfirm: () => {},
	onCancel: () => {},
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
	onConfirm: () => {},
	onCancel: () => {},
};