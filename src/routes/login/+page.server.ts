import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '$lib/firebase';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const login = data.get('login');
		const password = data.get('password');

		let userData;
		let userId;
		let userQuery = query(
			collection(firestore, 'users'),
			where('login', '==', login),
			where('password', '==', password)
		);
		const userSnapshot = await getDocs(userQuery);
		userSnapshot.forEach((userDoc) => {
			// doc.data() is never undefined for query doc snapshots
			userData = userDoc.data();
			userId = userDoc.id;
		});

		if (userData) {
			//@ts-ignore
			cookies.set('session', userId, {
				path: '/',
				httpOnly: true,
				secure: true,
				maxAge: 60 * 60 * 24 * 2
			});

			throw redirect(303, `/`);
		} else if (!login) {
			return { loginRequired: true };
		} else if (!password) {
			return { passwordRequired: true };
		} else if (!userData) {
			return { dontMatch: true };
		}
	},

	register: async ({ request }) => {
		const data = await request.formData();
		const login = data.get('login');
		const password = data.get('password');

		let userData;
		let userQuery = query(collection(firestore, 'users'), where('login', '==', login));
		const userSnapshot = await getDocs(userQuery);
		userSnapshot.forEach((userDoc) => {
			// doc.data() is never undefined for query doc snapshots
			userData = userDoc.data();
		});

		if (!userData && password && login) {
			addDoc(collection(firestore, 'users'), {
				login: login,
				password: password,
				balance: 0
			});
			return { success: true };
		} else if (!login) {
			return { loginRequired: true };
		} else if (!password) {
			return { passwordRequired: true };
		} else if (userData) {
			return { userExists: true };
		}
	}
};
