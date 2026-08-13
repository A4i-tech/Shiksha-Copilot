const { buildCacheAdditions, UNSPECIFIED_OBJECTIVE } = require("../../../managers/cache.queue.manager");

describe("cache.queue.manager", () => {
  describe("createCacheQuestion objective fallback (via buildCacheAdditions)", () => {
    const buildArgs = (distributionObjective, questionObjective) => ({
      notFoundQuestions: [
        {
          type: "MCQ",
          marksPerQuestion: 1,
          questionDistribution: [
            {
              unitName: "Unit A",
              objective: distributionObjective,
            },
          ],
        },
      ],
      processedCache: [
        {
          unitName: "Unit A",
          questions: [],
        },
      ],
      unitLevel: "chapter",
      newResQuestions: [
        {
          questions: [
            {
              text: "Q1",
              objective: questionObjective,
            },
          ],
        },
      ],
    });

    it("uses the sentinel value, not the literal 'Knowledge', when no objective is available", () => {
      const result = buildCacheAdditions(buildArgs(undefined, undefined));
      const added = result[0].questionsToAdd[0];

      expect(added.objective).toBe(UNSPECIFIED_OBJECTIVE);
      expect(added.objective).not.toBe("Knowledge");
    });

    it("prefers the explicit distribution objective over the question objective field", () => {
      const result = buildCacheAdditions(buildArgs("Application", "Understanding"));
      const added = result[0].questionsToAdd[0];

      expect(added.objective).toBe("application");
    });

    it("prefers the question objective field over the sentinel when no explicit objective is given", () => {
      const result = buildCacheAdditions(buildArgs(undefined, "Skill"));
      const added = result[0].questionsToAdd[0];

      expect(added.objective).toBe("Skill");
    });
  });
});
