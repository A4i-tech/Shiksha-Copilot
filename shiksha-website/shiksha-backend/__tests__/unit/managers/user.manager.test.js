const UserManager = require("../../../managers/user.manager");

const assignment = (changes = {}) => ({ board: "board", medium: "English", class: 5, name: "Math", subject: "Mathematics", sem: 1, ...changes });
const curriculum = () => [{
  _id: "board",
  medium: [{ medium: "English", isDeleted: false, classDetails: [{ standard: 5 }, { standard: 6 }] }],
  subjects: [{ _id: "Math", subjects: [{ subjectName: "Mathematics", sem: 1, isDeleted: false, applicableClasses: [5] }] }],
}, {
  _id: "other",
  medium: [{ medium: "English", isDeleted: false, classDetails: [{ standard: 5 }] }],
  subjects: [],
}];

describe("UserManager.validateTeacherClassAssignments", () => {
  let manager;
  let getCurriculum;

  beforeEach(() => {
    manager = new UserManager();
    getCurriculum = jest.fn().mockResolvedValue(curriculum());
    manager.classDao = { getGroupClassesByBoard: getCurriculum };
  });

  test.each([undefined, []])("skips empty classes %#", async (classes) => {
    await manager.validateTeacherClassAssignments(classes, "school");
    expect(getCurriculum).not.toHaveBeenCalled();
  });

  it("accepts a valid assignment", async () => {
    await expect(manager.validateTeacherClassAssignments([assignment()], "school")).resolves.toBeUndefined();
    expect(getCurriculum).toHaveBeenCalledWith("school");
  });

  test.each([
    ["subject from another board", { board: "other" }],
    ["medium mismatch", { medium: "Kannada" }],
    ["missing standard", { class: 7 }],
    ["restricted class", { class: 6 }],
    ["semester mismatch", { sem: 2 }],
  ])("rejects %s", async (_, changes) => {
    await expect(manager.validateTeacherClassAssignments([assignment(changes)], "school")).rejects.toMatchObject({ name: "AppError", statusCode: 400 });
  });

  it("rejects a deleted medium", async () => {
    const data = curriculum();
    data[0].medium[0].isDeleted = true;
    getCurriculum.mockResolvedValue(data);
    await expect(manager.validateTeacherClassAssignments([assignment()], "school")).rejects.toMatchObject({ name: "AppError", statusCode: 400 });
  });

  it("accepts a subject with no class restriction", async () => {
    const data = curriculum();
    data[0].subjects[0].subjects[0].applicableClasses = [];
    getCurriculum.mockResolvedValue(data);
    await expect(manager.validateTeacherClassAssignments([assignment({ class: 6 })], "school")).resolves.toBeUndefined();
  });
});
