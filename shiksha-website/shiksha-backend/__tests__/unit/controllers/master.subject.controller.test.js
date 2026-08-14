const MasterSubjectController = require("../../../controllers/master.subject.controller");
const MasterSubjectManager = require("../../../managers/master.subject.manager");

jest.mock("../../../managers/master.subject.manager");

describe("MasterSubjectController", () => {
  let masterSubjectController;
  let mockMasterSubjectManager;
  let req, res;

  beforeEach(() => {
    mockMasterSubjectManager = {
      getByName: jest.fn(),
      getByBoard: jest.fn(),
      updateSubject: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    MasterSubjectManager.mockImplementation(() => mockMasterSubjectManager);
    masterSubjectController = new MasterSubjectController();

    req = {
      params: {},
      body: {},
      user: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("getByName", () => {
    it("should return subject successfully", async () => {
      const mockResult = {
        success: true,
        data: { _id: "subject1", subjectName: "Mathematics" },
      };

      mockMasterSubjectManager.getByName.mockResolvedValue(mockResult);

      req.body = { subject: "Mathematics" };
      req.user = { school: "school1" };

      await masterSubjectController.getByName(req, res);

      expect(mockMasterSubjectManager.getByName).toHaveBeenCalledWith(
        "Mathematics",
        { school: "school1" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 404 when subject not found", async () => {
      const mockResult = {
        success: false,
        message: "Subject not found",
      };

      mockMasterSubjectManager.getByName.mockResolvedValue(mockResult);

      req.body = { subject: "NonExistent" };
      req.user = { school: "school1" };

      await masterSubjectController.getByName(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Subject not found" });
    });

    it("should propagate errors instead of responding directly", async () => {
      const error = new Error("Database error");
      mockMasterSubjectManager.getByName.mockRejectedValue(error);

      req.body = { subject: "Mathematics" };
      req.user = { school: "school1" };

      await expect(
        masterSubjectController.getByName(req, res)
      ).rejects.toThrow("Database error");
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("getByBoard", () => {
    it("should return subjects for board", async () => {
      const mockResult = {
        success: true,
        data: [
          { _id: "subject1", subjectName: "Mathematics" },
          { _id: "subject2", subjectName: "Science" },
        ],
      };

      mockMasterSubjectManager.getByBoard.mockResolvedValue(mockResult);

      req.params = { board: "CBSE" };

      await masterSubjectController.getByBoard(req, res);

      expect(mockMasterSubjectManager.getByBoard).toHaveBeenCalledWith("CBSE");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 404 when board has no subjects", async () => {
      const mockResult = {
        success: false,
        message: "No subjects found",
      };

      mockMasterSubjectManager.getByBoard.mockResolvedValue(mockResult);

      req.params = { board: "INVALID" };

      await masterSubjectController.getByBoard(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No subjects found" });
    });

    it("should propagate errors instead of responding directly", async () => {
      const error = new Error("Database error");
      mockMasterSubjectManager.getByBoard.mockRejectedValue(error);

      req.params = { board: "CBSE" };

      await expect(
        masterSubjectController.getByBoard(req, res)
      ).rejects.toThrow("Database error");
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update subject successfully", async () => {
      const mockResult = {
        success: true,
        data: { _id: "subject1", subjectName: "Updated Mathematics" },
      };

      mockMasterSubjectManager.updateSubject.mockResolvedValue(mockResult);

      req.params = { id: "subject1" };
      req.body = { subjectName: "Updated Mathematics" };

      await masterSubjectController.update(req, res);

      expect(mockMasterSubjectManager.updateSubject).toHaveBeenCalledWith(
        "subject1",
        { subjectName: "Updated Mathematics" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 404 when subject not found", async () => {
      const mockResult = {
        success: false,
        message: "Subject not found",
      };

      mockMasterSubjectManager.updateSubject.mockResolvedValue(mockResult);

      req.params = { id: "nonexistent" };
      req.body = { subjectName: "Updated" };

      await masterSubjectController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Subject not found" });
    });

    it("should propagate errors instead of responding directly", async () => {
      const error = new Error("Database error");
      mockMasterSubjectManager.updateSubject.mockRejectedValue(error);

      req.params = { id: "subject1" };
      req.body = { subjectName: "Updated" };

      await expect(masterSubjectController.update(req, res)).rejects.toThrow(
        "Database error"
      );
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
