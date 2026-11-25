const mockState = { docs: [], filter: {}, limit: 0, sort: null, projection: null };

jest.mock("../../../models/question.bank.cache.summary.model", () => {
  const matches = (doc, filter) => {
    if (filter.isCacheUpdated !== undefined && doc.isCacheUpdated !== filter.isCacheUpdated) return false;
    if (filter.inProgress !== undefined && doc.inProgress !== filter.inProgress) return false;
    if (filter._id && filter._id.$gt && String(doc._id) <= String(filter._id.$gt)) return false;
    return true;
  };

  const chain = {
    select: jest.fn((projection) => {
      mockState.projection = projection;
      return chain;
    }),
    sort: jest.fn((spec) => {
      mockState.sort = spec;
      return chain;
    }),
    limit: jest.fn((size) => {
      mockState.limit = size;
      return chain;
    }),
    lean: jest.fn(async () => mockState.docs.filter((doc) => matches(doc, mockState.filter)).slice(0, mockState.limit)),
  };

  return {
    find: jest.fn((filter) => {
      mockState.filter = filter;
      return chain;
    }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  };
});

jest.mock("../../../models/question.bank.cache.model.js", () => ({ findByIdAndUpdate: jest.fn() }));
jest.mock("../../../helper/question.bank.cache.helper", () => ({ fixObjectIdsInArray: (value) => value }));

jest.mock("p-queue", () => ({
  default: class FakeQueue {
    add(task) {
      return Promise.resolve().then(task);
    }
  },
}));

jest.mock("../../../config/loggers", () => ({ info: jest.fn(), error: jest.fn(), warn: jest.fn() }));

process.env.CACHE_RETRY_BATCH_SIZE = "5";

const logger = require("../../../config/loggers");
const QuestionBankCacheSummary = require("../../../models/question.bank.cache.summary.model");
const { requeueFailedJobs } = require("../../../managers/cache.queue.manager");

function summary(index, overrides = {}) {
  return {
    _id: { toString: () => `summary-${String(index).padStart(3, "0")}` },
    isCacheUpdated: false,
    inProgress: false,
    notFoundQuestions: [],
    processedCache: [],
    unitLevel: "CHAPTER",
    aiQuestionsForCache: [],
    ...overrides,
  };
}

describe("requeueFailedJobs", () => {
  beforeEach(() => {
    mockState.docs = [];
    mockState.filter = {};
    mockState.limit = 0;
    QuestionBankCacheSummary.findByIdAndUpdate.mockReset();
    QuestionBankCacheSummary.findByIdAndUpdate.mockResolvedValue({});
    QuestionBankCacheSummary.find.mockClear();
    logger.error.mockClear();
    logger.info.mockClear();
  });

  it("requeues every pending summary and nothing else", async () => {
    for (let i = 0; i < 23; i++) mockState.docs.push(summary(i));
    mockState.docs.push(summary(90, { isCacheUpdated: true }));
    mockState.docs.push(summary(91, { inProgress: true }));

    await requeueFailedJobs();

    const requeued = new Set(QuestionBankCacheSummary.findByIdAndUpdate.mock.calls.map((call) => call[0]));
    const pending = mockState.docs.filter((doc) => !doc.isCacheUpdated && !doc.inProgress).map((doc) => doc._id.toString());
    expect([...requeued].sort()).toEqual([...new Set(pending)].sort());
  });

  it("pages with a keyset instead of loading every pending summary at once", async () => {
    for (let i = 0; i < 12; i++) mockState.docs.push(summary(i));

    await requeueFailedJobs();

    expect(QuestionBankCacheSummary.find).toHaveBeenCalledTimes(4);
    const filters = QuestionBankCacheSummary.find.mock.calls.map((call) => call[0]);
    expect(filters[0]).toEqual({ isCacheUpdated: false, inProgress: false });
    expect(Object.keys(filters[1]._id)).toEqual(["$gt"]);
    expect(mockState.limit).toBe(5);
    expect(mockState.sort).toEqual({ _id: 1 });
  });

  it("refuses to load when the batch size is invalid", () => {
    process.env.CACHE_RETRY_BATCH_SIZE = "abc";
    try {
      jest.isolateModules(() => {
        expect(() => require("../../../managers/cache.queue.manager")).toThrow(/CACHE_RETRY_BATCH_SIZE is "abc"/);
      });
    } finally {
      process.env.CACHE_RETRY_BATCH_SIZE = "5";
    }
  });

  it("never loads the full paper payload", async () => {
    mockState.docs.push(summary(0));

    await requeueFailedJobs();

    expect(mockState.projection).toBe("notFoundQuestions processedCache unitLevel aiQuestionsForCache");
  });

  it("does nothing when no summary is pending", async () => {
    await requeueFailedJobs();

    expect(QuestionBankCacheSummary.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("keeps sweeping after a job fails", async () => {
    mockState.docs.push(summary(0), summary(1));
    QuestionBankCacheSummary.findByIdAndUpdate.mockRejectedValue(new Error("Mongo write failed"));

    await expect(requeueFailedJobs()).resolves.toBeUndefined();

    const attempted = new Set(QuestionBankCacheSummary.findByIdAndUpdate.mock.calls.map((call) => call[0]));
    expect(attempted).toEqual(new Set(["summary-000", "summary-001"]));
    expect(QuestionBankCacheSummary.find).toHaveBeenCalledTimes(2);
    expect(logger.error).toHaveBeenCalledWith("Cache retry job failed", expect.objectContaining({ cacheSummaryId: "summary-000" }));
    expect(logger.info).toHaveBeenCalledWith("Cache retry sweep finished", { rejected: 2 });
  });
});
