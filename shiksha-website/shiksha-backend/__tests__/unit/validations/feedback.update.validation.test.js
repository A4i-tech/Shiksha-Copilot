const { validateFeedbackLessonUpdate } = require("../../../validations/feedback.lesson.validation");
const { validateTeacherResourceFeedbackUpdate } = require("../../../validations/teacher.feedback.validation");

const run = (validator, body) => {
  const req = { body };
  const next = jest.fn();
  validator(req, { status: () => ({ json: jest.fn() }) }, next);
  return { req, next };
};

describe("feedback update validators", () => {
  it("strip teacherId, lessonId and unknown keys from a lesson feedback update", () => {
    const { req, next } = run(validateFeedbackLessonUpdate, { teacherId: "t9", lessonId: "l9", _id: "x", feedback: "x", isCompleted: true });
    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ feedback: "x", isCompleted: true });
  });

  it("strip teacherId, resourceId, instructionSet and unknown keys from a resource feedback update", () => {
    const { req, next } = run(validateTeacherResourceFeedbackUpdate, { teacherId: "t9", resourceId: "r9", instructionSet: "i", createdAt: 1, feedback: "x", isCompleted: false });
    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ feedback: "x", isCompleted: false });
  });
});
