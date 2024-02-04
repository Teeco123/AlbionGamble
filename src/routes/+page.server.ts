import { redirect } from '@sveltejs/kit';
import {
	query,
	where,
	collection,
	documentId,
	getDocs,
	orderBy,
	limit,
	setDoc,
	doc,
	updateDoc,
	arrayUnion,
	increment
} from 'firebase/firestore';
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
	},
	dropSilver: async ({ request, cookies }) => {
		const data = await request.formData();
		const silver = data.get('silver');
		const session = cookies.get('session');
		let userData;
		let userId: any;

		//Finding user in databse
		let userQuery = query(collection(firestore, 'users'), where(documentId(), '==', session));
		const userSnapshot = await getDocs(userQuery);
		userSnapshot.forEach((userDoc) => {
			userData = userDoc.data();
			userId = userDoc.id;
		});

		//@ts-ignore
		let userBalance = userData?.balance;
		//@ts-ignore
		let newBalance = userBalance - silver;

		if (newBalance >= 0) {
			//Querying latest gamble document id
			let gambleId: any;
			let gambleData: any;

			const gambleRef = collection(firestore, 'gambles');
			const gambleQuery = query(gambleRef, orderBy('date', 'asc'), limit(1));
			const gambleSnapshot = await getDocs(gambleQuery);
			gambleSnapshot.forEach((gambleDoc) => {
				gambleData = gambleDoc.data();
				gambleId = gambleDoc.id;
			});

			//Adding new user to the gamble poll & increasing totalPlayers + totalSilver
			await updateDoc(doc(firestore, 'gambles', gambleId), {
				players: arrayUnion({
					balanceDrop: silver,
					id: userId,
					//@ts-ignore{
					login: userData.login
				}),
				totalPlayers: increment(1),
				totalSilver: Number(gambleData?.totalSilver) + Number(silver)
			});

			//Updating users balance
			await setDoc(
				doc(firestore, 'users', userId),
				{
					balance: newBalance
				},
				{ merge: true }
			);

			return { success: true };
		} else if (newBalance < 0) {
			return { notEnoughSilver: true };
		}
	}
};
export const load = async ({ locals }) => {
	return {
		user: locals.user
	};
};
