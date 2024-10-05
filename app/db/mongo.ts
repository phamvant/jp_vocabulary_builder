import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL || ""; // Default to an empty string if undefined

class MongoDbSingleton {
  private client: MongoClient | null;
  private db: Db | null;

  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect(): Promise<Db> {
    // Check if already connected
    if (this.client && this.db) {
      return this.db;
    }

    // Initialize the MongoClient
    this.client = new MongoClient(uri);

    try {
      await this.client.connect();
      this.db = this.client.db("jp_quiz"); // Database name
      return this.db;
    } catch (err) {
      throw new Error("Can't connect to MongoDB");
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}

const mongoInstance = new MongoDbSingleton();

// Automatically connect when the module is loaded
(async () => {
  try {
    await mongoInstance.connect();
  } catch (err) {}
})();

export default mongoInstance;
