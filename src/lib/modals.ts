import { base } from '$app/paths';

import { strAboutText } from '$lib'

export const modalAbout: ModalSettings = {
	type: 'component',
	component: 'modalInfo',
	logo: `${base}/icons/icon-128.png`,
	title: 'Webui Editor Skeleton',
	package: __APP_NAME__,
	version: __APP_VERSION__,
	body: strAboutText
};
export const modalSave: ModalSettings = {
	type: 'component',
	component: 'modalSave',
	title: 'Save',
	body: 'This is the export page.'
};
export const modalLoad: ModalSettings = {
	type: 'component',
	component: 'modalLoad',
	title: 'Load',
	body: 'This is the import page.'
};