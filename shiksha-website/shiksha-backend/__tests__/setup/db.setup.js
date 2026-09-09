const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
/** @type {import("mongoose").Connection} */
let connection;

/**
 * Setup test database connection
 * Uses MongoDB Memory Server for fast, isolated testing.
 * Opens its own connection (not the default `mongoose.connect`), so it never
 * touches the shared default connection every other model file registers on
 * — closing it here would otherwise leave every other test file's model
 * calls buffering against a dead connection for the rest of the Jest run.
 * @returns {Promise<import("mongoose").Connection>} the isolated connection
 */
const setupTestDB = async () => {
  try {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    connection = await mongoose.createConnection(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).asPromise();

    console.log("Test database connected successfully");
    return connection;
  } catch (error) {
    console.error("Test database connection error:", error);
    throw error;
  }
};

/**
 * Clear all collections in test database
 */
const clearTestDB = async () => {
  try {
    const collections = connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    console.log("Test database cleared");
  } catch (error) {
    console.error("Error clearing test database:", error);
    throw error;
  }
};

/**
 * Close database connection and stop MongoDB Memory Server
 */
const closeTestDB = async () => {
  try {
    // Remove all event listeners to prevent memory leaks
    connection.removeAllListeners();

    // Drop database
    await connection.dropDatabase();

    // Close connection
    await connection.close();

    // Stop MongoDB Memory Server
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }

    console.log("Test database connection closed");
  } catch (error) {
    console.error("Error closing test database:", error);
    throw error;
  }
};

/**
 * Seed test database with initial data
 * @param {Object} data - Object containing arrays of documents for each model
 */
const seedTestDB = async (data) => {
  try {
    const models = Object.keys(data);

    for (const modelName of models) {
      const Model = connection.model(modelName);
      const documents = data[modelName];

      if (Array.isArray(documents) && documents.length > 0) {
        await Model.insertMany(documents);
        console.log(`Seeded ${documents.length} ${modelName} documents`);
      }
    }
  } catch (error) {
    console.error("Error seeding test database:", error);
    throw error;
  }
};

/**
 * Get a clean database for each test
 * Use in beforeEach() for test isolation
 */
const resetTestDB = async () => {
  await clearTestDB();
};

module.exports = {
  setupTestDB,
  clearTestDB,
  closeTestDB,
  seedTestDB,
  resetTestDB,
};
