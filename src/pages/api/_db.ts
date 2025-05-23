import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb://localhost:27017/';
const dbName = 'gamyam-crud';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
} 