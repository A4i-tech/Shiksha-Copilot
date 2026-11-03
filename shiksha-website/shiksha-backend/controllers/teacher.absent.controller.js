const TeacherAbsent = require('../models/teacher.absent.model');
const TeacherTrainingBatch = require('../models/teacher.training.batch.model');
const { teacherScopeFilter, canAccessBatch } = require('../helper/training.scope.helper');

const teacherAbsentController = {
  getAllAbsentTeachers: async (req, res) => {
    try {
      const absentTeachers = await TeacherAbsent.find(await teacherScopeFilter(req.permissions, 'training.view'))
        .sort({ createdAt: -1 });
      res.json(absentTeachers);
    } catch (error) {
      console.error('Error fetching absent teachers:', error);
      res.status(500).json({ message: 'Error fetching absent teachers', error: error.message });
    }
  },

  getAbsentTeachersByBatch: async (req, res) => {
    try {
      const { batchId } = req.params;
      const batch = await TeacherTrainingBatch.findById(batchId);
      if (!batch || !await canAccessBatch(req.permissions, req.user._id, batch, 'training.view')) return res.status(404).json({ message: 'Batch not found. Pick a batch from your own schools.' });
      const absentTeachers = await TeacherAbsent.find({ batchId })
        .sort({ createdAt: -1 });
      res.json(absentTeachers);
    } catch (error) {
      console.error('Error fetching absent teachers for batch:', error);
      res.status(500).json({ message: 'Error fetching absent teachers for batch', error: error.message });
    }
  }
};

module.exports = teacherAbsentController; 