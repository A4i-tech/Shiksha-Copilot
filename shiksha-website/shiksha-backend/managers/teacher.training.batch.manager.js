const BaseManager = require('./base.manager');
const TeacherTrainingBatchDao = require('../dao/teacher.training.batch.dao');
const User = require('../models/user.model');
const TeacherTrainingBatch = require('../models/teacher.training.batch.model');
const formatApiReponse = require('../helper/response');
const fs = require('fs').promises;
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
// const ejs = require('ejs');
const path = require('path');
const { resolvePermissions } = require('../helper/permission.helper');

/** @extends {BaseManager<TeacherTrainingBatchDao>} */
class TeacherTrainingBatchManager extends BaseManager {
  constructor() {
    super(new TeacherTrainingBatchDao());
  }

  // Example: getBatches logic
  async getBatches(user) {
    try {
      let query = {};
      const permissions = resolvePermissions(user.roles);
      if (permissions.includes('scope.regional') && !permissions.includes('scope.global')) query.createdBy = user._id;
      const batches = await TeacherTrainingBatch.find(query).populate([
        { path: 'assignedTeachers', select: 'identity profiles.teacher' },
        { path: 'createdBy', select: 'identity' },
      ]);
      return formatApiReponse(true, '', batches);
    } catch (err) {
      return formatApiReponse(false, err.message, null);
    }
  }

  // Add other business logic methods here, moving from the old controller
}

module.exports = TeacherTrainingBatchManager;
