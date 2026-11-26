const ChapterDao = require("../../../dao/chapter.dao");
const chapterAggregation = require("../../../aggregation/chapter.aggregation");

describe("ChapterDao getAllForExport", () => {
  afterEach(() => jest.restoreAllMocks());

  it("applies the same filter rules as the list and passes the limit and sort, without a facet", async () => {
    jest.spyOn(chapterAggregation, "getChapterExport").mockResolvedValue([]);

    await new ChapterDao().getAllForExport(10001, { standard: "10", subject: "maths" }, { createdAt: -1 }, { isDeleted: true, status: "draft" });

    expect(chapterAggregation.getChapterExport).toHaveBeenCalledWith(
      10001,
      { standard: 10, "subject.subjectName": "maths", isDeleted: true, status: "draft" },
      { createdAt: -1 }
    );
  });
});
