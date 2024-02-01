import { MongoClient } from 'mongodb';
import { DB_URL } from '$env/static/private';

export const client = new MongoClient(DB_URL);
export const db = client.db('AlbionGamble');

async function Connect() {
	try {
		await client.connect();
		console.log('Successfully connected to database!');
	} catch {
		console.log('Connection to database failed!');
	}
}

Connect();
