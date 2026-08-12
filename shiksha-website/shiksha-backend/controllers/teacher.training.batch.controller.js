const TeacherTrainingBatch = require('../models/teacher.training.batch.model');
const TeacherAbsent = require('../models/teacher.absent.model');
const ExcelJS = require('exceljs');
const BaseController = require('./base.controller');
const TeacherTrainingBatchManager = require('../managers/teacher.training.batch.manager');
const handleError = require('../helper/handleError');
const {
  getPreSignedFileUrl,
} = require("../services/azure.blob.service");
const { schoolDependency } = require("../helper/permission.helper");
const { permissionScopeFilter } = require("../helper/scope.helper");
const { scopedTeacherIds, canAccessBatch } = require("../helper/training.scope.helper");
const School = require("../models/school.model");
const User = require("../models/user.model");
const teacherPopulate = { path: "assignedTeachers", select: "identity profiles.teacher roles", populate: { path: "roles.role", select: "scopeType" } };

async function withTeacherSchools(batch) {
  const data = batch.toObject();
  const ids = data.assignedTeachers.map((teacher) => schoolDependency(teacher.roles));
  const schools = new Map((await School.find({ _id: { $in: ids } }).lean()).map((school) => [String(school._id), school]));
  for (const teacher of data.assignedTeachers) teacher.school = schools.get(schoolDependency(teacher.roles));
  return data;
}

class TeacherTrainingBatchController extends BaseController {
  constructor() {
    super(new TeacherTrainingBatchManager());
    this.getBatches = this.getBatches.bind(this);
    this.getAvailableTeachers = this.getAvailableTeachers.bind(this);
  }

  async getBatches(req, res) {
    const result = await this.manager.getBatches(req.user, req.permissions);
    if (result.success) {
      return res.json(result.data);
    }
    handleError(result, res);
  }

  async getAvailableTeachers(req, res) {
    const { page = 1, limit = 50, search = '' } = req.query;
    const result = await this.manager.getAvailableTeachers(parseInt(page), parseInt(limit), search.trim(), req.permissions);
    if (result.success) return res.status(200).json(result);
    handleError(result, res);
  }

  async createBatch(req, res) {
  try {
    const pdfFile = req?.files?.pdfFile;
    
    if (!pdfFile || pdfFile.length === 0) {
      return res.status(400).json({ error: "A permission letter PDF file is required and must be of type application/pdf." });
    }
    const pdfPath = pdfFile[0].path;

    const { batchName, description, scheduleDate, trainingType } = req.body;
    // Validate required fields explicitly
    if (!batchName || !description || !scheduleDate || !trainingType) {
      return res.status(400).json({ message: 'Missing required batch fields.' });
    }

    // Save the batch with the PDF path
    const newBatch = new TeacherTrainingBatch({
      batchName,
      description,
      scheduleDate,
      trainingType,
      createdBy: req.user._id,
      permissionLetterPdfPath: pdfPath // Save the PDF path to the batch
    });

    const savedBatch = await newBatch.save();
    res.status(201).json(savedBatch);
  } catch (err) {
    // Multer file filter errors
    if (err.message && err.message.includes('Only PDF files are allowed')) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error in createBatch:', err);
    res.status(400).json({ message: err.message || 'An unknown error occurred.' });
  }
  }

