const QuestionBankConfiguration = require("../models/question.bank.config.model");
const QuestionBank = require("../models/question.bank.model");
const Chapter = require("../models/chapter.model");
const Question = require("../models/question.model");
const MasterSubject = require("../models/master.subject.model");
const BaseDao = require("./base.dao");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// --- Helpers ---
const toTitleCase = (str) => {
  if (!str) return "";
  return (
    String(str).charAt(0).toUpperCase() + String(str).slice(1).toLowerCase()
  );
};
const regexExact = (val) => new RegExp(`^${String(val).trim()}$`, "i");
const str = (val) => String(val || "").trim();

class QuestionBankDao extends BaseDao {
  constructor() {
    super(QuestionBankConfiguration);
  }

  async getTeacherQuestionPapers(
    teacherId,
    page = 1,
    limit,
    filters = {},
    sort = {}
  ) {
    try {
      let processedFilters = { ...filters };

      for (const key in filters) {
        if (key === "grade") {
          processedFilters[key] = Number(filters[key]);
        } else if (key === "semester") {
          processedFilters[key] = JSON.parse(filters[key]);
        } else {
          processedFilters[key] = filters[key];
        }
      }

      if (!ObjectId.isValid(teacherId)) {
        throw new Error("Invalid Teacher ID");
      }

      const pipeline = [
        {
          $match: {
            teacherId: new ObjectId(teacherId),
          },
        },
        { $match: processedFilters },
        { $sort: sort },
      ];

      if (limit > 0) {
        pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });
      }

      const results = await QuestionBankConfiguration.aggregate(pipeline);

      const totalItems = await QuestionBankConfiguration.countDocuments(
        processedFilters
      );

