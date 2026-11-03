const ClassManager = require("../../../managers/school.class.manager");
const ClassDao = require("../../../dao/school.class.dao");

const School = require("../../../models/school.model");

jest.mock("../../../dao/school.class.dao");
jest.mock("../../../models/school.model", () => ({ findById: jest.fn(), exists: jest.fn(), distinct: jest.fn() }));

const GLOBAL = [{ permission: "content.manage", scopeType: "GLOBAL", dep: null }, { permission: "school.read", scopeType: "GLOBAL", dep: null }];
const SCHOOL_A = "aaaaaaaaaaaaaaaaaaaaaaaa";
const SCHOOL_B = "bbbbbbbbbbbbbbbbbbbbbbbb";
const schoolGrants = (permission, dep) => [{ permission, scopeType: "SCHOOL", dep }];

describe("ClassManager", () => {
  let classManager;
  let mockClassDao;

  beforeEach(() => {
    mockClassDao = {
      getGroupClassesByBoard: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    jest.resetAllMocks();
    ClassDao.mockImplementation(() => mockClassDao);
    School.findById.mockImplementation((id) => ({ lean: () => Promise.resolve(id ? { _id: id } : null) }));
    classManager = new ClassManager();
  });

  describe("getGroupClassesByBoard", () => {
    it("should return grouped classes successfully", async () => {
      const mockClasses = [
        { _id: "class1", className: "Class 10" },
        { _id: "class2", className: "Class 9" },
      ];

      mockClassDao.getGroupClassesByBoard.mockResolvedValue(mockClasses);

      const result = await classManager.getGroupClassesByBoard("school1", GLOBAL);

      expect(mockClassDao.getGroupClassesByBoard).toHaveBeenCalledWith(
        "school1"
      );
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockClasses,
      });
    });

    it("should propagate errors instead of swallowing them", async () => {
      const error = new Error("Database error");

      mockClassDao.getGroupClassesByBoard.mockRejectedValue(error);

      await expect(classManager.getGroupClassesByBoard("school1", GLOBAL)).rejects.toThrow("Database error");
    });
  });

  describe("updateClass", () => {
    it("should update class successfully", async () => {
      const updates = { className: "Class 10A" };
      const mockUpdatedClass = {
        _id: "class1",
        className: "Class 10A",
      };

      mockClassDao.getById.mockResolvedValue({ _id: "class1" });
      mockClassDao.update.mockResolvedValue(mockUpdatedClass);

      const result = await classManager.updateClass("class1", updates, GLOBAL);

      expect(mockClassDao.update).toHaveBeenCalledWith("class1", updates);
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockUpdatedClass,
      });
    });

    it("should return not found when class doesn't exist", async () => {
      const updates = { className: "Class 10A" };

      mockClassDao.getById.mockResolvedValue(null);

      const result = await classManager.updateClass("nonexistent", updates, GLOBAL);

      expect(result).toEqual({
        success: false,
        message: "Class not found",
        data: null,
      });
    });

    it("should propagate errors instead of swallowing them", async () => {
      const updates = { className: "Class 10A" };
      const error = new Error("Database error");

      mockClassDao.getById.mockResolvedValue({ _id: "class1" });
      mockClassDao.update.mockRejectedValue(error);

      await expect(classManager.updateClass("class1", updates, GLOBAL)).rejects.toThrow("Database error");
    });
  });
  describe("school scope", () => {
    beforeEach(() => {
      mockClassDao.getById.mockResolvedValue({ _id: "class1", schoolId: SCHOOL_B });
    });

    it("blocks a SCHOOL-scoped content.manage holder from updating another school's class", async () => {
      await expect(classManager.updateClass("class1", { start: 1 }, schoolGrants("content.manage", SCHOOL_A))).rejects.toMatchObject({ statusCode: 403 });
      expect(mockClassDao.update).not.toHaveBeenCalled();
    });

    it("allows updating a class of the grant's own school", async () => {
      mockClassDao.update.mockResolvedValue({ _id: "class1" });
      await classManager.updateClass("class1", { start: 1 }, schoolGrants("content.manage", SCHOOL_B));
      expect(mockClassDao.update).toHaveBeenCalled();
    });

    it("blocks deleting another school's class", async () => {
      const req = { params: { id: "class1" }, permissions: schoolGrants("content.manage", SCHOOL_A) };
      await expect(classManager.delete(req)).rejects.toMatchObject({ statusCode: 403 });
      expect(mockClassDao.delete).not.toHaveBeenCalled();
    });

    it("allows reading a class of the caller's own school by id", async () => {
      School.exists.mockResolvedValue({ _id: SCHOOL_B });
      const req = { params: { id: "class1" }, permissions: schoolGrants("school.read", SCHOOL_B) };
      expect(await classManager.getById(req)).toEqual(expect.objectContaining({ success: true, data: { _id: "class1", schoolId: SCHOOL_B } }));
    });

    it("allows deleting a class of the grant's own school", async () => {
      mockClassDao.delete.mockResolvedValue({ _id: "class1" });
      const req = { params: { id: "class1" }, permissions: schoolGrants("content.manage", SCHOOL_B) };
      await classManager.delete(req);
      expect(mockClassDao.delete).toHaveBeenCalled();
    });

    it("lets a GLOBAL grant update a class that has a school", async () => {
      mockClassDao.update.mockResolvedValue({ _id: "class1" });
      const result = await classManager.updateClass("class1", { start: 1 }, GLOBAL);
      expect(result.success).toBe(true);
    });

    it("blocks reading another school's class by id", async () => {
      School.exists.mockResolvedValue(null);
      const req = { params: { id: "class1" }, permissions: schoolGrants("school.read", SCHOOL_A) };
      expect(await classManager.getById(req)).toEqual({ success: false, message: "Record not found. Refresh the page and try again.", data: null });
    });

    it("answers a missing class and an out-of-scope class the same way", async () => {
      School.exists.mockResolvedValue(null);
      const req = { params: { id: "class1" }, permissions: schoolGrants("school.read", SCHOOL_A) };
      const outOfScope = await classManager.getById(req);
      mockClassDao.getById.mockResolvedValue(null);
      expect(outOfScope.message).toBe("Record not found. Refresh the page and try again.");
      expect(outOfScope).toEqual(await classManager.getById(req));
    });

    it("blocks creating a class in another school", async () => {
      const req = { body: { school_id: SCHOOL_B }, permissions: schoolGrants("content.manage", SCHOOL_A) };
      await expect(classManager.create(req)).rejects.toMatchObject({ statusCode: 403 });
      expect(mockClassDao.create).not.toHaveBeenCalled();
    });

    it("allows creating a class in the grant's own school", async () => {
      mockClassDao.create.mockResolvedValue({ _id: "class1" });
      const req = { body: { school_id: SCHOOL_A }, permissions: schoolGrants("content.manage", SCHOOL_A) };
      await classManager.create(req);
      expect(mockClassDao.create).toHaveBeenCalledWith(expect.objectContaining({ schoolId: SCHOOL_A }));
    });

    it("blocks grouped classes of another school", async () => {
      School.exists.mockResolvedValue(null);
      await expect(classManager.getGroupClassesByBoard(SCHOOL_B, schoolGrants("school.read", SCHOOL_A))).rejects.toMatchObject({ statusCode: 403 });
      expect(mockClassDao.getGroupClassesByBoard).not.toHaveBeenCalled();
    });

    it("limits the class list to the caller's own and scoped schools", async () => {
      School.distinct.mockResolvedValue([SCHOOL_A]);
      const filter = await classManager.classScope(schoolGrants("school.read", SCHOOL_A));
      expect(filter).toEqual({ schoolId: { $in: [SCHOOL_A] } });
    });

    it("does not limit the class list for a GLOBAL grant", async () => {
      expect(await classManager.classScope(GLOBAL)).toEqual({});
    });
  });
});
