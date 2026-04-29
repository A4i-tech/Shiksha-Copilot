// Smoke tests for worker modules. Mocks external dependencies and emits messages to parentPort to ensure handlers fire and postMessage gets called.

const workerMocks = () => {
  const listeners = {};
  const parentPort = {
    on: jest.fn((event, cb) => {
      listeners[event] = cb;
    }),
    postMessage: jest.fn(),
    emit: async (event, payload) => {
      if (listeners[event]) {
        await listeners[event](payload);
      }
    },
  };
  return { parentPort, listeners };
};

// Shared express-like workbook mocks
const makeExcelMock = () => {
  const worksheets = {};
  return {
    Workbook: class {
      constructor() {
        this.xlsx = {
          load: jest.fn(() => Promise.resolve()),
          writeBuffer: jest.fn(() => Promise.resolve(Buffer.from("buf"))),
        };
      }
      addWorksheet(name) {
        const sheet = makeWorksheet();
        worksheets[name] = sheet;
        return sheet;
      }
      getWorksheet(name) {
        return worksheets[name];
      }
    },
  };
};

const makeWorksheet = () => {
  const rows = [];
  return {
    columns: [],
    addRow: (row) => rows.push(row),
    getRow: () => ({ eachCell: (cb) => cb({}) }),
    eachRow: ({}, cb) => {
      rows.forEach((r, idx) => cb(r, idx + 1));
    },
    get rows() {
      return rows;
    },
  };
};

