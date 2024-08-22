const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017'; // MongoDB 연결 URI
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('eventDB'); // 데이터베이스 이름
    } catch (err) {
        console.error(err);
    }
}

async function saveClickEvent(id, clickType) {
    const db = await connectToDatabase();
    const collection = db.collection('clickEvents');
    await collection.insertOne({ id, clickType, timestamp: new Date() });
}

module.exports = { saveClickEvent };
