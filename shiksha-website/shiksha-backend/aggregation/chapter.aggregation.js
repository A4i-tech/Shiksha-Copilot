const Chapter = require("../models/chapter.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class ChapterAggregation {
  async getChapterFilter(page, limit, filter, sort) {
    try {
      let pipeline = [
        {
          $lookup: {
            from: "mastersubjects",
            localField: "subjectId",
            foreignField: "_id",
            as: "subject",
          },
        },
        { $match: { ...filter, isDeleted: false } },
        {
          $facet: {
            data: [
              { $sort: sort },
              { $skip: (page - 1) * limit },
              { $limit: limit },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      let chapters = await Chapter.aggregate(pipeline);

      if (chapters) return chapters;

      return [];
    } catch (err) {
      console.log("Error --> ChapterAggregation --> getChapterFilter");
      throw err;
    }
  }

  async getChapterBySemester(filter) {
    try {
      let pipeline = [
        {
          $lookup: {
            from: "mastersubjects",
            localField: "subjectId",
            foreignField: "_id",
            as: "subject",
          },
        },
        { $match: filter },
      ];

      let chapters = await Chapter.aggregate(pipeline);

      if (chapters) return chapters;

      return [];
    } catch (err) {
      console.log("Error --> ChapterAggregation --> getChapterBySemester");
      throw err;
    }
  }

  async getChapterByIdAndSubtopicFilter(chapterId, subTopics) {
    try {
      if (!Array.isArray(chapterId)) {
        console.warn(
          `[ChapterAggregation] getChapterByIdAndSubtopicFilter expects an array. Received: ${typeof chapterId}`
        );
        return [];
      }

      const idToUse = chapterId[0];

      if (!idToUse || !mongoose.Types.ObjectId.isValid(idToUse)) {
        console.warn(
          `[ChapterAggregation] Invalid Chapter ID passed: ${idToUse}. Returning empty array.`
        );
        return [];
      }

      const pipeline = [
        {
          $match: {
            _id: new ObjectId(idToUse),
          },
        },
        {
          $project: {
            title: "$topics",
            index_path: "$indexPath",
            learning_outcomes: "$learningOutcomes",
            is_grammar: "$isGrammar",
            grammar_source_chapters: "$grammarSourceChapters",
            grammar_topics: "$grammarTopics",
            _id: 0,
            subtopics: {
              $map: {
                input: {
                  $filter: {
                    input: { $ifNull: ["$topicsLearningOutcomes", []] },
                    as: "item",
                    cond: {
                      $in: [
                        "$$item.title",
                        Array.isArray(subTopics) ? subTopics : [],
                      ],
                    },
                  },
                },
                as: "filteredItem",
                in: {
                  title: "$$filteredItem.title",
                  learning_outcomes: "$$filteredItem.learningOutcomes",
                },
              },
            },
          },
        },
      ];
      let chapterData = await Chapter.aggregate(pipeline);

      if (chapterData) return chapterData;

      return [];
    } catch (err) {
      console.log(
        "Error --> ChapterAggregation --> getChapterByIdAndSubtopicFilter",
        err
      );
      throw err;
    }
  }

  async getChapterByIdsAndFilterObject(chapterIds) {
    try {
      const validIds = (chapterIds || [])
        .filter((id) => id && mongoose.Types.ObjectId.isValid(id))
        .map((id) => new ObjectId(id));

      if (validIds.length === 0) {
        console.warn(
          "[ChapterAggregation] No valid ObjectId found in chapterIds array."
        );
        return [];
      }

      const pipeline = [
        {
          $match: {
            _id: {
              $in: validIds,
            },
          },
        },
        {
          $addFields: {
            learning_outcomes: {
              $cond: {
                if: { $eq: [{ $size: "$learningOutcomes" }, 0] },
                then: {
                  $reduce: {
                    input: "$topicsLearningOutcomes",
                    initialValue: [],
                    in: {
                      $concatArrays: ["$$value", "$$this.learningOutcomes"],
                    },
                  },
                },
                else: "$learningOutcomes",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            title: "$topics",
            index_path: "$indexPath",
            learning_outcomes: 1,
            is_grammar: "$isGrammar",
            grammar_source_chapters: "$grammarSourceChapters",
            grammar_topics: "$grammarTopics",
          },
        },
      ];

      let chapterData = await Chapter.aggregate(pipeline);

      if (chapterData) return chapterData;

      return [];
    } catch (err) {
      console.log(
        "Error --> ChapterAggregation --> getChapterByIdsAndFilterObject"
      );
      throw err;
    }
  }
}

const chapterAggregation = new ChapterAggregation();

module.exports = chapterAggregation;