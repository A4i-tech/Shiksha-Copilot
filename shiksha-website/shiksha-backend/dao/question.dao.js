const Question = require("../models/question.model");

const BaseDao = require("./base.dao");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// --- Helpers ---
const regexExact = (val) => new RegExp(`^${String(val).trim()}$`, "i");
const str = (val) => String(val || "").trim();

class QuestionDao extends BaseDao {
    constructor() {
        super(Question);
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
            subjectCode,
            targetSubjectIds,
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

        if (!subjectCode || !targetSubjectIds) {
            console.warn("[DAO] getQuestions: subjectCode or targetSubjectIds missing from filters");
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
            keyAnswer: q.keyAnswer || q.keyanswer || q.answer || "",
            answer: q.answer || q.keyAnswer || q.keyanswer || "",
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
    async getHeadingStatsByChapterIds(chapterIds) {
        if (!chapterIds || chapterIds.length === 0) {
            return new Map();
        }

        const headingStats = await Question.aggregate([
            {
                $match: {
                    chapterId: { $in: chapterIds },
                },
            },
            {
                $group: {
                    _id: { chId: "$chapterId", heading: "$groupHeading", answerType: "$answerType" },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: "$_id.chId",
                    headings: {
                        $push: {
                            name: { $ifNull: ["$_id.heading", "Misc"] },
                            answerType: "$_id.answerType",
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

        return statsMap;
    }
}

module.exports = QuestionDao;
