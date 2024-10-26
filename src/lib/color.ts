import uniqolor from 'uniqolor';

export const uuidToPrimaryColorDark = (uuid:string) => {
	return uniqolor(uuid, {lightness: 40, saturation: [35, 50]}).color;
}
export const uuidToComplimentaryColorDark = (uuid: string) => {
	return `#${(0xffffff^(+('0x'+uniqolor(uuid, {lightness: 80, saturation: [60, 80]}).color.slice(1)))).toString(16).padStart(6, '0')}`;
};

export const uuidToPrimaryColorLight = (uuid:string) => {
	return uniqolor(uuid, {lightness: 80, saturation: [60, 80]}).color;
}
export const uuidToComplimentaryColorLight = (uuid: string) => {
	return `#${(0xffffff^(+('0x'+uniqolor(uuid, {lightness: 20, saturation: [60, 80]}).color.slice(1)))).toString(16).padStart(6, '0')}`;
};