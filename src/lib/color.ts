import uniqolor from 'uniqolor';

export const uuidToPrimaryColorDark = (uuid:string) => {
	return uniqolor(uuid, {lightness: 40, saturation: [35, 50]}).color;
};

export const uuidToPrimaryColorDarkAlt = (uuid:string) => {
	return uniqolor(uuid, {lightness: 50, saturation: [25, 40]}).color;
};

export const uuidToPrimaryColorLight = (uuid:string) => {
	return uniqolor(uuid, {lightness: 80, saturation: [60, 80]}).color;
};

export const uuidToPrimaryColorLightAlt = (uuid:string) => {
	return uniqolor(uuid, {lightness: 90, saturation: [55, 80]}).color;
};

export const uuidToComplimentaryColorDark = (uuid: string) => {
	return `#${(0xffffff^(+('0x'+uniqolor(uuid, {lightness: 80, saturation: [60, 80]}).color.slice(1)))).toString(16).padStart(6, '0')}`;
};

export const uuidToComplimentaryColorLight = (uuid: string) => {
	return `#${(0xffffff^(+('0x'+uniqolor(uuid, {lightness: 20, saturation: [60, 80]}).color.slice(1)))).toString(16).padStart(6, '0')}`;
};

export const pulseEditorBackground = (color: string = '#00ff00', duration: number = 100) => {
  const bg = document.querySelector('.monaco-editor-background');
  if (bg.style.transition != '') return;
  bg.style.transition = 'background 1500ms';
  bg.style.background = color;
  setTimeout(() => bg.style.background = '', duration);
  setTimeout(() => bg.style.transition = '', duration * 2);
}