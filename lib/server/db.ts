import "server-only"
import { MongoClient, type Db } from "mongodb"
import { readServerEnv } from "./env"

const DEFAULT_DB = "myscapez"

/** One client per server instance, reused across requests and hot reloads. */
const cache = globalThis as typeof globalThis & { _myscapezMongo?: Promise<MongoClient> }

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("leads").createIndex({ fingerprint: 1, createdAt: -1 }),
    db.collection("leads").createIndex({ suburb: 1, category: 1, createdAt: -1 }),
    db.collection("listings").createIndex({ fingerprint: 1, createdAt: -1 }),
    db.collection("listings").createIndex({ status: 1, createdAt: -1 }),
  ])
}

function databaseName() {
  return readServerEnv("MONGODB_DB") || DEFAULT_DB
}

/** The MongoDB database, or null when MONGODB_URI is not set. */
export async function database(): Promise<Db | null> {
  const uri = readServerEnv("MONGODB_URI")
  if (!uri) return null
  if (!cache._myscapezMongo) {
    const client = new MongoClient(uri, { appName: "myscapez", maxPoolSize: 5, serverSelectionTimeoutMS: 5000 })
    cache._myscapezMongo = client
      .connect()
      .then(async (connected) => {
        await ensureIndexes(connected.db(databaseName()))
        return connected
      })
      .catch((error: unknown) => {
        // Let the next request try again instead of keeping a failed connection.
        cache._myscapezMongo = undefined
        throw error
      })
  }
  const client = await cache._myscapezMongo
  return client.db(databaseName())
}
