// // services/qpaper.docx.js (or inline in lba.qp.manager.js)
// const fs = require('fs');
// const path = require('path');

// const {
//   AlignmentType,
//   BorderStyle,
//   Document,
//   Footer,
//   Header,
//   LevelFormat,
//   Packer,
//   Paragraph,
//   PageNumber,        // ← include this if you render
//   TabStopPosition,
//   TabStopType,
//   Table,
//   TableCell,
//   TableRow,
//   TextRun,
//   WidthType,
// } = require('docx');

// /* ========= PUBLIC: build and save a DOCX, return download URL ========= */
// async function buildQuestionPaperDocx(paper, outDirAbs) {
//   const { config, questions, totalMarks, schoolName, sections } = paper;

//   // Group questions by heading if sections aren’t provided
//   const grouped = sections && sections.length
//     ? hydrateGroupsFromSections(sections, questions)
//     : groupByHeading(questions);

//   const doc = new Document({
//     styles: {
//       default: {
//         document: {
//           run: {
//             font: "Times New Roman",
//             size: 24, // 12pt (half-points)
//           },
//           paragraph: {
//             spacing: { line: 276 }, // ~1.15
//           },
//         },
//       },
//     },
//     sections: [{
//       properties: {
//         page: {
//           size: { width: 11906, height: 16838 }, // A4 (twips)
//           margin: { top: 1134, right: 1134, bottom: 1440, left: 1134 },
//         },
//       },
//       headers: { default: buildHeader(schoolName, config, totalMarks) },
//       footers: { default: buildFooter() },
//       children: [
//         // small spacer after header
//         new Paragraph({ text: "", spacing: { after: 200 } }),

//         // Optional instructions: drop your own lines here if needed
//         // ...buildInstructions(["Answer all questions.", "Write neatly."]),

//         ...grouped.flatMap((g, idx) => {
//           const roman = toRoman(idx + 1);
//           const { summaryText, perQuestion } = computeGroupSummary(g.items, g.perQuestion, g.totalMarks, g.questionCount);

//           return [
//             // (I. Heading) ............... 2 × 3 = 6  (single line)
//             headingLine(`${roman}. ${g.title}`, summaryText),

//             // questions
//             ...renderGroupQuestions(g.items),

//             // gap after section
//             new Paragraph({ text: "", spacing: { after: 120 } }),
//           ];
//         }),
//       ],
//     }],
//   });

//   await fs.promises.mkdir(outDirAbs, { recursive: true });
//   const filePath = path.join(outDirAbs, `${paper._id}.docx`);
//   const buffer = await Packer.toBuffer(doc);
//   await fs.promises.writeFile(filePath, buffer);

//   return `/api/lba-qp/papers/${paper._id}/download`;
// }

// /* ===================== Builders & helpers ===================== */

// function buildHeader(schoolName, config, totalMarks) {
//   const top = new Paragraph({
//     alignment: AlignmentType.CENTER,
//     spacing: { after: 80 },
//     children: [new TextRun({ text: schoolName || "School Name", bold: true, size: 28 })], // 14pt
//   });

//   const exam = new Paragraph({
//     alignment: AlignmentType.CENTER,
//     spacing: { after: 80 },
//     children: [new TextRun({ text: config?.examName || "Examination", bold: true, size: 26 })], // 13pt
//   });

//   const meta = new Paragraph({
//     alignment: AlignmentType.CENTER,
//     spacing: { after: 80 },
//     children: [
//       bold(`Subject: ${config?.subject || "-"}`),
//       new TextRun({ text: "   |   " }),
//       bold(`Class: ${config?.class || "-"}`),
//       new TextRun({ text: "   |   " }),
//       bold(`Medium: ${config?.medium || "-"}`),
//       new TextRun({ text: "   |   " }),
//       bold(`Marks: ${totalMarks ?? "-"}`),
//     ],
//   });

//   const time = new Paragraph({
//     alignment: AlignmentType.CENTER,
//     spacing: { after: 100 },
//     children: [new TextRun({ text: "Time: 3 Hours" })],
//   });

//   return new Header({ children: [top, exam, meta, time] });
// }

