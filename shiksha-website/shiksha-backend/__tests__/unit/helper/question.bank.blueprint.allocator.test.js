const {
  allocateQuestionBankBlueprint,
} = require("../../../helper/question.bank.blueprint.allocator");

const sampleContext = {
  board: "KSEEB",
  medium: "English",
  grade: 6,
  subject: "Social Science",
  totalMarks: 25,
  marksDistribution: [
    { unitName: "Introduction to History and Early society", percentageDistribution: 20, marks: 5 },
    { unitName: "India - Our Pride", percentageDistribution: 8, marks: 2 },
    { unitName: "Our Pride Our State - Karnataka", percentageDistribution: 8, marks: 2 },
    { unitName: "The Culture of The Vedic Period", percentageDistribution: 8, marks: 2 },
    { unitName: "Rise of New Religions", percentageDistribution: 8, marks: 2 },
    { unitName: "Ancient Dynasties of South India", percentageDistribution: 8, marks: 2 },
    { unitName: "Citizen and Citizenship", percentageDistribution: 8, marks: 2 },
    { unitName: "Our Constitution", percentageDistribution: 8, marks: 2 },
    { unitName: "Types of Government", percentageDistribution: 8, marks: 2 },
    { unitName: "Globe and Maps", percentageDistribution: 8, marks: 2 },
    { unitName: "Major Landforms", percentageDistribution: 8, marks: 2 },
  ],
  objectiveDistribution: [
    { objective: "Knowledge", percentageDistribution: 25 },
    { objective: "Understanding", percentageDistribution: 45 },
    { objective: "Application", percentageDistribution: 20 },
    { objective: "Skill", percentageDistribution: 10 },
  ],
};

const countBy = (items, key) => items.reduce((acc, item) => {
  acc[item[key]] = (acc[item[key]] || 0) + 1;
  return acc;
}, {});

describe("question bank blueprint allocator", () => {
  it("allocates the 25-mark KSEEB sample by unit counts", () => {
    const [template] = allocateQuestionBankBlueprint([
      { type: "MCQ", marksPerQuestion: 1, questionDistribution: [] },
    ], sampleContext);

    expect(template.numberOfQuestions).toBe(25);
    expect(template.questionDistribution).toHaveLength(25);

    const unitCounts = countBy(template.questionDistribution, "unitName");
    expect(unitCounts["Introduction to History and Early society"]).toBe(5);
    sampleContext.marksDistribution.slice(1).forEach(unit => {
      expect(unitCounts[unit.unitName]).toBe(2);
    });
  });

  it("allocates 26-slot templates when ceil(totalMarks / marksPerQuestion) requires it", () => {
    const [template] = allocateQuestionBankBlueprint([
      { type: "ANSWER_MEDIUM", marksPerQuestion: 2, questionDistribution: [] },
    ], sampleContext);

    expect(template.numberOfQuestions).toBe(13);
    expect(template.questionDistribution).toHaveLength(13);
  });

  it("deterministically allocates only five long-answer slots across the sample chapters", () => {
    const [first] = allocateQuestionBankBlueprint([
      { type: "ANSWER_LONG", marksPerQuestion: 5, questionDistribution: [] },
    ], sampleContext);
    const [second] = allocateQuestionBankBlueprint([
      { type: "ANSWER_LONG", marksPerQuestion: 5, questionDistribution: [] },
    ], sampleContext);

    expect(first.questionDistribution).toEqual(second.questionDistribution);
    expect(first.questionDistribution).toHaveLength(5);
    expect(new Set(first.questionDistribution.map(item => item.unitName)).size).toBe(5);
  });

  it("allocates objectives from objectiveDistribution", () => {
    const [template] = allocateQuestionBankBlueprint([
      { type: "MCQ", marksPerQuestion: 1, questionDistribution: [] },
    ], sampleContext);

    expect(countBy(template.questionDistribution, "objective")).toEqual({
      Knowledge: 6,
      Understanding: 11,
      Application: 5,
      Skill: 3,
    });
  });

  it("preserves existing complete distributions", () => {
    const questionDistribution = [
      { unitName: "Manual Unit", objective: "Manual Objective" },
      { unitName: "Manual Unit", objective: "Manual Objective" },
    ];
    const [template] = allocateQuestionBankBlueprint([
      { type: "ANSWER_LONG", numberOfQuestions: 2, marksPerQuestion: 5, questionDistribution },
    ], sampleContext);

    expect(template.questionDistribution).toEqual(questionDistribution);
  });
});
