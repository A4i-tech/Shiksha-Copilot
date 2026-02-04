const {
  createData,
  subjectRegex,
  standardRegex,
  titleRegex,
  orderNumberRegex,
  boardRegex,
  mediumRegex,
  semRegex,
  nameRegex,
  capitalizeFirstLetter,
  getTemplateWorkflowId,
} = require("../../../helper/data.helper");

describe("data.helper", () => {
  const chapter = {
    board: "KSEAB",
    standard: "5",
    topics: "Geometry",
    medium: "EN",
    _id: "ch1",
  };
  const subject = { subjectName: "Math" };
  const subTopics = ["Angles", "Lines"];

  it("builds lesson data when isLesson is true", () => {
    const result = createData(true, chapter, subTopics, subject, true);

    expect(result.name).toBe("Math-KSEAB Class5 Geometry");
    expect(result.class).toBe("5");
    expect(result.subTopics).toEqual(subTopics);
    expect(result.instructionSet.length).toBeGreaterThan(0);
    expect(result.isAll).toBe(true);
    expect(result.lessonName).toBeUndefined();
  });

  it("builds non-lesson data with defaults when subject is missing", () => {
    const result = createData(false, chapter, subTopics, null, false);

    expect(result.lessonName).toBe("undefined-KSEAB Class5 Geometry");
    expect(result.levels).toEqual(["beginner"]);
    expect(result.subTopics).toEqual(subTopics);
    expect(result.resources.length).toBeGreaterThan(0);
    expect(result.subject).toBe("Delete");
  });

  it("matches helper regex utilities", () => {
    const sample =
      "Subject=Math,Grade=5,Title=My Awesome Title,Number=2,Board=KSEAB,Medium=EN";
    expect(subjectRegex.exec(sample)[1]).toBe("Math");
    expect(standardRegex.exec(sample)[1]).toBe("5");
    expect(titleRegex.exec(sample)[1]).toBe(
      "My Awesome Title,Number=2,Board=KSEAB,Medium=EN"
    );
    expect(orderNumberRegex.exec(sample)[1]).toBe("2");
    expect(boardRegex.exec(sample)[1]).toBe("KSEAB");
    expect(mediumRegex.exec(sample)[1]).toBe("EN");

    const semSample = "Subject=english_1/path";
    const semMatch = semRegex.exec(semSample);
    expect(semMatch[0]).toBe("Subject=english_1");
    const nameMatch = nameRegex.exec(semSample);
    expect(nameMatch[1]).toBe("english");
  });

  it("computes template workflow ids for subjects", () => {
    expect(getTemplateWorkflowId("science_1", "CHAPTER")).toBe(
      "karnataka-science-math-chapter-lesson-plan"
    );
    expect(getTemplateWorkflowId("science_2", "SUBTOPIC")).toBe(
      "karnataka-science-math-subtopic-lesson-plan"
    );
    expect(getTemplateWorkflowId("social_science_1", "CHAPTER")).toBe(
      "karnataka-social-chapter-lesson-plan"
    );
    expect(getTemplateWorkflowId("social_science_2", "SUBTOPIC")).toBe(
      "karnataka-social-subtopic-lesson-plan"
    );
    expect(getTemplateWorkflowId("english_1", "PROSE")).toBe(
      "english-prose-lesson-plan"
    );
    expect(getTemplateWorkflowId("english_2", "POEM")).toBe(
      "karnataka-english-poem-lesson-plan"
    );
  });

  it("capitalizes first letter", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });
});
