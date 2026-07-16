const User = require("../models/user.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
class UserAggregation {
  async getUserList(page, limit, processedFilters, sort) {
    try {
      // Extract trainingStatus filter and remove it from processedFilters
      const { trainingStatus, ...otherFilters } = processedFilters;
      const trainingStages = [
        {
          $lookup: {
            from: "teachertrainingbatches",
            localField: "_id",
            foreignField: "attendance",
            pipeline: [
              { $match: { isSubmitted: true } },
              { $limit: 1 }
            ],
            as: "trainingAttendance"
          }
        },
        {
          $addFields: {
            trainingStatus: {
              $cond: {
                if: { $gt: [{ $size: "$trainingAttendance" }, 0] },
                then: "trained",
                else: "untrained"
              }
            }
          }
        }
      ];
      const remainingTrainingStages = trainingStatus ? [] : trainingStages;
      const paginationStages = [
        { $sort: Object.keys(sort).length > 0 ? sort : { _id: 1 } },
        ...(limit > 0 ? [{ $skip: (page - 1) * limit }, { $limit: limit }] : []),
      ];
      const projectStage = { $project: { otp: 0, loginAttempts: 0, recovery: 0, trainingAttendance: 0 } };
      const pipeline = [
        {
          $lookup: {
            from: "schools",
            localField: "school",
            foreignField: "_id",
            as: "school",
          },
        },
        { $unwind: { path: "$school", preserveNullAndEmptyArrays: true } },
        { $match: otherFilters },
        ...(trainingStatus ? [...trainingStages, { $match: { trainingStatus } }] : []),
      ];

      if (!limit) {
        pipeline.push(...remainingTrainingStages, projectStage, ...paginationStages);
      } else if (sort.trainingStatus) {
        pipeline.push(...remainingTrainingStages, projectStage, {
          $facet: { data: paginationStages, totalCount: [{ $count: "count" }] }
        });
      } else {
        pipeline.push({
          $facet: {
            data: [...paginationStages, ...remainingTrainingStages, projectStage],
            totalCount: [{ $count: "count" }],
          }
        });
      }

      let users = await User.aggregate(pipeline);

      return limit ? users : [{ data: users, totalCount: [{ count: users.length }] }];
    } catch (err) {
      console.log("Error --> UserAggregation, getUserList", err);
      throw err;
    }
  }

  async getClasswithGroupedSubjects(id) {
    try {
      let pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $unwind: {
            path: "$classes"
          },
        },
        {
          $group: {
            _id: {
              name: "$classes.name",
              board: "$classes.board",
              class: "$classes.class",
              medium: "$classes.medium",
            },
            subjects: {
              $push: {
                subjectName: "$classes.subject",
                sem: "$classes.sem",
              },
            },
          },
        },
        {
          $project: {
            name: "$_id.name",
            board: "$_id.board",
            class: "$_id.class",
            medium: "$_id.medium",
            subjects: 1,
            _id: 0,
          },
        },
      ];
      let groupedClasseswithSubjects = await User.aggregate(pipeline);
      return groupedClasseswithSubjects;
    } catch (err) {
      console.log("Error --> UserAggregation, getGroupedSubjects", err);
      throw err;
    }
  }
}

const userAggregation = new UserAggregation();

module.exports = userAggregation;
