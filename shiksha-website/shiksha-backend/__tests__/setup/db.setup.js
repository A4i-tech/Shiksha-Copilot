const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

/**
 * Setup test database connection
 * Uses MongoDB Memory Server for fast, isolated testing
 */
const setupTestDB = async () => {
  try {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Disconnect any existing connections
    await mongoose.disconnect();

    // Connect to in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Test database connected successfully");
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
    const collections = mongoose.connection.collections;

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
    mongoose.connection.removeAllListeners();

    // Drop database
    await mongoose.connection.dropDatabase();

    // Close connection
    await mongoose.connection.close();

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
      const Model = mongoose.model(modelName);
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
