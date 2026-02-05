const SubjectController = require("../../../controllers/subject.controller");
const SubjectManager = require("../../../managers/subject.manager");

jest.mock("../../../managers/subject.manager");

describe("SubjectController", () => {
  let subjectController;
  let mockSubjectManager;
  let req, res;

  beforeEach(() => {
    mockSubjectManager = {
      updateSubject: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    SubjectManager.mockImplementation(() => mockSubjectManager);
    subjectController = new SubjectController();

    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("update", () => {
    it("should update subject successfully", async () => {
      const mockResult = {
        success: true,
        data: {
          _id: "subject1",
          subject: "Updated Mathematics",
        },
      };

      mockSubjectManager.updateSubject.mockResolvedValue(mockResult);

      req.params.id = "subject1";
      req.body = { subject: "Updated Mathematics" };

      await subjectController.update(req, res);

      expect(mockSubjectManager.updateSubject).toHaveBeenCalledWith(
        "subject1",
        { subject: "Updated Mathematics" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should return 404 when subject not found", async () => {
      const mockResult = {
        success: false,
        message: "Subject not found",
      };

      mockSubjectManager.updateSubject.mockResolvedValue(mockResult);

      req.params.id = "nonexistent";
      req.body = { subject: "Updated" };

      await subjectController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Subject not found",
      });
    });

    it("should return 400 on error", async () => {
      const error = new Error("Database error");
      mockSubjectManager.updateSubject.mockRejectedValue(error);

      req.params.id = "subject1";
      req.body = { subject: "Updated" };

      await subjectController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
