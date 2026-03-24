const Chapter = require("../models/chapter.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/**
 * Build a $addFields stage that resolves i18n Map fields to a single language.
 * For each field, picks `$field.<lang>` with fallback to `$field.en`.
 */
function buildI18nResolveStage(lang) {
  if (!lang || lang === "en") {
    return {
      $addFields: {
        topics: { $ifNull: ["$topics.en", "$topics"] },
        subTopics: { $ifNull: ["$subTopics.en", "$subTopics"] },
        learningOutcomes: { $ifNull: ["$learningOutcomes.en", "$learningOutcomes"] },
        topicsLearningOutcomes: {
          $map: {
            input: { $ifNull: ["$topicsLearningOutcomes", []] },
            as: "tlo",
            in: {
              _id: "$$tlo._id",
              title: { $ifNull: ["$$tlo.title.en", "$$tlo.title"] },
              learningOutcomes: { $ifNull: ["$$tlo.learningOutcomes.en", "$$tlo.learningOutcomes"] },
            },
          },
        },
      },
    };
  }

  return {
    $addFields: {
      topics: {
        $ifNull: [`$topics.${lang}`, { $ifNull: ["$topics.en", "$topics"] }],
      },
      subTopics: {
        $ifNull: [`$subTopics.${lang}`, { $ifNull: ["$subTopics.en", "$subTopics"] }],
      },
      learningOutcomes: {
        $ifNull: [`$learningOutcomes.${lang}`, { $ifNull: ["$learningOutcomes.en", "$learningOutcomes"] }],
      },
      topicsLearningOutcomes: {
        $map: {
          input: { $ifNull: ["$topicsLearningOutcomes", []] },
          as: "tlo",
          in: {
            _id: "$$tlo._id",
            title: {
              $ifNull: [`$$tlo.title.${lang}`, { $ifNull: ["$$tlo.title.en", "$$tlo.title"] }],
            },
            learningOutcomes: {
              $ifNull: [`$$tlo.learningOutcomes.${lang}`, { $ifNull: ["$$tlo.learningOutcomes.en", "$$tlo.learningOutcomes"] }],
            },
          },
        },
      },
    },
  };
}

class ChapterAggregation {
  async getChapterFilter(page, limit, filter, sort, lang) {
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
        buildI18nResolveStage(lang),
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

  async getChapterBySemester(filter, lang) {
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
        buildI18nResolveStage(lang),
      ];

      let chapters = await Chapter.aggregate(pipeline);

      if (chapters) return chapters;

      return [];
    } catch (err) {
      console.log("Error --> ChapterAggregation --> getChapterBySemester");
      throw err;
    }
  }

  // AI-facing: always resolves to English
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
            title: { $ifNull: ["$topics.en", "$topics"] },
            index_path: "$indexPath",
            learning_outcomes: { $ifNull: ["$learningOutcomes.en", "$learningOutcomes"] },
            _id: 0,
            subtopics: {
              $map: {
                input: {
                  $filter: {
                    input: { $ifNull: ["$topicsLearningOutcomes", []] },
                    as: "item",
                    cond: {
                      $in: [
                        { $ifNull: ["$$item.title.en", "$$item.title"] },
                        Array.isArray(subTopics) ? subTopics : [],
                      ],
                    },
                  },
                },
                as: "filteredItem",
                in: {
                  title: { $ifNull: ["$$filteredItem.title.en", "$$filteredItem.title"] },
                  learning_outcomes: { $ifNull: ["$$filteredItem.learningOutcomes.en", "$$filteredItem.learningOutcomes"] },
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

  // AI-facing: always resolves to English
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
                if: {
                  $eq: [
                    { $size: { $ifNull: ["$learningOutcomes.en", { $ifNull: ["$learningOutcomes", []] }] } },
                    0,
                  ],
                },
                then: {
                  $reduce: {
                    input: { $ifNull: ["$topicsLearningOutcomes", []] },
                    initialValue: [],
                    in: {
                      $concatArrays: [
                        "$$value",
                        { $ifNull: ["$$this.learningOutcomes.en", { $ifNull: ["$$this.learningOutcomes", []] }] },
                      ],
                    },
                  },
                },
                else: { $ifNull: ["$learningOutcomes.en", "$learningOutcomes"] },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            title: { $ifNull: ["$topics.en", "$topics"] },
            index_path: "$indexPath",
            learning_outcomes: 1,
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
