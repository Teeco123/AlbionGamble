import { db } from '$lib/server/db.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const login = data.get('login');
		const password = data.get('password');

		let user = await db
			.collection('Users')
			.findOne({ login: { $eq: login }, password: { $eq: password } });

		const userid = String(user?._id);

		if (user) {
			cookies.set('session', userid, {
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
		} else if (!user) {
			return { dontMatch: true };
		}
	},

	register: async ({ request }) => {
		const data = await request.formData();
		const login = data.get('login');
		const password = data.get('password');

		let user = await db.collection('Users').findOne({ login: login });

		if (!user && password && login) {
			db.collection('Users').insertOne({ login: login, password: password, balance: 0 });
			return { success: true };
		} else if (!login) {
			return { loginRequired: true };
		} else if (!password) {
			return { passwordRequired: true };
		} else if (user) {
			return { userExists: true };
		}
	}
};