describe("worker modules", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  const mockDbSimple = () => {
    jest.doMock("../../../config/db.js", () => ({
      getConnection: jest.fn(() =>
        Promise.resolve({
          startSession: jest.fn(() => ({
            withTransaction: async (fn) => fn(),
            endSession: jest.fn(),
          })),
          close: jest.fn(),
        })
      ),
      connectToMongoForWorker: jest.fn(() =>
        Promise.resolve({ client: { close: jest.fn() }, openedHere: true })
      ),
    }));
  };

  it("exportcontentactivityworker posts success message", async () => {
    const { parentPort } = workerMocks();
    jest.doMock("worker_threads", () => ({ parentPort }));
    jest.doMock("exceljs", () => makeExcelMock());
    mockDbSimple();
    const uploadToStorage = jest.fn(() => Promise.resolve("url"));
    jest.doMock("../../../services/e2e.storage.service", () => ({
      uploadToStorage,
    }));
    const create = jest.fn(() => Promise.resolve());
    jest.doMock("../../../models/audit.log.model", () => ({ create }));

    require("../../../worker/exportcontentactivityworker");
    await Promise.resolve();

    await parentPort.emit("message", {
      contentActivities: [
        {
          userName: "u",
          genContent: "c",
          createdAt: "now",
          teacherLessonPlanStatus: "done",
        },
      ],
      userId: "1",
      userName: "tester",
    });

    expect(uploadToStorage).toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
    expect(parentPort.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it("exportschoolworker posts success message", async () => {
    const { parentPort } = workerMocks();
    jest.doMock("worker_threads", () => ({ parentPort }));
    jest.doMock("exceljs", () => makeExcelMock());
    mockDbSimple();
    const uploadToStorage = jest.fn(() => Promise.resolve("url"));
    jest.doMock("../../../services/azure.blob.service", () => ({
      uploadToStorage,
    }));
    const create = jest.fn(() => Promise.resolve());
    jest.doMock("../../../models/audit.log.model", () => ({ create }));

    require("../../../worker/exportschoolworker");
    await Promise.resolve();

    await parentPort.emit("message", {
      schools: [
        {
          schoolId: "s1",
          name: "Sch",
          state: "st",
          zone: "z",
          district: "d",
          block: "b",
          isDeleted: false,
        },
      ],
      userId: "1",
      userName: "tester",
    });

    expect(uploadToStorage).toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
    expect(parentPort.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it("exportuserworker posts success message", async () => {
    const { parentPort } = workerMocks();
    jest.doMock("worker_threads", () => ({ parentPort }));
    jest.doMock("exceljs", () => makeExcelMock());
    mockDbSimple();
    const uploadToStorage = jest.fn(() => Promise.resolve("url"));
    jest.doMock("../../../services/azure.blob.service", () => ({
      uploadToStorage,
    }));
    const create = jest.fn(() => Promise.resolve());
    jest.doMock("../../../models/audit.log.model", () => ({ create }));

    require("../../../worker/exportuserworker");
    await Promise.resolve();

    await parentPort.emit("message", {
      users: [
        {
          name: "T",
          school: { name: "S" },
          phone: "1",
          role: ["teacher"],
          isDeleted: false,
          trainingStatus: "trained",
        },
      ],
      userId: "1",
      userName: "tester",
    });

    expect(uploadToStorage).toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
    expect(parentPort.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it("updatequestionbankcacheworker posts success", async () => {
    const { parentPort } = workerMocks();
    jest.doMock("worker_threads", () => ({ parentPort }));
    mockDbSimple();
    jest.doMock("../../../helper/question.bank.cache.helper", () => ({
      createQuestionObj: jest.fn((t, m, q) => ({
        type: t,
        marks: m,
        question: q.question,
      })),
      fixObjectIdsInArray: jest.fn((arr) => arr),
    }));
    jest.doMock("../../../models/question.bank.cache.model.js", () => {
      function QuestionBankCache(doc) {
        this.doc = doc;
        this.save = jest.fn(() => Promise.resolve(doc));
      }
      QuestionBankCache.findByIdAndUpdate = jest.fn(() => Promise.resolve({}));
      return QuestionBankCache;
    });
    jest.doMock("../../../models/question.bank.cache.summary.model.js", () => ({
      findByIdAndUpdate: jest.fn(() => Promise.resolve()),
    }));

    require("../../../worker/updatequestionbankcacheworker");

    await parentPort.emit("message", {
      notFoundQuestions: [
        {
          type: "mcq",
          marks_per_question: 1,
          question_distribution: [{ unit_name: "U1", objective: "objective" }],
        },
      ],
      processedCache: [
        {
          unitName: "U1",
          unitLevel: "lvl",
          questions: [],
        },
      ],
      unitLevel: "lvl",
      newResQuestions: [{ questions: [{ question: "Q1" }] }],
      cacheSummaryId: "sum1",
    });

    expect(parentPort.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it("bulkuploadworker posts validation error message", async () => {
    const { parentPort } = workerMocks();
    jest.doMock("worker_threads", () => ({ parentPort }));
    mockDbSimple();
    jest.doMock("exceljs", () => ({
      Workbook: class {
        constructor() {
          this.xlsx = {
            load: jest.fn(() => Promise.resolve()),
            writeBuffer: jest.fn(() => Promise.resolve(Buffer.from("buf"))),
          };
        }
        addWorksheet() {
          return makeWorksheet();
        }
        getWorksheet() {
          const row = {
            values: [null, "id1", "name1"],
            getCell: (idx) => ({
              value: idx === 1 ? "id1" : idx === 2 ? "name" : "x",
            }),
          };
          return {
            eachRow: ({}, cb) => cb(row, 2),
          };
        }
      },
    }));
    jest.doMock("../../../models/school.model", () => ({
      find: jest.fn(() => Promise.resolve([])),
    }));
    jest.doMock("../../../managers/school.manager", () => {
      return jest
        .fn()
        .mockImplementation(() => ({
          create: jest.fn(() => Promise.resolve({ success: true })),
        }));
    });
    jest.doMock("../../../validations/school.validation", () => ({
      schoolSchema: {
        validate: jest.fn(() => ({ error: { message: "bad" } })),
      },
    }));
    jest.doMock("../../../validations/school.class.validation", () => ({
      classSchema: { validate: jest.fn(() => ({ error: null })) },
    }));
    jest.doMock("../../../helper/region.helper", () =>
      jest.fn(() => Promise.resolve({ error: false }))
    );
    const uploadToStorage = jest.fn(() => Promise.resolve("url"));
    jest.doMock("../../../services/azure.blob.service", () => ({
      uploadToStorage,
    }));
    jest.doMock("../../../models/audit.log.model", () => ({
      create: jest.fn(() => Promise.resolve()),
    }));

    require("../../../worker/bulkuploadworker");
    await Promise.resolve();

    await parentPort.emit("message", {
      fileBuffer: Buffer.from("buf"),
      userId: "1",
      userName: "tester",
    });

    expect(uploadToStorage).toHaveBeenCalled();
    expect(parentPort.postMessage).toHaveBeenCalled();
  });

  it("userworker posts success when data valid", async () => {
    const { parentPort } = workerMocks();
    jest.doMock("worker_threads", () => ({
      parentPort,
      workerData: {
        worksheetData: [
          { name: "A", phone: "1", school: "101", role: ["teacher"] },
        ],
        userId: "u1",
        userName: "tester",
      },
    }));
    mockDbSimple();
    jest.doMock("exceljs", () => makeExcelMock());
    jest.doMock("../../../helper/worker.helper", () => ({
      sendWelcomeSMS: jest.fn(() => Promise.resolve()),
    }));
    jest.doMock("../../../models/user.model", () => ({
      findOne: jest.fn(() => Promise.resolve(null)),
      insertMany: jest.fn((rows) => Promise.resolve(rows)),
    }));
    jest.doMock("../../../models/school.model", () => ({
      findOne: jest.fn(() =>
        Promise.resolve({
          _id: "s1",
          state: "st",
          zone: "z",
          district: "d",
          block: "b",
        })
      ),
    }));
    jest.doMock("../../../validations/user.validation", () => ({
      bulkUploadSchema: { validate: jest.fn(() => ({ error: null })) },
    }));
    jest.doMock("../../../services/azure.blob.service", () => ({
      uploadToStorage: jest.fn(() => Promise.resolve("url")),
    }));
    jest.doMock("../../../models/audit.log.model", () => ({
      create: jest.fn(() => Promise.resolve()),
    }));

    require("../../../worker/userworker");

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(parentPort.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });
});
