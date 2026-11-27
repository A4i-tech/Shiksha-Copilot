const teacherAbsentManager = require('../managers/teacher.absent.manager');

const teacherAbsentController = {
  getAllAbsentTeachers: async (req, res) => {
    try {
      res.json(await teacherAbsentManager.getAll(req.permissions));
    } catch (error) {
      console.error('Error fetching absent teachers:', error);
      res.status(500).json({ message: 'Error fetching absent teachers', error: error.message });
    }
  },

  getAbsentTeachersByBatch: async (req, res) => {
    try {
      const absentTeachers = await teacherAbsentManager.getByBatch(req.params.batchId, req.user._id, req.permissions);
      if (!absentTeachers) return res.status(404).json({ message: 'Batch not found. Pick a batch from your own schools.' });
      res.json(absentTeachers);
    } catch (error) {
      console.error('Error fetching absent teachers for batch:', error);
      res.status(500).json({ message: 'Error fetching absent teachers for batch', error: error.message });
    }
  }
};

module.exports = teacherAbsentController;
