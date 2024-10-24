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
	title: 'Save / Export / Share'
};
export const modalLoad: ModalSettings = {
	type: 'component',
	component: 'modalLoad',
	title: 'Load / Import / Browse'
};