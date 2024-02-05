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
	arrayUnion,
	increment,
	addDoc,
	serverTimestamp,
	getDoc,
	onSnapshot
} from 'firebase/firestore';
import { firestore } from '$lib/firebase';

export const actions = {
	loginRedirect: async () => {
		throw redirect(303, '/login');
	},
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });

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
		const silver = Number(data.get('silver'));
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

		if (newBalance >= 0 && silver > 0) {
			//Querying latest gamble document id
			let gambleId: any;
			let gambleData: any;

			const gambleRef = collection(firestore, 'gambles');
			const gambleQuery = query(gambleRef, orderBy('date', 'desc'), limit(1));
			const gambleSnapshot = await getDocs(gambleQuery);
			gambleSnapshot.forEach((gambleDoc) => {
				gambleData = gambleDoc.data();
				gambleId = gambleDoc.id;
			});

			//Generating unique id for every balance drop
			const serverTime = serverTimestamp();
			let uid: any;

			await addDoc(collection(firestore, 'tmp'), { date: serverTime });

			const idRef = collection(firestore, 'tmp');
			const idQuery = query(idRef, orderBy('date', 'desc'), limit(1));
			const idSnapshot = await getDocs(idQuery);
			idSnapshot.forEach((idDoc) => {
				uid = idDoc.id;
			});

			//Adding new user to the gamble poll & increasing totalPlayers + totalSilver
			await setDoc(
				doc(firestore, 'gambles', gambleId),
				{
					players: arrayUnion({
						id: uid,
						balanceDrop: silver,
						playerId: userId,
						//@ts-ignore
						login: userData.login
					}),
					totalPlayers: increment(1),
					totalSilver: Number(gambleData?.totalSilver) + Number(silver)
				},
				{ merge: true }
			);

			//Updating users balance
			await setDoc(
				doc(firestore, 'users', userId),
				{
					balance: newBalance
				},
				{ merge: true }
			);

			return { success: true };
		} else if (silver <= 0) {
			return { cantGoFor0: true };
		} else if (newBalance < 0) {
			return { notEnoughSilver: true };
		}
	}
};
export const load = async ({ locals }) => {
	let _gambleData;
	const gambleRef = collection(firestore, 'gambles');
	const gambleQuery = query(gambleRef, orderBy('date', 'desc'), limit(1));

	const gambleFirstDoc = await getDocs(gambleQuery);
	gambleFirstDoc.forEach((gambleDocFirst) => {
		_gambleData = gambleDocFirst.data();
	});

	//Get document every update
	const unsubscribe = onSnapshot(gambleQuery, (gambleSnapshot) => {
		gambleSnapshot.forEach((gambleDoc) => {
			_gambleData = gambleDoc.data();
		});
	});

	if (typeof _gambleData !== 'undefined') {
	} else {
		console.error('error: gamble data is undefined');
	}

	let gambleData = JSON.parse(JSON.stringify(_gambleData));
	return {
		user: locals.user,
		gamble: gambleData
	};
};