// function buildFooter() {
//   // "Page X of Y", centered
//   return new Footer({
//     children: [
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         children: [
//           new TextRun({ children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES] }),
//         ],
//       }),
//     ],
//   });
// }

// // Simple bold TextRun
// function bold(text) {
//   return new TextRun({ text, bold: true });
// }

// // Roman numerals
// function toRoman(n) {
//   const map = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
//   let r = "";
//   for (const [v,s] of map) while (n >= v) { r += s; n -= v; }
//   return r;
// }

// function getQuestionMarks(q) {
//   const count = (q.pairs?.length || q.items?.length || 1);
//   const per = q.marksPerQuestion ?? 1;
//   return per * count;
// }

// // “I. Heading” …… “2 × 3 = 6” (one line with leader dots to right-aligned tab)
// function headingLine(leftText, rightText) {
//   return new Paragraph({
//     tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
//     children: [
//       new TextRun({ text: leftText, bold: true }),
//       new TextRun({ text: "\t" + rightText, bold: true }), // \t goes to the right tab stop
//     ],
//     spacing: { after: 80 },
//   });
// }

// function computeGroupSummary(items, perQuestionFromSection, totalFromSection, countFromSection) {
//   const n = countFromSection ?? items.length;
//   if (perQuestionFromSection != null && totalFromSection != null) {
//     return { summaryText: `${n} × ${perQuestionFromSection} = ${totalFromSection}`, perQuestion: perQuestionFromSection };
//   }
//   const totals = items.map(getQuestionMarks);
//   const sum = totals.reduce((a,b)=>a+b, 0);
//   const uniq = Array.from(new Set(totals));
//   if (uniq.length === 1) return { summaryText: `${n} × ${uniq[0]} = ${sum}`, perQuestion: uniq[0] };
//   return { summaryText: `${n} Qs, total = ${sum}`, perQuestion: null };
// }

// /** Convert sections + questions into [{ title, items, perQuestion?, totalMarks?, questionCount? }, ...] */
// function hydrateGroupsFromSections(sections, allQuestions) {
//   // Map questions by heading
//   const map = new Map();
//   for (const q of allQuestions || []) {
//     const key = (q.groupHeading || "Misc").trim();
//     if (!map.has(key)) map.set(key, []);
//     map.get(key).push(q);
//   }
//   return sections.map(s => ({
//     title: s.displayTitle || s.headingKey,
//     items: map.get(s.headingKey || "Misc") || [],
//     perQuestion: s.perQuestion ?? null,
//     totalMarks: s.totalMarks ?? null,
//     questionCount: s.questionCount ?? undefined,
//   }));
// }

// /** Fallback: group by heading from questions only */
// function groupByHeading(arr) {
//   const norm = (s) => (s || 'Misc').trim();
//   const map = new Map();
//   const sorted = [...arr].sort((a, b) => {
//     const g = norm(a.groupHeading).localeCompare(norm(b.groupHeading));
//     if (g !== 0) return g;
//     const ca = a.chapter?.chapterNumber ?? 0;
//     const cb = b.chapter?.chapterNumber ?? 0;
//     if (ca !== cb) return ca - cb;
//     return (a._id || '').localeCompare(b._id || '');
//   });
//   for (const q of sorted) {
//     const key = norm(q.groupHeading);
//     if (!map.has(key)) map.set(key, []);
//     map.get(key).push(q);
//   }
//   return Array.from(map.entries()).map(([heading, items]) => ({ title: heading, items }));
// }

// /** Render list of questions with types: text, MCQ options, pairs (match), items list */
// function renderGroupQuestions(items) {
//   const out = [];
//   items.forEach((q, idx) => {
//     const mark = getQuestionMarks(q);

//     // “1. Question text (xM)”
//     const header = new Paragraph({
//       spacing: { after: 60 },
//       children: [
//         new TextRun({ text: `${idx + 1}. `, bold: true }),
//         new TextRun({ text: (q.text || "").trim() }),
//         new TextRun({ text: `   (${mark}M)`, bold: true }),
//       ],
//     });
//     out.push(header);

//     // MCQ
//     if (Array.isArray(q.options) && q.options.length) {
//       q.options.forEach(op => {
//         out.push(new Paragraph({
//           spacing: { before: 10, after: 0 },
//           children: [
//             new TextRun({ text: `${op.label || ""}. `, bold: true }),
//             new TextRun({ text: op.text || "" }),
//           ],
//         }));
//       });
//       out.push(new Paragraph({ text: "", spacing: { after: 60 } }));
//     }

//     // Match the following (pairs)
//     if (Array.isArray(q.pairs) && q.pairs.length) {
//       out.push(renderPairsTable(q.pairs));
//       out.push(new Paragraph({ text: "", spacing: { after: 100 } }));
//     }

//     // Items list (fill-in / short)
//     if (Array.isArray(q.items) && q.items.length && !q.pairs?.length) {
//       q.items.forEach(it => {
//         out.push(new Paragraph({
//           spacing: { before: 8, after: 0 },
//           children: [new TextRun({ text: `• ${it}` })],
//         }));
//       });
//       out.push(new Paragraph({ text: "", spacing: { after: 80 } }));
//     }
//   });
//   return out;
// }

// function renderPairsTable(pairs) {
//   const rows = pairs.map((p, i) => new TableRow({
//     children: [
//       new TableCell({
//         children: [new Paragraph({
//           children: [
//             new TextRun({ text: `${i + 1}. `, bold: true }),
//             new TextRun({ text: p.left || "" }),
//           ],
//         })],
//       }),
//       new TableCell({
//         children: [new Paragraph({
//           children: [
//             new TextRun({ text: `${String.fromCharCode(97 + i)}. `, bold: true }), // a., b., c.
//             new TextRun({ text: p.right || "" }),
//           ],
//         })],
//       }),
//     ],
//   }));
//   return new Table({
//     width: { size: 100, type: WidthType.PERCENTAGE },
//     borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone(), insideH: borderNone(), insideV: borderNone() },
//     rows,
//   });
// }

// function borderNone() { return { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }; }

// module.exports = { buildQuestionPaperDocx };





// // services/lba.qpaper.docx
// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const {
//   AlignmentType,
//   Document,
//   Footer,
//   Header,
//   HeadingLevel,
//   Packer,
//   Paragraph,
//   TextRun,
//   Table,
//   TableRow,
//   TableCell,
//   WidthType,
//   PageNumber,
// } = require('docx');

// function ensureDir(dir) {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// }

// // fallback A/B/C… labels
// function alpha(i) { return String.fromCharCode(65 + i); }
// function labelOrAlpha(i, lbl) { return (lbl && String(lbl).trim()) || alpha(i); }

// // normalize MCQ option array to {label, text}
// function normalizeOptions(options = []) {
//   if (!Array.isArray(options)) return [];
//   return options
//     .map((o, i) => {
//       if (!o) return null;
//       if (typeof o === 'string') return { label: alpha(i), text: o };
//       const text = (o.text ?? '').toString().trim();
//       if (!text) return null;
//       return { label: labelOrAlpha(i, o.label ?? o.key), text };
//     })
//     .filter(Boolean);
// }

// // group if paper.sections provided; else single bucket by groupHeading
// function toBlocks(paper) {
//   if (Array.isArray(paper.sections) && paper.sections.length) {
//     // Expect each section: { heading: string, items: Question[] }
//     return paper.sections.map(s => ({
//       heading: s.heading || 'Section',
//       items: (s.items || []).map(q => massageQuestion(q)),
//     }));
//   }
//   // fallback: use groupHeading
//   const qs = (paper.questions || []).map(q => massageQuestion(q));
//   const by = new Map();
//   for (const q of qs) {
//     const key = (q.groupHeading || 'Misc').trim();
//     if (!by.has(key)) by.set(key, []);
//     by.get(key).push(q);
//   }
//   return Array.from(by.entries()).map(([heading, items]) => ({ heading, items }));
// }

// // ensure question shape is safe for rendering
// function massageQuestion(q) {
//   return {
//     _id: q._id?.toString?.() || '',
//     text: q.text || '',
//     groupHeading: q.groupHeading || '',
//     answerType: q.answerType || '',
//     difficulty: q.difficulty || '',
//     marksPerQuestion: Number.isFinite(q.marksPerQuestion) ? q.marksPerQuestion : 1,
//     keyAnswer: q.keyAnswer ?? '',
//     options: normalizeOptions(q.options),
//     pairs: Array.isArray(q.pairs) ? q.pairs : [],
//     items: Array.isArray(q.items) ? q.items : [],
//     correctOrderById: Array.isArray(q.correctOrderById) ? q.correctOrderById : [],
//     correctOrderIndices: Array.isArray(q.correctOrderIndices) ? q.correctOrderIndices : [],
//     chapter: q.chapter || null,
//   };
// }

// // concise “[ chX, Diff, nM ]”
// function tagOf(q) {
//   const ch = q.chapter?.chapterNumber ?? '—';
//   const dif = q.difficulty ? (q.difficulty[0].toUpperCase() + q.difficulty.slice(1).toLowerCase()) : '—';
//   const m = q.marksPerQuestion ?? 1;
//   return `[ ch${ch}, ${dif}, ${m}M ]`;
// }

// // derive a human-readable answer string for the Answer Key
// function getAnswerLine(q) {
//   // MCQ: prefer keyAnswer, else not available
//   if (q.answerType === 'mcq') {
//     const key = (q.keyAnswer ?? '').toString().trim();
//     if (key) {
//       // Allow either "A", "a", or exact label text
//       const match = q.options.find(
//         (o, i) =>
//           o.label?.toLowerCase() === key.toLowerCase() ||
//           alpha(i).toLowerCase() === key.toLowerCase()
//       );
//       return match ? `${match.label}. ${match.text}` : key; // if label only
//     }
//     return '—';
//   }

//   // Match the Following: 1-a, 2-c …
//   if (q.answerType === 'match_pairs' && q.pairs?.length) {
//     // If dataset has mapping baked in, prefer it; otherwise identity map
//     const map = q.pairs.map((_, i) => `${i + 1}-${alpha(i).toLowerCase()}`);
//     return map.join(', ');
//   }

//   // Ordering: indices like 2,1,3 ⇒ positions 2>1>3
//   if (q.answerType === 'ordering') {
//     const idx = (q.correctOrderIndices || []).map(n => Number(n));
//     if (idx.length) return idx.map(n => (Number.isFinite(n) ? n + 1 : n)).join(' > ');
//     return '—';
//   }

//   // fill/short/long: free-text in keyAnswer
//   if (q.keyAnswer) return q.keyAnswer;

//   return '—';
// }

// // layout knobs
// const LAYOUT = {
//   page: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5"
//   font: 'Times New Roman',
//   titleSize: 28,
//   h1Size: 24,
//   h2Size: 20,
//   bodySize: 22,
// };

// function para(text, opts = {}) {
//   const { bold = false, italics = false, size = LAYOUT.bodySize, align = AlignmentType.LEFT } = opts;
//   return new Paragraph({
//     alignment: align,
//     children: [new TextRun({ text, bold, italics, size, font: LAYOUT.font })],
//   });
// }

// function h(text, level = 2) {
//   const size = level === 1 ? LAYOUT.h1Size : LAYOUT.h2Size;
//   return para(text, { bold: true, size, align: AlignmentType.LEFT });
// }

// function right(text) {
//   return para(text, { align: AlignmentType.RIGHT });
// }

// function tableTwoCols(leftTitle, leftLines = [], rightTitle, rightLines = []) {
//   return new Table({
//     width: { size: 100, type: WidthType.PERCENTAGE },
//     rows: [
//       new TableRow({
//         children: [
//           new TableCell({ children: [para(leftTitle, { bold: true })] }),
//           new TableCell({ children: [para(rightTitle, { bold: true })] }),
//         ],
//       }),
//       ...Array.from({ length: Math.max(leftLines.length, rightLines.length) }).map((_, i) =>
//         new TableRow({
//           children: [
//             new TableCell({ children: [para(leftLines[i] || '')] }),
//             new TableCell({ children: [para(rightLines[i] || '')] }),
//           ],
//         })
//       ),
//     ],
//   });
// }

// function roman(n) {
//   const map = [
//     [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
//     [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
//     [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
//   ];
//   let out = '';
//   for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
//   return out;
// }

// async function buildQuestionPaperDocx(paper, storageDir, opts = {}) {
//   ensureDir(storageDir);
//   const id = paper._id?.toString?.() || paper.id;
//   const filePath = path.join(storageDir, `${id}.docx`);

//   const header = [
//     para(paper.schoolName || 'School Name', { bold: true, size: LAYOUT.titleSize, align: AlignmentType.CENTER }),
//     para(paper.config?.examName || '', { bold: true, size: LAYOUT.h1Size, align: AlignmentType.CENTER }),
//     para(
//       `Subject: ${paper.config?.subject || '—'}   |   Class: ${paper.config?.class || '—'}   |   Medium: ${paper.config?.medium || '—'}`,
//       { align: AlignmentType.CENTER }
//     ),
//     para(`Marks: ${paper.totalMarks ?? '—'}   |   Time: 3 Hours`, { align: AlignmentType.CENTER }),
//   ];

//   const blocks = toBlocks(paper);

//   const body = [];

//   // Questions
//   body.push(para('')); // spacer
//   let qCounter = 1;

//   blocks.forEach((block, bIndex) => {
//     body.push(h(`${roman(bIndex + 1)}. ${block.heading}`, 2));

//     block.items.forEach((q, idx) => {
//       const left = `${idx + 1}. ${q.text || defaultStem(q)}`;
//       const rightMarks = `${q.marksPerQuestion}M`;

//       // question line with marks on right
//       body.push(
//         new Paragraph({
//           alignment: AlignmentType.JUSTIFIED,
//           children: [
//             new TextRun({ text: left, size: LAYOUT.bodySize, font: LAYOUT.font }),
//             new TextRun({ text: '  ' }),
//             new TextRun({ text: rightMarks, size: LAYOUT.bodySize, bold: true }),
//           ],
//         })
//       );

//       // extra (options/pairs/items)
//       if (q.answerType === 'mcq' && q.options?.length) {
//         const opts = q.options.map((o, i) => `${labelOrAlpha(i, o.label)}. ${o.text}`);
//         opts.forEach(line => body.push(para(line)));
//       }

//       if (q.answerType === 'match_pairs' && q.pairs?.length) {
//         const leftCol = q.pairs.map((p, i) => `${i + 1}. ${p.left}`);
//         const rightCol = q.pairs.map((p, i) => `${alpha(i).toLowerCase()}. ${p.right}`);
//         body.push(tableTwoCols('Column A', leftCol, 'Column B', rightCol));
//       }

//       if (q.answerType === 'ordering' && q.items?.length) {
//         q.items.forEach((it, i) => body.push(para(`${i + 1}. ${it}`)));
//       }

//       if (!q.text && q.items?.length && !['match_pairs', 'ordering', 'mcq'].includes(q.answerType)) {
//         q.items.forEach((it, i) => body.push(para(`${i + 1}. ${it}`)));
//       }

//       // tag
//       body.push(para(tagOf(q), { italics: true }));
//       body.push(para('')); // spacer

//       qCounter++;
//     });

//     body.push(para('')); // section spacer
//   });

//   // Answer Key
//   body.push(h('ANSWER KEY', 1));
//   let ansCounter = 1;

//   blocks.forEach((block, bIndex) => {
//     body.push(h(`${roman(bIndex + 1)}. ${block.heading}`, 2));
//     block.items.forEach((q, idx) => {
//       const ans = getAnswerLine(q);
//       body.push(para(`${idx + 1}. ${ans}`));
//       ansCounter++;
//     });
//     body.push(para(''));
//   });

//   const doc = new Document({
//     sections: [
//       {
//         properties: {
//           page: {
//             margin: LAYOUT.page,
//           },
//         },
//         headers: { default: new Header({ children: [] }) },
//         footers: {
//           default: new Footer({
//             children: [
//               new Paragraph({
//                 alignment: AlignmentType.CENTER,
//                 children: [new TextRun({ children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES] })],
//               }),
//             ],
//           }),
//         },
//         children: [...header, ...body],
//       },
//     ],
//   });

//   const buffer = await Packer.toBuffer(doc);
//   fs.writeFileSync(filePath, buffer);
//   return `/api/lba-qp/papers/${id}/download`;
// }

// function defaultStem(q) {
//   if (q.answerType === 'match_pairs') return 'Match the following:';
//   if (q.answerType === 'ordering') return 'Arrange in chronological order:';
//   if (q.answerType === 'mcq') return 'Choose the correct option:';
//   if (q.items?.length) return 'Answer the following:';
//   return 'Answer the following:';
// }

// module.exports = { buildQuestionPaperDocx };




// // services/lba.qpaper.docx.js
// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const {
//   AlignmentType,
//   Document,
//   Footer,
//   Header,
//   HeadingLevel,
//   Packer,
//   Paragraph,
//   TextRun,
//   Table,
//   TableRow,
//   TableCell,
//   WidthType,
//   // Page numbering helpers (available across docx v6–v8)
//   PageNumber,
//   NumberOfTotalPages,
// } = require('docx');

// function ensureDir(dir) {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// }

// // ---------- Small helpers ----------
// const alpha = (i) => String.fromCharCode(65 + i); // A, B, C...
// const labelOrAlpha = (i, lbl) => (lbl && String(lbl).trim()) || alpha(i);
// const normStr = (x) => (x == null ? '' : String(x));

// function normalizeOptions(options = []) {
//   if (!Array.isArray(options)) return [];
//   return options
//     .map((o, i) => {
//       if (!o) return null;
//       if (typeof o === 'string') return { label: alpha(i), text: o };
//       const text = (o.text ?? '').toString().trim();
//       if (!text) return null;
//       return { label: labelOrAlpha(i, o.label ?? o.key), text };
//     })
//     .filter(Boolean);
// }

// // Group into blocks: prefer paper.sections; else group by question.groupHeading
// function toBlocks(paper) {
//   if (Array.isArray(paper.sections) && paper.sections.length) {
//     // sections expected as: [{ heading, items: Question[] }]
//     return paper.sections.map((s) => ({
//       heading: s.heading || 'Section',
//       items: (s.items || []).map(massageQuestion),
//     }));
//   }

//   const qs = (paper.questions || []).map(massageQuestion);
//   const by = new Map();
//   for (const q of qs) {
//     const key = (q.groupHeading || 'Misc').trim();
//     if (!by.has(key)) by.set(key, []);
//     by.get(key).push(q);
//   }
//   return Array.from(by.entries()).map(([heading, items]) => ({ heading, items }));
// }

// function massageQuestion(q) {
//   return {
//     _id: q._id?.toString?.() || '',
//     text: q.text || '',
//     groupHeading: q.groupHeading || '',
//     answerType: q.answerType || '',
//     difficulty: q.difficulty || '',
//     marksPerQuestion: Number.isFinite(q.marksPerQuestion) ? q.marksPerQuestion : 1,
//     keyAnswer: q.keyAnswer ?? '',
//     options: normalizeOptions(q.options),
//     pairs: Array.isArray(q.pairs) ? q.pairs : [],
//     items: Array.isArray(q.items) ? q.items : [],
//     correctOrderById: Array.isArray(q.correctOrderById) ? q.correctOrderById : [],
//     correctOrderIndices: Array.isArray(q.correctOrderIndices) ? q.correctOrderIndices : [],
//     chapter: q.chapter || null,
//   };
// }

// function tagOf(q) {
//   const ch = q.chapter?.chapterNumber ?? '—';
//   const dif = q.difficulty ? (q.difficulty[0].toUpperCase() + q.difficulty.slice(1).toLowerCase()) : '—';
//   const m = q.marksPerQuestion ?? 1;
//   return `[ ch${ch}, ${dif}, ${m}M ]`;
// }

// function getAnswerLine(q) {
//   // MCQ: use keyAnswer; try to map to label + option text
//   if (q.answerType === 'mcq') {
//     const key = (q.keyAnswer ?? '').toString().trim();
//     if (key) {
//       const match = q.options.find(
//         (o, i) =>
//           o.label?.toLowerCase() === key.toLowerCase() ||
//           alpha(i).toLowerCase() === key.toLowerCase()
//       );
//       return match ? `${match.label}. ${match.text}` : key;
//     }
//     return '—';
//   }

//   // Match pairs: 1-a, 2-b, ...
//   if (q.answerType === 'match_pairs' && q.pairs?.length) {
//     const map = q.pairs.map((_, i) => `${i + 1}-${alpha(i).toLowerCase()}`);
//     return map.join(', ');
//   }

//   // Ordering: indices (0-based in data) -> “2 > 1 > 3”
//   if (q.answerType === 'ordering') {
//     const idx = (q.correctOrderIndices || []).map((n) => Number(n));
//     if (idx.length) return idx.map((n) => (Number.isFinite(n) ? n + 1 : n)).join(' > ');
//     return '—';
//   }

//   // Fill/short/long: free text
//   if (q.keyAnswer) return q.keyAnswer;

//   return '—';
// }

// // Roman numerals for section labels
// function roman(n) {
//   const map = [
//     [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
//     [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
//     [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
//   ];
//   let out = '';
//   for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
//   return out;
// }

// // ---------- Layout ----------
// const LAYOUT = {
//   page: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5"
//   font: 'Times New Roman',
//   titleSize: 28, // 14pt
//   h1Size: 24,    // 12pt
//   h2Size: 22,    // 11pt
//   bodySize: 22,  // 11pt
// };

// function para(text, opts = {}) {
//   const { bold = false, italics = false, size = LAYOUT.bodySize, align = AlignmentType.LEFT } = opts;
//   return new Paragraph({
//     alignment: align,
//     children: [new TextRun({ text, bold, italics, size, font: LAYOUT.font })],
//   });
// }

// function h(text, level = 2) {
//   const size = level === 1 ? LAYOUT.h1Size : LAYOUT.h2Size;
//   return para(text, { bold: true, size, align: AlignmentType.LEFT });
// }

// function tableTwoCols(leftTitle, leftLines = [], rightTitle, rightLines = []) {
//   return new Table({
//     width: { size: 100, type: WidthType.PERCENTAGE },
//     rows: [
//       new TableRow({
//         children: [
//           new TableCell({ children: [para(leftTitle, { bold: true })] }),
//           new TableCell({ children: [para(rightTitle, { bold: true })] }),
//         ],
//       }),
//       ...Array.from({ length: Math.max(leftLines.length, rightLines.length) }).map((_, i) =>
//         new TableRow({
//           children: [
//             new TableCell({ children: [para(leftLines[i] || '')] }),
//             new TableCell({ children: [para(rightLines[i] || '')] }),
//           ],
//         })
//       ),
//     ],
//   });
// }

// function defaultStem(q) {
//   if (q.answerType === 'match_pairs') return 'Match the following:';
//   if (q.answerType === 'ordering') return 'Arrange in chronological order:';
//   if (q.answerType === 'mcq') return 'Choose the correct option:';
//   if (q.items?.length) return 'Answer the following:';
//   return 'Answer the following:';
// }

// // ---------- Footer helpers (robust across docx versions) ----------
// const CURRENT_PAGE = PageNumber?.CURRENT || PageNumber || '{{PAGE}}';
// const TOTAL_PAGES =
//   (PageNumber && PageNumber.TOTAL_PAGES) ||
//   NumberOfTotalPages ||
//   '{{TOTAL_PAGES}}';

// // ---------- MAIN: build DOCX and save ----------
// async function buildQuestionPaperDocx(paper, storageDir, opts = {}) {
//   ensureDir(storageDir);

//   const id = paper._id?.toString?.() || paper.id;
//   const filePath = path.join(storageDir, `${id}.docx`);

//   // Header block
//   const header = [
//     para(paper.schoolName || 'School Name', { bold: true, size: LAYOUT.titleSize, align: AlignmentType.CENTER }),
//     para(paper.config?.examName || '', { bold: true, size: LAYOUT.h1Size, align: AlignmentType.CENTER }),
//     para(
//       `Subject: ${paper.config?.subject || '—'}   |   Class: ${paper.config?.class || '—'}   |   Medium: ${paper.config?.medium || '—'}`,
//       { align: AlignmentType.CENTER }
//     ),
//     para(`Marks: ${paper.totalMarks ?? '—'}   |   Time: 3 Hours`, { align: AlignmentType.CENTER }),
//   ];

//   // Group questions
//   const blocks = toBlocks(paper);

//   const body = [];
//   body.push(para('')); // spacer

//   // Questions
//   blocks.forEach((block, bIndex) => {
//     body.push(h(`${roman(bIndex + 1)}. ${block.heading}`, 2));

//     block.items.forEach((q, idx) => {
//       const left = `${idx + 1}. ${q.text || defaultStem(q)}`;
//       const rightMarks = `${q.marksPerQuestion}M`;

//       // Q line + marks
//       body.push(
//         new Paragraph({
//           alignment: AlignmentType.JUSTIFIED,
//           children: [
//             new TextRun({ text: left, size: LAYOUT.bodySize, font: LAYOUT.font }),
//             new TextRun({ text: '  ' }),
//             new TextRun({ text: rightMarks, size: LAYOUT.bodySize, bold: true }),
//           ],
//         })
//       );

//       // MCQ options
//       if (q.answerType === 'mcq' && q.options?.length) {
//         q.options.forEach((o, i) => {
//           body.push(para(`${labelOrAlpha(i, o.label)}. ${o.text}`));
//         });
//       }

//       // Match pairs as table
//       if (q.answerType === 'match_pairs' && q.pairs?.length) {
//         const leftCol = q.pairs.map((p, i) => `${i + 1}. ${p.left}`);
//         const rightCol = q.pairs.map((p, i) => `${String.fromCharCode(97 + i)}. ${p.right}`); // a., b., c.
//         body.push(tableTwoCols('Column A', leftCol, 'Column B', rightCol));
//       }

//       // Ordering list
//       if (q.answerType === 'ordering' && q.items?.length) {
//         q.items.forEach((it, i) => body.push(para(`${i + 1}. ${it}`)));
//       }

//       // Generic items (fill/short/etc.)
//       if (!q.text && q.items?.length && !['match_pairs', 'ordering', 'mcq'].includes(q.answerType)) {
//         q.items.forEach((it, i) => body.push(para(`${i + 1}. ${it}`)));
//       }

//       // Tag line
//       body.push(para(tagOf(q), { italics: true }));
//       body.push(para('')); // spacer
//     });

//     body.push(para('')); // section spacer
//   });

//   // Answer Key
//   body.push(h('ANSWER KEY', 1));
//   blocks.forEach((block, bIndex) => {
//     body.push(h(`${roman(bIndex + 1)}. ${block.heading}`, 2));
//     block.items.forEach((q, idx) => {
//       body.push(para(`${idx + 1}. ${getAnswerLine(q)}`));
//     });
//     body.push(para(''));
//   });

//   // Footer: "Page X of Y"
//   const footer = new Footer({
//     children: [
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         children: [
//           new TextRun({ text: 'Page ' }),
//           // IMPORTANT: Put the special constants directly in Paragraph children (not in a TextRun's text)
//           CURRENT_PAGE,
//           new TextRun({ text: ' of ' }),
//           TOTAL_PAGES,
//         ],
//       }),
//     ],
//   });

//   const doc = new Document({
//     sections: [
//       {
//         properties: { page: { margin: LAYOUT.page } },
//         headers: { default: new Header({ children: [] }) },
//         footers: { default: footer },
//         children: [...header, ...body],
//       },
//     ],
//   });

//   const buffer = await Packer.toBuffer(doc);
//   fs.writeFileSync(filePath, buffer);
//   return `/api/lba-qp/papers/${id}/download`;
// }

// module.exports = { buildQuestionPaperDocx };





// services/lba.qpaper.docx.js
'use strict';

const fs = require('fs');
const path = require('path');
const {
  AlignmentType,
  Document,
  Footer,
  Header,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  PageNumber,
  NumberOfTotalPages,
  TabStopType,
  TabStopPosition,
} = require('docx');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/* -------------------- small helpers -------------------- */
const alpha = (i) => String.fromCharCode(65 + i); // A,B,C...
const labelOrAlpha = (i, lbl) => (lbl && String(lbl).trim()) || alpha(i);
const normStr = (x) => (x == null ? '' : String(x));

function normalizeOptions(options = []) {
  if (!Array.isArray(options)) return [];
  return options
    .map((o, i) => {
      if (!o) return null;
      if (typeof o === 'string') return { label: alpha(i), text: o };
      const text = (o.text ?? '').toString().trim();
      if (!text) return null;
      return { label: labelOrAlpha(i, o.label ?? o.key), text };
    })
    .filter(Boolean);
}

function roman(n) {
  const map = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

function massageQuestion(q) {
  return {
    _id: q._id?.toString?.() || '',
    text: q.text || '',
    groupHeading: q.groupHeading || '',
    answerType: q.answerType || '',
    difficulty: q.difficulty || '',
    // keep original per-question marks; can be overridden by section.perQuestion below
    marksPerQuestion: Number.isFinite(q.marksPerQuestion) ? q.marksPerQuestion : 1,
    keyAnswer: q.keyAnswer ?? '',
    options: normalizeOptions(q.options),
    pairs: Array.isArray(q.pairs) ? q.pairs : [],
    items: Array.isArray(q.items) ? q.items : [],
    correctOrderById: Array.isArray(q.correctOrderById) ? q.correctOrderById : [],
    correctOrderIndices: Array.isArray(q.correctOrderIndices) ? q.correctOrderIndices : [],
    chapter: q.chapter || null,
  };
}

/** robust heading normalize to match FE keys */
function normHeading(s = '') {
  const x = String(s).trim().toLowerCase();
  if (x.includes('fill')) return 'Fill in the Blanks';
  if (x.includes('one sentence')) return 'Answer in One Sentence';
  if (x.includes('2-4') || x.includes('two to four') || x.includes('2 to 4')) return 'Answer In Two To Four Sentences';
  if (x.includes('6')) return 'Answer In Six Sentences';
  if (x.includes('match')) return 'Match the Following';
  if (x.includes('mcq') || x.includes('multiple choice')) return 'Multiple Choice Questions';
  if (x.includes('true') && x.includes('false')) return 'True or False';
  if (x.includes('arrange') || x.includes('chrono')) return 'Arrange in Chronological Order';
  if (x.includes('map')) return 'Map Activity';
  return s || 'General';
}

/** build: respect paper.sections order if provided; else group by heading */
function buildBlocks(paper) {
  const allQs = (paper.questions || []).map(massageQuestion);

  // if sections come with items already (your preview sends this), use them as-is
  if (Array.isArray(paper.sections) && paper.sections.length) {
    return paper.sections.map((sec) => {
      const key = normHeading(sec.headingKey || sec.heading || '');
      let items = Array.isArray(sec.items) && sec.items.length
        ? sec.items.map(massageQuestion)
        : allQs.filter(q => normHeading(q.groupHeading) === key);

      // respect the questionCount cap if given
      if (Number.isFinite(sec.questionCount)) {
        items = items.slice(0, sec.questionCount);
      }

      // if a uniform perQuestion is set in the section, apply for display & totals
      if (Number.isFinite(sec.perQuestion)) {
        items = items.map(q => ({ ...q, marksPerQuestion: sec.perQuestion }));
      }

      return {
        heading: sec.displayTitle || key,
        items,
        perQuestion: Number.isFinite(sec.perQuestion) ? sec.perQuestion : null,
        requestedCount: Number.isFinite(sec.questionCount) ? sec.questionCount : null,
        explicitTotal: Number.isFinite(sec.totalMarks) ? sec.totalMarks : null,
      };
    });
  }

  // fallback: group by heading in stable order of appearance
  const order = [];
  const buckets = {};
  for (const q of allQs) {
    const k = normHeading(q.groupHeading);
    if (!buckets[k]) { buckets[k] = []; order.push(k); }
    buckets[k].push(q);
  }
  return order.map(k => ({ heading: k, items: buckets[k], perQuestion: null, requestedCount: null, explicitTotal: null }));
}

/** compute “n × m = T” (or a sensible fallback) */
function computeSummary(block) {
  const n = block.items.length;
  // explicit total provided by FE:
  if (Number.isFinite(block.explicitTotal) && Number.isFinite(block.perQuestion) && Number.isFinite(block.requestedCount)) {
    return `${block.requestedCount} × ${block.perQuestion} = ${block.explicitTotal}`;
  }
  // uniform per-question across items?
  const marks = block.items.map(q => q.marksPerQuestion || 1);
  const total = marks.reduce((a, b) => a + b, 0);
  const uniq = Array.from(new Set(marks));
  if (uniq.length === 1) return `${n} × ${uniq[0]} = ${total}`;
  return `${n} Qs, total = ${total}`;
}

/* -------------------- layout helpers -------------------- */
const LAYOUT = {
  page: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5"
  font: 'Times New Roman',
  titleSize: 28, // 14pt
  h1Size: 24,    // 12pt
  h2Size: 22,    // ~11pt
  bodySize: 22,  // ~11pt
};

function para(text, opts = {}) {
  const { bold = false, italics = false, size = LAYOUT.bodySize, align = AlignmentType.LEFT, after = 0, before = 0 } = opts;
  return new Paragraph({
    spacing: { after, before },
    alignment: align,
    children: [new TextRun({ text, bold, italics, size, font: LAYOUT.font })],
  });
}

function headingLine(leftText, rightText) {
  // leftText ......... rightText  (right-aligned via tab stop)
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { after: 100 },
    children: [
      new TextRun({ text: leftText, bold: true }),
      new TextRun({ text: '\t' }), // goes to the right tab stop
      new TextRun({ text: rightText, bold: true }),
    ],
  });
}

function tableTwoCols(leftTitle, leftLines = [], rightTitle, rightLines = []) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [para(leftTitle, { bold: true, after: 60 })] }),
          new TableCell({ children: [para(rightTitle, { bold: true, after: 60 })] }),
        ],
      }),
      ...Array.from({ length: Math.max(leftLines.length, rightLines.length) }).map((_, i) =>
        new TableRow({
          children: [
            new TableCell({ children: [para(leftLines[i] || '', { after: 30 })] }),
            new TableCell({ children: [para(rightLines[i] || '', { after: 30 })] }),
          ],
        })
      ),
    ],
  });
}

