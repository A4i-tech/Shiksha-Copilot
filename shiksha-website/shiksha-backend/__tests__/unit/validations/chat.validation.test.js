const {
  validateChatStart,
  validateChatContinue,
  validateChatEnd,
} = require("../../../validations/chat.validation");

describe("Chat Validation", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("validateChatStart", () => {
    it("should pass validation with valid chat start data", () => {
      req.body = {
        user_info: {
          user_id: "user123",
          name: "Test User",
          email: "test@example.com",
        },
        user_message: "Hello, I need help",
        contextName: "general",
      };

      validateChatStart(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail when user_info is missing", () => {
      req.body = {
        user_message: "Hello",
        contextName: "general",
      };

      validateChatStart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("User info is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when user_id is missing", () => {
      req.body = {
        user_info: {
          name: "Test User",
          email: "test@example.com",
        },
        user_message: "Hello",
        contextName: "general",
      };

      validateChatStart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("User ID is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when name is missing", () => {
      req.body = {
        user_info: {
          user_id: "user123",
          email: "test@example.com",
        },
        user_message: "Hello",
        contextName: "general",
      };

      validateChatStart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("User name is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when email is missing", () => {
      req.body = {
        user_info: {
          user_id: "user123",
          name: "Test User",
        },
        user_message: "Hello",
        contextName: "general",
      };

      validateChatStart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("User email is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when email format is invalid", () => {
      req.body = {
        user_info: {
          user_id: "user123",
          name: "Test User",
          email: "invalid-email",
        },
        user_message: "Hello",
        contextName: "general",
      };

      validateChatStart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("Invalid email format"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when user_message is missing", () => {
      req.body = {
        user_info: {
          user_id: "user123",
          name: "Test User",
          email: "test@example.com",
        },
        contextName: "general",
      };

      validateChatStart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("User message is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when contextName is missing", () => {
      req.body = {
        user_info: {
          user_id: "user123",
          name: "Test User",
          email: "test@example.com",
        },
        user_message: "Hello",
      };

      validateChatStart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("Context name is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with multiple missing fields", () => {
      req.body = {};

      validateChatStart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("User info is required"),
          expect.stringContaining("User message is required"),
          expect.stringContaining("Context name is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateChatContinue", () => {
    it("should pass validation with valid chat continue data", () => {
      req.body = {
        chat_history_id: "chat123",
        user_message: "Can you help me more?",
        user_id: "user123",
      };

      validateChatContinue(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail when chat_history_id is missing", () => {
      req.body = {
        user_message: "Can you help me more?",
        user_id: "user123",
      };

      validateChatContinue(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("Chat history ID is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when user_message is missing", () => {
      req.body = {
        chat_history_id: "chat123",
        user_id: "user123",
      };

      validateChatContinue(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("User message is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when user_id is missing", () => {
      req.body = {
        chat_history_id: "chat123",
        user_message: "Can you help me more?",
      };

      validateChatContinue(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("User ID is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with multiple missing fields", () => {
      req.body = {};

      validateChatContinue(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("Chat history ID is required"),
          expect.stringContaining("User message is required"),
          expect.stringContaining("User ID is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when fields are not strings", () => {
      req.body = {
        chat_history_id: 123,
        user_message: 456,
        user_id: 789,
      };

      validateChatContinue(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateChatEnd", () => {
    it("should pass validation with valid chat end data", () => {
      req.body = {
        chat_history_id: "chat123",
      };

      validateChatEnd(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail when chat_history_id is missing", () => {
      req.body = {};

      validateChatEnd(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("Chat history ID is required"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when chat_history_id is not a string", () => {
      req.body = {
        chat_history_id: 123,
      };

      validateChatEnd(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when chat_history_id is empty string", () => {
      req.body = {
        chat_history_id: "",
      };

      validateChatEnd(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
