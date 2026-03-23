const mongoose = require("mongoose");

/**
 * Global teardown - runs after all tests complete
 * Ensures all connections and handles are properly closed
 */
module.exports = async () => {
  try {
    // Close Mongoose connection if it exists
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("Global teardown: Mongoose connection closed");
    }

    // Force close any remaining timers/intervals
    if (global.gc) {
      global.gc();
    }
  } catch (error) {
    console.error("Error during global teardown:", error);
  }

  // Give a small delay for final cleanup
  await new Promise((resolve) => setTimeout(resolve, 100));
};