function defaultStem(q) {
  if (q.answerType === 'match_pairs') return 'Match the following:';
  if (q.answerType === 'ordering') return 'Arrange in chronological order:';
  if (q.answerType === 'mcq') return 'Choose the correct option:';
  if (q.items?.length) return 'Answer the following:';
  return 'Answer the following:';
}

/** Build the “answer text” for the Answer Key */
function getAnswerLine(q) {
  if (q.answerType === 'mcq') {
    const key = (q.keyAnswer ?? '').toString().trim();
    if (!key) return '—';
    const match = q.options.find(
      (o, i) =>
        o.label?.toLowerCase() === key.toLowerCase() ||
        alpha(i).toLowerCase() === key.toLowerCase()
    );
    return match ? `${match.label}. ${match.text}` : key;
  }
  if (q.answerType === 'match_pairs' && q.pairs?.length) {
    const map = q.pairs.map((_, i) => `${i + 1}-${String.fromCharCode(97 + i)}`); // 1-a,2-b...
    return map.join(', ');
  }
  if (q.answerType === 'ordering') {
    const idx = (q.correctOrderIndices || []).map(Number);
    if (idx.length) return idx.map(n => (Number.isFinite(n) ? n + 1 : n)).join(' > ');
    return '—';
  }
  return q.keyAnswer || '—';
}

