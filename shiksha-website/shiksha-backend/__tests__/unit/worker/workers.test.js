// Smoke tests for worker modules. Mocks external dependencies and emits messages to parentPort to ensure handlers fire and postMessage gets called.

const workerMocks = () => {
  const listeners = {};
  const parentPort = {
    on: jest.fn((event, cb) => {
      listeners[event] = cb;
    }),
    once: jest.fn((event, cb) => {
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
    const client = {
      startSession: jest.fn(() => ({ withTransaction: async (fn) => fn(), endSession: jest.fn() })),
      close: jest.fn(),
    };
    jest.doMock("../../../config/db.js", () => ({
      getConnection: jest.fn(() => Promise.resolve(client)),
      connectToMongoForWorker: jest.fn(() => Promise.resolve({ client, openedHere: true })),
    }));
  };

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

});
