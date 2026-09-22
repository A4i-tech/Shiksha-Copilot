const formatter = require("../../../helper/formatter");
const mongoose = require("mongoose");

describe("Formatter Helper", () => {
  describe("capitalizeFirstLetter", () => {
    it("should capitalize first letter of string", () => {
      // Test via restructureInstructionSet which uses it
      const data = {
        introduction: { content: "Test content" },
        activities: { content: "Activity content" }
      };
      const result = formatter.restructureInstructionSet(data);
      expect(result[0].type).toBe("Introduction");
      expect(result[1].type).toBe("Activities");
    });
  });

  describe("restructureInstructionSet", () => {
    it("should restructure instruction set with correct format", () => {
      const data = {
        introduction: { content: "Intro content" },
        methodology: { content: "Method content" }
      };

      const result = formatter.restructureInstructionSet(data);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: "Introduction",
        info: [{
          methodOfTeaching: "Concept Attainment Model",
          content: { main: "Intro content" }
        }]
      });
      expect(result[1]).toEqual({
        type: "Methodology",
        info: [{
          methodOfTeaching: "Concept Attainment Model",
          content: { main: "Method content" }
        }]
      });
    });

    it("should handle empty object", () => {
      const result = formatter.restructureInstructionSet({});
      expect(result).toEqual([]);
    });
  });

  describe("restructureCheckList", () => {
    it("should restructure checklist correctly", () => {
      const data = {
        engage: { activity: "Activity 1", materials: "Materials 1" },
        explore: { activity: "Activity 2", materials: "Materials 2" },
        explain: { activity: "Activity 3", materials: "Materials 3" }
      };

      const result = formatter.restructureCheckList(data);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        type: "engage",
        activity: "Activity 1",
        materials: "Materials 1"
      });
      expect(result[1].type).toBe("explore");
      expect(result[2].type).toBe("explain");
    });

    it("should handle empty checklist", () => {
      const result = formatter.restructureCheckList({});
      expect(result).toEqual([]);
    });
  });

  describe("restructureCheckListforLLM", () => {
    it("should convert checklist array back to object", () => {
      const data = [
        { type: "engage", activity: "Activity 1", materials: "Materials 1" },
        { type: "explore", activity: "Activity 2", materials: "Materials 2" }
      ];

      const result = formatter.restructureCheckListforLLM(data);

      expect(result).toEqual({
        engage: { activity: "Activity 1", materials: "Materials 1" },
        explore: { activity: "Activity 2", materials: "Materials 2" }
      });
    });

    it("should handle empty array", () => {
      const result = formatter.restructureCheckListforLLM([]);
      expect(result).toEqual({});
    });
  });

  describe("sortDataBySubTopics", () => {
    it("should sort subtopics with isAll first", () => {
      const data = [
        { _id: "2", subTopics: ["2.1 Second"], isAll: false },
        { _id: "1", subTopics: ["1.1 First"], isAll: false },
        { _id: "all", subTopics: ["All topics"], isAll: true }
      ];

      const result = formatter.sortDataBySubTopics(data);

      expect(result[0]._id).toBe("all");
      expect(result[1]._id).toBe("1");
      expect(result[2]._id).toBe("2");
    });

    it("should sort numeric subtopics correctly", () => {
      const data = [
        { _id: "3", subTopics: ["10.1 Tenth"], isAll: false },
        { _id: "2", subTopics: ["2.1 Second"], isAll: false },
        { _id: "1", subTopics: ["1.5 First"], isAll: false }
      ];

      const result = formatter.sortDataBySubTopics(data);

      expect(result[0].subTopics[0]).toContain("1.5");
      expect(result[1].subTopics[0]).toContain("2.1");
      expect(result[2].subTopics[0]).toContain("10.1");
    });

    it("should handle data without isAll", () => {
      const data = [
        { _id: "2", subTopics: ["2.1 Second"], isAll: false },
        { _id: "1", subTopics: ["1.1 First"], isAll: false }
      ];

      const result = formatter.sortDataBySubTopics(data);

      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe("1");
    });
  });

  describe("sortSubTopicsArrayTeacher", () => {
    it("should prioritize lessons with isAll=true", () => {
      const data = [
        { subtopic: ["2.1 Second"], lessons: [{ isAll: false }] },
        { subtopic: ["1.1 First"], lessons: [{ isAll: true }] },
        { subtopic: ["3.1 Third"], lessons: [{ isAll: false }] }
      ];

      const result = formatter.sortSubTopicsArrayTeacher(data);

      expect(result[0].subtopic[0]).toContain("1.1");
      expect(result[1].subtopic[0]).toContain("2.1");
      expect(result[2].subtopic[0]).toContain("3.1");
    });

    it("should sort numerically when no isAll lessons", () => {
      const data = [
        { subtopic: ["10.1 Tenth"], lessons: [{ isAll: false }] },
        { subtopic: ["2.1 Second"], lessons: [{ isAll: false }] },
        { subtopic: ["1.5 First"], lessons: [{ isAll: false }] }
      ];

      const result = formatter.sortSubTopicsArrayTeacher(data);

      expect(result[0].subtopic[0]).toContain("1.5");
      expect(result[1].subtopic[0]).toContain("2.1");
      expect(result[2].subtopic[0]).toContain("10.1");
    });

    it("should remove isAnyLessonAll property from results", () => {
      const data = [
        { subtopic: ["1.1 First"], lessons: [{ isAll: true }] }
      ];

      const result = formatter.sortSubTopicsArrayTeacher(data);

      expect(result[0].isAnyLessonAll).toBeUndefined();
    });
  });

  describe("formatSubject", () => {
    it("should format subject name correctly", () => {
      const result = formatter.formatSubject("mathematics_1_2");
      expect(result).toBe("Mathematics");
    });

    it("should remove semester suffix", () => {
      const result = formatter.formatSubject("english_language_3");
      expect(result).toBe("English Language");
    });

    it("should capitalize words", () => {
      const result = formatter.formatSubject("social_studies");
      expect(result).toBe("Social Studies");
    });

    it("should handle single word subjects", () => {
      const result = formatter.formatSubject("science");
      expect(result).toBe("Science");
    });
  });

  describe("getSemester", () => {
    it("should extract semester from subject name", () => {
      const result = formatter.getSemester("mathematics_1");
      expect(result).toBe("1");
    });

    it("should return 0 when no semester found", () => {
      const result = formatter.getSemester("mathematics");
      expect(result).toBe(0);
    });

    it("should extract correct semester number", () => {
      const result = formatter.getSemester("english_2");
      expect(result).toBe("2");
    });
  });

  describe("convertToCamelCase", () => {
    it("should convert object keys to camelCase", () => {
      const data = {
        first_name: "John",
        last_name: "Doe",
        user_age: 30
      };

      const result = formatter.convertToCamelCase(data);

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        userAge: 30
      });
    });

    it("should handle nested objects", () => {
      const data = {
        user_info: {
          first_name: "John",
          contact_details: {
            phone_number: "123456"
          }
        }
      };

      const result = formatter.convertToCamelCase(data);

      expect(result.userInfo.firstName).toBe("John");
      expect(result.userInfo.contactDetails.phoneNumber).toBe("123456");
    });

    it("should handle arrays", () => {
      const data = [
        { first_name: "John" },
        { first_name: "Jane" }
      ];

      const result = formatter.convertToCamelCase(data);

      expect(result[0].firstName).toBe("John");
      expect(result[1].firstName).toBe("Jane");
    });

    it("should preserve _id field", () => {
      const data = {
        _id: "12345",
        user_name: "test"
      };

      const result = formatter.convertToCamelCase(data);

      expect(result._id).toBe("12345");
      expect(result.userName).toBe("test");
    });

    it("should convert ObjectId to string", () => {
      const objectId = new mongoose.Types.ObjectId();
      const data = {
        _id: objectId,
        user_name: "test"
      };

      const result = formatter.convertToCamelCase(data);

      expect(typeof result._id).toBe("string");
      expect(result._id).toBe(objectId.toHexString());
    });

    it("should handle null and primitive values", () => {
      expect(formatter.convertToCamelCase(null)).toBeNull();
      expect(formatter.convertToCamelCase("string")).toBe("string");
      expect(formatter.convertToCamelCase(123)).toBe(123);
      expect(formatter.convertToCamelCase(true)).toBe(true);
    });
  });

  describe("formatSections", () => {
    it("should format sections with template matching", () => {
      const sections = [
        { section_id: "sec1", section_title: "Introduction", content: "Content 1" },
        { section_id: "sec2", section_title: "Activities", content: "Content 2" }
      ];
      const templateSections = [
        { id: "sec1", outputFormat: "plain_text" },
        { id: "sec2", outputFormat: "json_3" }
      ];

      const result = formatter.formatSections(sections, templateSections);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "sec1",
        title: "Introduction",
        content: "Content 1",
        outputFormat: "plain_text"
      });
      expect(result[1].outputFormat).toBe("json_3");
    });

    it("should handle sections without template match", () => {
      const sections = [
        { section_id: "sec1", section_title: "Introduction", content: "Content 1" }
      ];
      const templateSections = [];

      const result = formatter.formatSections(sections, templateSections);

      expect(result[0].outputFormat).toBeNull();
    });
  });

  describe("transformSections", () => {
    it("should transform question bank sections (json_1)", () => {
      const sections = [{
        section_id: "qb",
        section_title: "Question Bank",
        content: {
          beginner: {
            MCQs: { content: [{ question: "Q1", options: ["A", "B", "C", "D"] }] },
            assessment: { content: [{ question: "Q2" }] }
          }
        }
      }];
      const templateSections = [
        { id: "qb", outputFormat: "json_1" }
      ];

      const result = formatter.transformSections(sections, templateSections);

      expect(result[0].outputFormat).toBe("json_1");
      expect(result[0].content[0].difficulty).toBe("beginner");
      expect(result[0].content[0].content).toHaveLength(2);
    });

    it("should transform real world scenarios (json_2)", () => {
      const sections = [{
        section_id: "rws",
        section_title: "Scenarios",
        content: {
          intermediate: {
            topic_1: {
              title: "Scenario 1",
              scenario: { question: "Q1", description: "Desc1" }
            }
          }
        }
      }];
      const templateSections = [
        { id: "rws", outputFormat: "json_2" }
      ];

      const result = formatter.transformSections(sections, templateSections);

      expect(result[0].content[0].difficulty).toBe("intermediate");
      expect(result[0].content[0].content[0].title).toBe("Scenario 1");
    });

    it("should transform activities (json_3)", () => {
      const sections = [{
        section_id: "act",
        section_title: "Activities",
        content: {
          activity_1: {
            title: "Activity 1",
            preparation: "Prep",
            required_materials: "Materials",
            obtaining_materials: "How to obtain",
            recap: "Recap"
          }
        }
      }];
      const templateSections = [
        { id: "act", outputFormat: "json_3" }
      ];

      const result = formatter.transformSections(sections, templateSections);

      expect(result[0].content[0].id).toBe("activity_1");
      expect(result[0].content[0].title).toBe("Activity 1");
    });
  });

  describe("formatTemplate", () => {
    it("should format template with sections", () => {
      const template = {
        workFlowId: "wf123",
        name: "Template 1",
        description: "Description",
        sections: [
          {
            id: "sec1",
            title: "Section 1",
            description: "Sec desc",
            dependencies: [],
            mode: "auto",
            outputFormat: "plain_text"
          }
        ]
      };

      const result = formatter.formatTemplate(template);

      expect(result._id).toBe("wf123");
      expect(result.name).toBe("Template 1");
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].id).toBe("sec1");
    });
  });
});