  async getBatchById(req, res) {
  try {
    const { batchId } = req.params;
    const batch = await TeacherTrainingBatch.findById(batchId)
      .populate(teacherPopulate)
      .select('+permissionLetterPdfPath +attendancePdfPath +photoPaths.path +photoPaths.mimetype'); // Explicitly include photoPaths.path and photoPaths.mimetype
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    
    if (!await canAccessBatch(req.permissions, req.user._id, batch, "training.view")) return res.status(403).json({ message: 'Batch is outside your scope.' });
    let currentEpoch = parseInt(Date.now() / 1000);
		let expireLimit = 5 * 24 * 60 * 60;
    let expiryUpdated = false;

    if((!batch?.permissionLetterPdfExpiresIn || batch?.permissionLetterPdfExpiresIn < currentEpoch) && batch?.permissionLetterPdfPath){
     const permissionLink =  await getPreSignedFileUrl(batch.permissionLetterPdfPath);
     batch.permissionLetterPdfPath = permissionLink;
     batch.permissionLetterPdfExpiresIn = Number(currentEpoch) + Number(expireLimit);
     expiryUpdated = true;
    }

    if((!batch?.attendancePdfExpiresIn || batch?.attendancePdfExpiresIn < currentEpoch) && batch?.attendancePdfPath){
     const attendenceLink =  await getPreSignedFileUrl(batch.attendancePdfPath);
     batch.attendancePdfPath = attendenceLink;
     batch.attendancePdfExpiresIn = Number(currentEpoch) + Number(expireLimit);
     expiryUpdated = true;
    }

    for(let i=0; i<batch?.photoPaths.length; i++){
      if((!batch.photoPaths[i].expiresIn || batch.photoPaths[i].expiresIn < currentEpoch) && batch?.photoPaths[i].path){
        const photoLink = await getPreSignedFileUrl(batch.photoPaths[i].path );
        batch.photoPaths[i].path = photoLink;
        batch.photoPaths[i].expiresIn = Number(currentEpoch) + Number(expireLimit);
        expiryUpdated = true;
      }
    }

    if(expiryUpdated){
      await batch.save();
    }
    
    res.status(200).json(await withTeacherSchools(batch));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  }

  async assignTeacherToBatch(req, res) {
  const { batchId } = req.params;
  const { teacherId } = req.body;

  try {
    const batch = await TeacherTrainingBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    if (!await canAccessBatch(req.permissions, req.user._id, batch, "training.edit")) return res.status(403).json({ message: 'Batch is outside your scope.' });
    if (!(await scopedTeacherIds(req.permissions, "training.edit")).some((id) => String(id) === String(teacherId))) {
      return res.status(403).json({ message: 'Teacher is outside your scope.' });
    }

    // Convert teacherId to string for comparison
    const teacherIdStr = teacherId.toString();
    const assignedTeacherIds = batch.assignedTeachers.map(id => id.toString());

    if (!assignedTeacherIds.includes(teacherIdStr)) {
      // Use findByIdAndUpdate instead of save() to avoid losing createdBy field
      await TeacherTrainingBatch.findByIdAndUpdate(
        batchId,
        { $push: { assignedTeachers: teacherId } },
        { new: true, runValidators: false }
      );
    }
    
    const updatedBatch = await TeacherTrainingBatch.findById(batchId).populate(teacherPopulate);
    res.status(200).json(await withTeacherSchools(updatedBatch));
  } catch (err) {
    console.error('assignTeacherToBatch - error:', err);
    res.status(500).json({ message: err.message });
  }
  }

  async removeTeacherFromBatch(req, res) {
  const { batchId } = req.params;
  const { teacherId } = req.body;

  try {
    const batch = await TeacherTrainingBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    if (!await canAccessBatch(req.permissions, req.user._id, batch, "training.edit")) return res.status(403).json({ message: 'Batch is outside your scope.' });
    await TeacherTrainingBatch.findByIdAndUpdate(
      batchId,
      { $pull: { assignedTeachers: teacherId, attendance: teacherId } },
      { runValidators: false }
    );
    
    const updatedBatch = await TeacherTrainingBatch.findById(batchId).populate(teacherPopulate);
    res.status(200).json(await withTeacherSchools(updatedBatch));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  }

  async deleteBatch(req, res) {
  const { batchId } = req.params;
  try {
    const batch = await TeacherTrainingBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Prevent deletion of submitted batches to maintain data integrity
    if (batch.isSubmitted) {
      return res.status(400).json({ 
        message: 'Cannot delete a submitted batch. Submitted batches contain important attendance records that must be preserved for audit purposes.' 
      });
    }

    if (!await canAccessBatch(req.permissions, req.user._id, batch, "training.edit")) return res.status(403).json({ message: 'Batch is outside your scope.' });

    const deletedBatch = await TeacherTrainingBatch.findByIdAndDelete(batchId);
    res.status(200).json({ message: 'Batch deleted successfully', deletedBatch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  }

  async getTeacherTrainingStats(req, res) {
  try {
    const [schoolIds, attendedTeacherIds] = await Promise.all([
      School.distinct('_id', permissionScopeFilter(req.permissions, 'training.view')),
      TeacherTrainingBatch.distinct('attendance', { isSubmitted: true }),
    ]);
    const teacherFilter = { 'profiles.teacher': { $exists: true }, 'roles.dep': { $in: schoolIds }, isDeleted: false };
    const [totalTeachers, trainedTeachers] = await Promise.all([
      User.countDocuments(teacherFilter),
      User.countDocuments({ ...teacherFilter, _id: { $in: attendedTeacherIds } }),
    ]);
    res.status(200).json({ totalTeachers, trainedTeachers, untrainedTeachers: totalTeachers - trainedTeachers });
  } catch (err) {
    console.error('Error in getTeacherTrainingStats:', err);
    res.status(500).json({ message: err.message });
  }
  }

  async updateAttendance(req, res) {
  const { batchId } = req.params;
  const { attendance } = req.body; // Expecting an array of teacher IDs for attendance

  try {
    const batch = await TeacherTrainingBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    if (!await canAccessBatch(req.permissions, req.user._id, batch, "training.edit")) return res.status(403).json({ message: 'Batch is outside your scope.' });

    // Use findByIdAndUpdate instead of save() to avoid losing createdBy field
    const updatedBatch = await TeacherTrainingBatch.findByIdAndUpdate(
      batchId,
      { attendance: attendance },
      { new: true, runValidators: false }
    );

    res.status(200).json(updatedBatch);
  } catch (err) {
    console.error('updateAttendance - error:', err);
    res.status(500).json({ message: err.message });
  }
  }

  async submitBatch(req, res) {
  try {
    const { batchId } = req.params;
    const batch = await TeacherTrainingBatch.findById(batchId).populate(teacherPopulate);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    if (!await canAccessBatch(req.permissions, req.user._id, batch, "training.edit")) return res.status(403).json({ message: 'Batch is outside your scope.' });

    if (batch.isSubmitted) {
      return res.status(400).json({ message: 'This batch has already been submitted.' });
    }

    // Mark absent teachers for record-keeping
    const batchData = await withTeacherSchools(batch);
    const absentTeachers = batchData.assignedTeachers.filter(
      (teacher) => !batch.attendance.includes(teacher._id)
    );

    if (absentTeachers.length > 0) {
      const newAbsentees = absentTeachers.map(teacher => ({
        teacherId: teacher._id,
        batchId: batch._id,
        batchName: batch.batchName,
        teacherName: teacher.identity.name,
        teacherPhone: teacher.identity.phone,
        teacherZone: teacher.school.zone,
        teacherDistrict: teacher.school.district
      }));
      await TeacherAbsent.insertMany(newAbsentees);
    }

    // Mark the batch as submitted
    batch.isSubmitted = true;
    const updatedBatch = await batch.save();

    res.status(200).json(updatedBatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  }

  async uploadPdf(req, res) {
  try {
    const { batchId } = req.params;
    const batch = await TeacherTrainingBatch.findById(batchId);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    if (!await canAccessBatch(req.permissions, req.user._id, batch, "training.edit")) return res.status(403).json({ message: 'Batch is outside your scope.' });

    // Handle multiple file uploads
    if (req.files) {
      if (req.files['permissionLetterFile']) {
        batch.permissionLetterPdfPath = req.files['permissionLetterFile'][0].path;
      }
      if (req.files['attendanceSheetFile']) {
        batch.attendancePdfPath = req.files['attendanceSheetFile'][0].path;
      }
      if (req.files['photos']) {
        req.files['photos'].forEach(file => {
          batch.photoPaths.push({
            path: file.path,
            mimetype: file.mimeType
          });
        });
      }
    }

    const updatedBatch = await batch.save();
    res.status(200).json(updatedBatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  }

  async exportBatchReport(req, res) {
  try {
    const { batchId } = req.params;
    const batch = await TeacherTrainingBatch.findById(batchId).populate(teacherPopulate);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    if (!await canAccessBatch(req.permissions, req.user._id, batch, "training.view")) return res.status(403).json({ message: 'Batch is outside your scope.' });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Batch Report');

    // --- Prepare summary data ---
    const totalParticipants = batch.assignedTeachers.length;
    const presentCount = batch.attendance.length;
    const absentCount = totalParticipants - presentCount;
    const scheduledDate = batch.scheduleDate ? new Date(batch.scheduleDate).toLocaleDateString() : '';

    // --- Add Header Section ---
    worksheet.addRow(['Batch Name', batch.batchName]);
    worksheet.addRow(['Scheduled Date', scheduledDate]);
    worksheet.addRow(['Total Number of Candidates', totalParticipants]);
    worksheet.addRow(['Attended Candidates', presentCount]);
    worksheet.addRow(['Absent Candidates', absentCount]);
    worksheet.addRow([]); // Empty row for spacing

    // Style header section
    for (let i = 1; i <= 5; i++) {
      worksheet.getRow(i).font = { bold: true, size: 12 };
      worksheet.getRow(i).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getRow(i).height = 20;
    }

    // --- Add Data Table Header ---
    worksheet.addRow(['SL', 'Teacher Name', 'Phone Number', 'Zone', 'District', 'Status']);
    const tableHeaderRowIdx = worksheet.lastRow.number;
    const tableHeaderRow = worksheet.getRow(tableHeaderRowIdx);
    tableHeaderRow.font = { bold: true, size: 12 };
    tableHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
    tableHeaderRow.height = 22;

    // --- Add Data Rows ---
    const batchData = await withTeacherSchools(batch);
    batchData.assignedTeachers.forEach((teacher, idx) => {
      const status = batch.attendance.map(id => id.toString()).includes(teacher._id.toString()) ? 'Present' : 'Absent';
      worksheet.addRow([
        idx + 1,
        teacher.identity.name,
        teacher.identity.phone,
        teacher.school.zone,
        teacher.school.district,
        status
      ]);
    });

    // Style data rows
    const firstDataRowIdx = tableHeaderRowIdx + 1;
    const lastDataRowIdx = worksheet.lastRow.number;
    for (let i = firstDataRowIdx; i <= lastDataRowIdx; i++) {
      worksheet.getRow(i).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getRow(i).height = 20;
    }

    // --- Auto width for all columns ---
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength + 2;
    });

    // --- Generate Excel File ---
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=teacher-report-${batchId}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error in exportBatchReport:', err);
    res.status(500).json({ message: err.message || 'An unknown error occurred during Excel export.' });
  }
  }
}

module.exports = new TeacherTrainingBatchController(); 
