import * as MongoClient from 'mongodb';
import * as assert from 'assert';
import { dbURL } from './../JSON/private.json';
import { dbName } from './../JSON/config.json';

const dbClient = new MongoClient.MongoClient(dbURL);
let db : MongoClient.Db;

dbClient.connect((err) => {
	assert.strictEqual(null, err);
	console.log("Connected to DB");

	db = dbClient.db(dbName);
});

export let create = (callback: () => void) => {
	//https://image.slidesharecdn.com/mongodbinternalsdevternity-151209084136-lva1-app6891/95/mongodb-internals-24-638.jpg?cb=1449650618
	const collection = db.collection('documents');
}

export let read = (callback: () => void) => {

}

export let update = (callback: () => void) => {

}

export let remove = (callback: () => void) => {

}

export let closeConnection = () => {
	dbClient.close();
}