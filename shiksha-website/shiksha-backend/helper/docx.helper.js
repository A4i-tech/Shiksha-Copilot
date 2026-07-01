function combineMarkdown(lessonPlan) {
  const sections = lessonPlan.sections;
  const chapterDetails = lessonPlan?.lesson?.chapter;
  const learningOutcomes = lessonPlan?.learningOutcomes || [];

  const chapterTable = createMarkdownTable([
    {
      Board: `${chapterDetails?.board}`,
      Medium: `${chapterDetails?.medium}`,
      Class: `${lessonPlan?.lesson?.class}`,
      Subject: `${lessonPlan?.lesson?.subject}`,
      Chapter: `${chapterDetails?.topics}`,
      Subtopic: `${lessonPlan?.lesson?.subTopics.join(", ")}`,
    },
  ]);

  // start markdown with the table on top
  let output = chapterTable + "\n\n";

  if (learningOutcomes.length > 0) {
    output += `## Learning Outcomes\n\n`;
    output += learningOutcomes
      .map((outcome) => `- ${outcome.trim()}`)
      .join("\n");
    output += "\n\n";
  }

  output += sections
    .filter((e) => e.id !== "section_checklist")
    .map((section) => {
      const heading = `## ${getSectionTitle(section.id, sections)}\n\n`;
      const content = section.content || "";
      return heading + content.trim() + "\n\n";
    })
    .join("\n");

  return output;
}

function getSectionTitle(sectionId, sections) {
  return sections.find((e) => e.id === sectionId)?.title;
}

function createMarkdownTable(rows) {
  if (!rows || rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const headerRow = `| ${headers.join(" | ")} |`;
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
  const dataRows = rows
    .map((row) => `| ${headers.map((h) => row[h] ?? "").join(" | ")} |`)
    .join("\n");
  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}

module.exports = { combineMarkdown };
