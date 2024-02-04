import { redirect } from '@sveltejs/kit';
import { query, where, collection, documentId, getDocs } from 'firebase/firestore';
import { firestore } from '$lib/firebase';

export const actions = {
	loginRedirect: async () => {
		throw redirect(303, '/login');
	},
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		console.log(cookies.get('session'));

		throw redirect(303, '/');
	},
	myProfile: async ({ cookies }) => {
		const session = cookies.get('session');

		let userData;
		let userQuery = query(collection(firestore, 'users'), where(documentId(), '==', session));
		const userSnapshot = await getDocs(userQuery);
		userSnapshot.forEach((userDoc) => {
			userData = userDoc.data();
		});
		//@ts-ignore
		throw redirect(303, `/profile/${userData?.login}`);
	}
};
export const load = async ({ locals }) => {
	return {
		user: locals.user
	};
};
