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
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$isSubmitted", true] },
                      { $in: ["$$userId", "$attendance"] }
                    ]
                  }
                }
              },
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
      const projectStage = {
        $project: {
          identity: 1,
          roles: {
            $map: {
              input: "$roles",
              as: "role",
              in: { _id: "$$role._id", name: "$$role.name" },
            },
          },
          profiles: 1,
          profileImage: 1,
          profileImageExpiresIn: 1,
          isDeleted: 1,
          isLoginAllowed: 1,
          createdAt: 1,
          updatedAt: 1,
          trainingStatus: 1,
        },
      };
      const pipeline = [
        { $match: otherFilters },
        {
          $lookup: {
            from: "schools",
            localField: "profiles.teacher.school",
            foreignField: "_id",
            as: "profiles.teacher.school",
          },
        },
        { $unwind: { path: "$profiles.teacher.school", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "roles",
            localField: "roles",
            foreignField: "_id",
            as: "roles",
          },
        },
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
            path: "$profiles.teacher.classes"
          },
        },
        {
          $group: {
            _id: {
              name: "$profiles.teacher.classes.name",
              board: "$profiles.teacher.classes.board",
              class: "$profiles.teacher.classes.class",
              medium: "$profiles.teacher.classes.medium",
            },
            subjects: {
              $push: {
                subjectName: "$profiles.teacher.classes.subject",
                sem: "$profiles.teacher.classes.sem",
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
