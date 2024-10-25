import uniqolor from 'uniqolor';

export const uuidToPrimaryColorDark = (uuid:string) => {
	return uniqolor(uuid, {lightness: 55, saturation: [35, 50]}).color;
}
export const uuidToComplimentaryColorDark = (uuid: string) => {
	return `#${(0xffffff^(+('0x'+uniqolor(uuid, {lightness: 75, saturation: [60, 80]}).color.slice(1)))).toString(16).padStart(6, '0')}`;
};

export const uuidToPrimaryColorLight = (uuid:string) => {
	return uniqolor(uuid, {lightness: 70, saturation: [50, 70]}).color;
}
export const uuidToComplimentaryColorLight = (uuid: string) => {
	return `#${(0xffffff^(+('0x'+uniqolor(uuid, {lightness: 30, saturation: [50, 70]}).color.slice(1)))).toString(16).padStart(6, '0')}`;
};