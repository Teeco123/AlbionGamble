import { addDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { firestore } from '$lib/firebase';

export const handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (!session) {
		return await resolve(event);
	}

	let userData;
	let userQuery = query(collection(firestore, 'users'), where(documentId(), '==', session));
	const userSnapshot = await getDocs(userQuery);
	userSnapshot.forEach((userDoc) => {
		userData = userDoc.data();
	});

	if (userData) {
		event.locals.user = {
			id: session,
			//@ts-ignore
			login: userData.login,
			//@ts-ignore
			balance: userData.balance
		};
	}
	return await resolve(event);
};
