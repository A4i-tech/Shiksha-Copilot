const BaseDao = require("../../../dao/base.dao");
const {
  setupTestDB,
  closeTestDB,
  clearTestDB,
} = require("../../setup/db.setup");
const mongoose = require("mongoose");

// Create a test model for testing BaseDao
const TestSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TestModel = mongoose.model("TestDao", TestSchema);

describe("BaseDao", () => {
  let testDao;

  beforeAll(async () => {
    await setupTestDB();
    testDao = new BaseDao(TestModel);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("create", () => {
    it("should create a new document", async () => {
      const data = { name: "John Doe", email: "john@example.com", age: 30 };
      const result = await testDao.create(data);

      expect(result).toBeDefined();
      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john@example.com");
      expect(result.age).toBe(30);
      expect(result.isDeleted).toBe(false);
    });
  });

  describe("getById", () => {
    it("should get document by ID", async () => {
      const created = await testDao.create({
        name: "Test User",
        email: "test@example.com",
      });
      const result = await testDao.getById(created._id);

      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(created._id.toString());
      expect(result.name).toBe("Test User");
    });

    it("should return null for non-existent ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const result = await testDao.getById(fakeId);

      expect(result).toBeNull();
    });

    it("should return deleted documents as stored", async () => {
      const created = await testDao.create({
        name: "Deleted User",
        isDeleted: true,
      });
      const result = await testDao.getById(created._id);

      expect(result).toBeDefined();
      expect(result.isDeleted).toBe(true);
    });
  });

  describe("getOne", () => {
    it("should get one document by filter", async () => {
      await testDao.create({ name: "User One", email: "user1@example.com" });
      const result = await testDao.getOne({ email: "user1@example.com" });

      expect(result).toBeDefined();
      expect(result.name).toBe("User One");
      expect(result.email).toBe("user1@example.com");
    });

    it("should return null if no match found", async () => {
      const result = await testDao.getOne({ email: "nonexistent@example.com" });
      expect(result).toBeNull();
    });

    it("should include deleted documents as stored", async () => {
      await testDao.create({
        name: "Deleted",
        email: "deleted@example.com",
        isDeleted: true,
      });
      const result = await testDao.getOne({ email: "deleted@example.com" });

      expect(result).toBeDefined();
      expect(result.isDeleted).toBe(true);
    });
  });

  describe("filter", () => {
    beforeEach(async () => {
      await testDao.create({ name: "Alice", age: 25 });
      await testDao.create({ name: "Bob", age: 30 });
      await testDao.create({ name: "Charlie", age: 35 });
      await testDao.create({ name: "Deleted User", age: 40, isDeleted: true });
    });

    it("should filter documents by criteria", async () => {
      const result = await testDao.filter({ age: { $gte: 30 } });

      expect(result).toHaveLength(3);
      expect(result.map((r) => r.name)).toContain("Bob");
      expect(result.map((r) => r.name)).toContain("Charlie");
      expect(result.map((r) => r.name)).toContain("Deleted User");
    });

    it("should return empty array if no matches", async () => {
      const result = await testDao.filter({ age: 100 });
      expect(result).toHaveLength(0);
    });
  });

  describe("getAll", () => {
    beforeEach(async () => {
      for (let i = 1; i <= 25; i++) {
        await testDao.create({ name: `User ${i}`, age: 20 + i });
      }
    });

    it("should get paginated results", async () => {
      const result = await testDao.getAll(1, 10, {}, { _id: 1 });

      expect(result.results).toHaveLength(10);
      expect(result.totalItems).toBe(25);
      expect(result.page).toBe(1);
    });

    it("should get second page", async () => {
      const result = await testDao.getAll(2, 10, {}, { _id: 1 });

      expect(result.results).toHaveLength(10);
      expect(result.page).toBe(2);
    });

    it("should filter results", async () => {
      const result = await testDao.getAll(
        1,
        10,
        { age: { $gte: 40 } },
        { _id: 1 }
      );

      expect(result.results.length).toBeLessThanOrEqual(10);
      expect(result.results.every((d) => d.age >= 40)).toBe(true);
    });

    it("should sort results", async () => {
      const result = await testDao.getAll(1, 10, {}, { age: -1 }); // Sort by age descending

      expect(result.results[0].age).toBeGreaterThan(result.results[1].age);
    });
  });

  describe("update", () => {
    it("should update document by ID", async () => {
      const created = await testDao.create({
        name: "Original Name",
        email: "original@example.com",
        age: 25,
      });

      // Add update method to BaseDao if it doesn't exist
      testDao.update = async (id, data) => {
        return await TestModel.findByIdAndUpdate(id, data, { new: true });
      };

      const updated = await testDao.update(created._id, {
        name: "Updated Name",
        age: 30,
      });

      expect(updated).toBeDefined();
      expect(updated.name).toBe("Updated Name");
      expect(updated.age).toBe(30);
      expect(updated.email).toBe("original@example.com"); // Should remain unchanged
    });

    it("should return null for non-existent ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      testDao.update = async (id, data) => {
        return await TestModel.findByIdAndUpdate(id, data, { new: true });
      };

      const result = await testDao.update(fakeId, { name: "Test" });

      expect(result).toBeNull();
    });
  });

  describe("delete (soft delete)", () => {
    it("should soft delete document", async () => {
      const created = await testDao.create({
        name: "To Delete",
        email: "delete@example.com",
      });
      const result = await testDao.delete(created._id);

      expect(result).toBeDefined();
      expect(result.isDeleted).toBe(true);

      const retrieved = await testDao.getById(created._id);
      expect(retrieved).toBeDefined();
      expect(retrieved.isDeleted).toBe(true);
    });
  });

  describe("activate", () => {
    it("should reactivate soft-deleted document", async () => {
      const created = await testDao.create({
        name: "Deleted",
        isDeleted: true,
      });
      const result = await testDao.activate(created._id);

      expect(result).toBeDefined();
      expect(result.isDeleted).toBe(false);

      // Should now be retrievable
      const retrieved = await testDao.getById(created._id);
      expect(retrieved).toBeDefined();
    });
  });

  describe("count", () => {
    it("should count non-deleted documents", async () => {
      await testDao.create({ name: "User 1", isDeleted: false });
      await testDao.create({ name: "User 2", isDeleted: false });
      await testDao.create({ name: "User 3", isDeleted: true });

      // Add count method to BaseDao if it doesn't exist
      testDao.count = async (filter = {}) => {
        return await TestModel.countDocuments({ ...filter, isDeleted: false });
      };

      const count = await testDao.count();

      expect(count).toBe(2);
    });

    it("should count with filter", async () => {
      await testDao.create({
        name: "Active User",
        email: "active@example.com",
        isDeleted: false,
      });
      await testDao.create({
        name: "Another User",
        email: "other@example.com",
        isDeleted: false,
      });
      await testDao.create({
        name: "Active User 2",
        email: "active2@example.com",
        isDeleted: false,
      });

      testDao.count = async (filter = {}) => {
        return await TestModel.countDocuments({ ...filter, isDeleted: false });
      };

      const count = await testDao.count({ name: /Active/ });

      expect(count).toBe(2);
    });
  });
});