/* -------------------- MAIN: build file -------------------- */

// robust page-number placeholders (works across docx versions)
const CURRENT_PAGE = PageNumber?.CURRENT || PageNumber || '{{PAGE}}';
const TOTAL_PAGES = (PageNumber && PageNumber.TOTAL_PAGES) || NumberOfTotalPages || '{{TOTAL_PAGES}}';

async function buildQuestionPaperDocx(paper, storageDir) {
  ensureDir(storageDir);

  const id = paper._id?.toString?.() || paper.id;
  const filePath = path.join(storageDir, `${id}.docx`);

  const header = [
    para(paper.schoolName || 'School Name', { bold: true, size: LAYOUT.titleSize, align: AlignmentType.CENTER, after: 60 }),
    para(paper.config?.examName || '', { bold: true, size: LAYOUT.h1Size, align: AlignmentType.CENTER, after: 60 }),
    para(
      `Subject: ${paper.config?.subject || '—'}   |   Class: ${paper.config?.class || '—'}   |   Medium: ${paper.config?.medium || '—'}`,
      { align: AlignmentType.CENTER, after: 40 }
    ),
    para(`Marks: ${paper.totalMarks ?? '—'}   |   Time: 3 Hours`, { align: AlignmentType.CENTER, after: 120 }),
  ];

  // Respect UI layout order
  const blocks = buildBlocks(paper);

  const children = [...header];

  // render each section with summary line
  blocks.forEach((block, idx) => {
    const secLabel = `${roman(idx + 1)}. ${block.heading}`;
    const summary = computeSummary(block);
    children.push(headingLine(secLabel, summary));

    block.items.forEach((q, qIdx) => {
      // “1. Question text (xM)”
      const qMarks = q.marksPerQuestion ?? 1;
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: `${qIdx + 1}. `, bold: true }),
            new TextRun({ text: (q.text || defaultStem(q)) }),
            new TextRun({ text: `   (${qMarks}M)`, bold: true }),
          ],
        })
      );

      // MCQ options
      if (q.answerType === 'mcq' && q.options?.length) {
        q.options.forEach((o, i) => {
          children.push(
            new Paragraph({
              spacing: { before: 6, after: 0 },
              children: [
                new TextRun({ text: `${labelOrAlpha(i, o.label)}. `, bold: true }),
                new TextRun({ text: o.text }),
              ],
            })
          );
        });
        children.push(para('', { after: 40 }));
      }

      // Match pairs table
      if (q.answerType === 'match_pairs' && q.pairs?.length) {
        const leftCol = q.pairs.map((p, i) => `${i + 1}. ${p.left}`);
        const rightCol = q.pairs.map((p, i) => `${String.fromCharCode(97 + i)}. ${p.right}`);
        children.push(tableTwoCols('Column A', leftCol, 'Column B', rightCol));
        children.push(para('', { after: 80 }));
      }

      // Ordering list
      if (q.answerType === 'ordering' && q.items?.length) {
        q.items.forEach((it, i) => children.push(para(`${i + 1}. ${it}`)));
        children.push(para('', { after: 60 }));
      }

      // Generic items (fill/short/etc.) without explicit q.text
      if (!q.text && q.items?.length && !['match_pairs', 'ordering', 'mcq'].includes(q.answerType)) {
        q.items.forEach((it, i) => children.push(para(`${i + 1}. ${it}`)));
        children.push(para('', { after: 60 }));
      }

      // NOTE: we purposely DO NOT add the old tag line like “[ ch1, Easy, 1M ]”
    });

    children.push(para('', { after: 100 })); // section gap
  });

  // Answer Key
  children.push(para('ANSWER KEY', { bold: true, size: LAYOUT.h1Size, after: 80 }));
  blocks.forEach((block, idx) => {
    children.push(para(`${roman(idx + 1)}. ${block.heading}`, { bold: true, size: LAYOUT.h2Size, after: 40 }));
    block.items.forEach((q, qIdx) => {
      children.push(para(`${qIdx + 1}. ${getAnswerLine(q)}`));
    });
    children.push(para('', { after: 60 }));
  });

  // Footer “Page X of Y”
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'Page ' }),
          CURRENT_PAGE,
          new TextRun({ text: ' of ' }),
          TOTAL_PAGES,
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: LAYOUT.page } },
        headers: { default: new Header({ children: [] }) },
        footers: { default: footer },
        children,
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buf);
  return `/api/lba-qp/papers/${id}/download`;
}

module.exports = { buildQuestionPaperDocx };


