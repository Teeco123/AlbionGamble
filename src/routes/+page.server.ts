import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { client, db } from '$lib/server/db.js';

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
		var o_id = new ObjectId(session);

		const user = await db.collection('Users').findOne({ _id: o_id });
		console.log(user);
		throw redirect(303, `/profile/${user?.login}`);
	}
};
export const load = async ({ locals }) => {
	return {
		user: locals.user
	};
};

async function WatchDb() {
	try {
		const changeStream = db.collection('Users').watch();

		for await (const change of changeStream) {
			console.log(change);
		}
		await changeStream.close();
	} finally {
		await client.close();
	}
}
WatchDb().catch(console.dir);