      return {
        page,
        totalItems,
        limit: limit > 0 ? limit : totalItems,
        results,
      };
    } catch (err) {
      console.log("Error --> questionBankDao -> getAll()", err);
      throw err;
    }
  }

  async saveQuestionBank(data, session = null) {
    try {
      let questionBankmodel = new QuestionBank(data);
      const questionBank = await questionBankmodel.save(session ? { session } : {});
      return questionBank;
    } catch (err) {
      throw new Error("Error creating question bank: " + err.message);
    }
  }

  async getById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID provided for getById");
      }
      let result = await QuestionBankConfiguration.findOne({
        _id: id,
      }).populate("questionBank");
      return result;
    } catch (err) {
      console.log("Error --> QuestionBankDao -> getById()", err);
      throw err;
    }
  }

  async update(id, data) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID provided for update");
      }
      const result = await QuestionBank.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            feedback: data,
          },
        },
        { new: true }
      );
      return result;
    } catch (err) {
      console.log("Error -> QuestionBankDao -> update", err);
      throw err;
    }
  }

  // --- LBA Browsing & Search Logic (Migrated from QPDao) ---

  async resolveSubjectName(identifier) {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const subjectDoc = await MasterSubject.findById(identifier)
        .select("name")
        .lean();
      return subjectDoc ? subjectDoc.name : str(identifier);
    }
    const subjectDoc = await MasterSubject.findOne({
      $or: [{ name: identifier }, { subjectName: regexExact(identifier) }],
    })
      .select("name")
      .lean();

    return subjectDoc ? subjectDoc.name : str(identifier);
  }

  async getClasses() {
    let classes = await Chapter.distinct("standard");
    if (!classes || classes.length === 0) {
      classes = await Chapter.distinct("class");
    }
    return classes
      .map((c) => parseInt(c))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b)
      .map(String);
  }

  async getMedia(className) {
    const rawMedia = await Chapter.distinct("medium", {
      $or: [{ standard: parseInt(className) }, { class: str(className) }],
    });
    const uniqueMedia = new Set(rawMedia.map((m) => toTitleCase(m)));
    return Array.from(uniqueMedia).sort();
  }

  async getChapters(className, medium, subjectId) {
    let subjectCode = str(subjectId);
    let targetSubjectIds = [];

    if (mongoose.Types.ObjectId.isValid(subjectId)) {
      const subjectDoc = await MasterSubject.findById(subjectId)
        .select("name")
        .lean();
      if (subjectDoc) {
        subjectCode = subjectDoc.name;
        const relatedSubjects = await MasterSubject.find({ name: subjectCode })
          .select("_id")
          .lean();
        targetSubjectIds = relatedSubjects.map((s) => s._id);
      } else {
        targetSubjectIds = [new mongoose.Types.ObjectId(subjectId)];
      }
    } else {
      const relatedSubjects = await MasterSubject.find({
        $or: [
          { name: subjectCode },
          { subjectName: regexExact(subjectCode) },
        ],
      })
        .select("_id name")
        .lean();

      if (relatedSubjects.length > 0) {
        targetSubjectIds = relatedSubjects.map((s) => s._id);
        if (relatedSubjects[0].name) subjectCode = relatedSubjects[0].name;
      }
    }

    const medRx = regexExact(medium);
    const standardNum = parseInt(className);
    const classStr = str(className);

    const chapterQuery = {
      isDeleted: false,
      medium: medRx,
      $and: [
        {
          $or: [{ standard: standardNum }, { class: classStr }],
        },
        {
          $or: [
            { subjectId: { $in: targetSubjectIds } },
            { subject: regexExact(subjectCode) },
          ],
        },
      ],
    };

    const chapters = await Chapter.find(chapterQuery)
      .sort({ orderNumber: 1 })
      .lean();

    console.log(`[DAO] getChapters query: ${JSON.stringify(chapterQuery)}`);
    console.log(`[DAO] getChapters: found ${chapters.length} chapters`);

    if (!chapters.length) return [];

    const chapterIds = chapters.map((ch) => ch._id);

    const headingStats = await Question.aggregate([
      {
        $match: {
          chapterId: { $in: chapterIds },
        },
      },
      {
        $group: {
          _id: { chId: "$chapterId", heading: "$groupHeading" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.chId",
          headings: {
            $push: {
              name: { $ifNull: ["$_id.heading", "Misc"] },
              count: "$count",
            },
          },
        },
      },
    ]);

    const statsMap = new Map();
    headingStats.forEach((stat) => {
      statsMap.set(
        String(stat._id),
        stat.headings.sort((a, b) => a.name.localeCompare(b.name))
      );
    });

    return chapters.map((ch) => ({
      _id: ch._id,
      chapterNumber: ch.orderNumber || ch.chapterNumber,
      title:
        ch.topics ||
        ch.title ||
        `Chapter ${ch.orderNumber || ch.chapterNumber}`,
      headings: statsMap.get(String(ch._id)) || [
        { name: "Misc", count: 0 }
      ],
      subTopics: ch.subTopics,
    }));
  }

  async getDifficulties() {
    return Question.distinct("difficulty");
  }

  async getAnswerTypes() {
    return Question.distinct("answerType");
  }

  async getQuestions(filters) {
    const {
      subject,
      medium,
      class: className,
      chapterNumbers,
      chapterIds,
      headings,
      marks,
      difficulty,
      type,
      search,
    } = filters || {};

    let subjectCode = str(subject);
    let targetSubjectIds = [];
    let validIds = [];

    if (chapterIds && chapterIds.length > 0) {
      validIds = chapterIds
        .map((id) =>
          mongoose.Types.ObjectId.isValid(id)
            ? new mongoose.Types.ObjectId(id)
            : null
        )
        .filter(Boolean);
    }

    console.log(`[DAO] getQuestions initial subject: ${subject}`);
    if (mongoose.Types.ObjectId.isValid(subject)) {
      const subjectDoc = await MasterSubject.findById(subject)
        .select("name")
        .lean();
      if (subjectDoc) {
        subjectCode = subjectDoc.name;
        const relatedSubjects = await MasterSubject.find({ name: subjectCode })
          .select("_id")
          .lean();
        targetSubjectIds = relatedSubjects.map((s) => s._id);
      } else {
        targetSubjectIds = [new mongoose.Types.ObjectId(subject)];
      }
    } else {
      const relatedSubjects = await MasterSubject.find({
        $or: [{ name: subjectCode }, { subjectName: regexExact(subjectCode) }],
      })
        .select("_id name")
        .lean();

      if (relatedSubjects.length > 0) {
        targetSubjectIds = relatedSubjects.map((s) => s._id);
        if (relatedSubjects[0].name) subjectCode = relatedSubjects[0].name;
      }
    }

    console.log(`[DAO] getQuestions resolved: subjectCode=${subjectCode}, targetSubjectIds=${JSON.stringify(targetSubjectIds)}`);

    let query = {};

    if (validIds.length > 0) {
      // TRUST the ID: If valid Chapter IDs are provided, use ONLY them for scoping.
      // This matches legacy QPDao behavior and avoids mismatches with subjectId/class/medium.
      const stringIds = validIds.map((id) => id.toString());
      query.chapterId = { $in: [...validIds, ...stringIds] };
    } else {
      // Fallback/Legacy: Use string filters + chapterNumbers
      const medRx = regexExact(medium);
      const subjRx = regexExact(subjectCode);

      query = {
        $and: [
          {
            $or: [{ class: str(className) }, { standard: parseInt(className) }],
          },
          { medium: medRx },
          {
            $or: [
              { subjectId: { $in: targetSubjectIds } },
              { subjectId: { $in: targetSubjectIds.map((id) => id.toString()) } },
              { subject: subjRx },
            ],
          },
        ],
      };

      if (chapterNumbers && chapterNumbers.length > 0) {
        const nums = Array.isArray(chapterNumbers) ? chapterNumbers : [];
        query.$and.push({
          $or: [
            { "chapter.chapterNumber": { $in: nums } },
            { chapterNumber: { $in: nums } },
          ],
        });
      }
    }


    if (headings) {
      const arr = String(headings)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (arr.length) {
        if (arr.includes("Misc")) {
          query.$or = query.$or || [];
          query.$and = query.$and || [];
          query.$and.push({
            $or: [
              { groupHeading: { $in: arr } },
              { groupHeading: { $exists: false } },
              { groupHeading: null },
              { groupHeading: "" },
            ],
          });
        } else {
          query.groupHeading = { $in: arr };
        }
      }
    }

    if (marks && marks !== "Any") {
      const m = Number(marks);
      if (!isNaN(m)) query.marksPerQuestion = m;
    }
    if (difficulty && difficulty !== "Any") query.difficulty = difficulty;
    if (type && type !== "Any") query.answerType = type;

    if (search) {
      const rx = new RegExp(
        str(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      const searchOr = [{ text: rx }, { "chapter.title": rx }];
      if (query.$or) {
        // If query already has an $or (e.g. from class/standard), combine them with $and
        const existingOr = query.$or;
        delete query.$or;
        query.$and = query.$and || [];
        query.$and.push({ $or: existingOr });
        query.$and.push({ $or: searchOr });
      } else {
        query.$or = searchOr;
      }
    }

    console.log(`[DAO] getQuestions final query: ${JSON.stringify(query)}`);
    const docs = await Question.find(query)
      .sort({ "chapter.chapterNumber": 1, _id: 1 })
      .lean();
    console.log(`[DAO] getQuestions: found ${docs.length} docs`);

    const sanitizeOptions = (opts) => {
      if (!Array.isArray(opts)) return [];
      const alpha = (i) => String.fromCharCode(65 + i);
      return opts
        .map((o, i) => {
          if (!o) return null;
          if (typeof o === "string") return { label: alpha(i), text: o };
          const label = o.label || o.key || o.id || alpha(i);
          const optionText = o.text || o.option || o.value || o.content || "";
          return { label, text: optionText };
        })
        .filter((o) => o && o.text);
    };

    return docs.map((q) => ({
      ...q,
      _id: q._id,
      text: q.text || q.question_text || q.question || "",
      question_text: q.question_text || q.text || "",
      question: q.question || q.text || "",
      groupHeading: q.groupHeading || q.heading || "",
      answerType: q.answerType || q.type || "",
      difficulty: q.difficulty || "",
      marksPerQuestion: q.marksPerQuestion || q.marks || 1,
      options: sanitizeOptions(q.options),
      pairs: q.pairs || [],
      items: q.items || [],
      keyAnswer: q.keyAnswer || q.answer || "",
      answer: q.answer || q.keyAnswer || "",
      correctOrderById: q.correctOrderById || [],
      correctOrderIndices: q.correctOrderIndices || [],
      chapter: q.chapter
        ? {
          chapterNumber: q.chapter.chapterNumber,
          title: q.chapter.title,
        }
        : null,
    }));
  }
}

module.exports = QuestionBankDao;
