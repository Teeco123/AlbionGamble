import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';

initializeApp();

export const helloWorld = onRequest((request, response) => {
	logger.info('Hello logs!', { structuredData: true });
	response.send('Hello from Firebase!');
});

export const createGamble = onSchedule('* * * * *', async () => {
	const serverTime = new Date().toUTCString();

	let randomDegree = Math.floor(Math.random() * (50 - 10) * 1000);

	await getFirestore().collection('gambles').add({
		date: serverTime,
		totalPlayers: 0,
		totalSilver: 0,
		spinDegree: randomDegree
	});
});
