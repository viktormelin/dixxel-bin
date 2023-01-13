import { Images } from '@prisma/client';

export const getUserImages = async () => {
	let retVal: Images[] = [];
	await fetch(`/api/files/images?type=fetch&scope=all`, {
		method: 'GET',
		body: null,
	}).then((res) =>
		res.json().then((data: Images[]) => {
			retVal = data;
		})
	);

	return retVal;
};
