jest.mock("fs", () => ({
  existsSync: jest.fn(() => false),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock("docx", () => {
  class Generic {
    constructor(opts) {
      this.opts = opts;
    }
  }
  const simple = (name) =>
    class extends Generic {
      static name = name;
    };
  const Paragraph = simple("Paragraph");
  const TextRun = simple("TextRun");
  const Table = simple("Table");
  const TableRow = simple("TableRow");
  const TableCell = simple("TableCell");
  const Header = simple("Header");
  const Footer = simple("Footer");
  const Document = simple("Document");
  const Packer = {
    toBuffer: jest.fn(() => Promise.resolve(Buffer.from("doc"))),
  };
  const AlignmentType = { CENTER: "CENTER", JUSTIFIED: "JUSTIFIED" };
  const WidthType = { PERCENTAGE: "PERCENTAGE" };
  const PageNumber = { CURRENT: "CURRENT", TOTAL_PAGES: "TOTAL" };
  const NumberOfTotalPages = "TOTAL";
  const TabStopType = { RIGHT: "RIGHT" };
  const TabStopPosition = { MAX: 9999 };
  return {
    AlignmentType,
    WidthType,
    PageNumber,
    NumberOfTotalPages,
    TabStopType,
    TabStopPosition,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    Header,
    Footer,
    Document,
    Packer,
  };
});

let fs;

describe("lba.qpaper.docx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    fs = require("fs");
  });

  it("builds question paper docx and writes file", async () => {
    const {
      buildQuestionPaperDocx,
    } = require("../../../services/lba.qpaper.docx");
    const paper = {
      _id: "123",
      schoolName: "Test School",
      config: {
        examName: "Midterm",
        subject: "Math",
        class: "5",
        medium: "EN",
      },
      totalMarks: 10,
      questions: [
        {
          text: "What is 2+2?",
          marksPerQuestion: 2,
          options: ["1", "2", "3", "4"],
          keyAnswer: "4",
        },
      ],
    };

    const url = await buildQuestionPaperDocx(paper, "/tmp");

    expect(fs.existsSync).toHaveBeenCalledWith("/tmp");
    expect(fs.mkdirSync).toHaveBeenCalledWith("/tmp", { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(url).toBe("/api/lba-qp/papers/123/download");
  });
});
