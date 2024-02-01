import { db } from '$lib/server/db';
import { ObjectId } from 'mongodb';

export const handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (!session) {
		return await resolve(event);
	}

	var o_id = new ObjectId(session);

	const user = await db.collection('Users').findOne({ _id: o_id });

	if (user) {
		event.locals.user = {
			id: session,
			login: user.login
		};
	}
	return await resolve(event);
};
