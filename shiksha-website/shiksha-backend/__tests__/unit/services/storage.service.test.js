const callers = [
  "../../../helper/profile.helper",
  "../../../helper/excel.export.helper",
  "../../../managers/user.manager",
  "../../../managers/question.bank.manager",
  "../../../controllers/teacher.training.batch.controller",
  "../../../controllers/devtools.controller",
];

describe("storage.service", () => {
  beforeEach(() => {
    jest.resetModules();
    // doMock registrations outlive resetModules, so clear them between tests.
    ["../../../services/s3.blob.service", "../../../services/azure.blob.service"].forEach((path) => jest.dontMock(path));
    delete process.env.STORAGE_BACKEND;
  });

  afterAll(() => {
    delete process.env.STORAGE_BACKEND;
  });

  describe("without the @azure/storage-blob package", () => {
    beforeEach(() => {
      process.env.STORAGE_BACKEND = "s3";
      jest.doMock(
        "@azure/storage-blob",
        () => {
          throw Object.assign(new Error("Cannot find module '@azure/storage-blob'"), { code: "MODULE_NOT_FOUND" });
        },
        { virtual: true }
      );
    });

    it("blocks the package for this test", () => {
      expect(() => require("@azure/storage-blob")).toThrow("Cannot find module");
    });

    it("loads the selector and every caller that imports it", () => {
      expect(() => require("../../../services/storage.service")).not.toThrow();
      callers.forEach((caller) => expect(() => require(caller)).not.toThrow());
    });

    it("fails a call with STORAGE_BACKEND=azure and names the fix", async () => {
      process.env.STORAGE_BACKEND = "azure";
      const { getPreSignedProfileImageUrl } = require("../../../services/storage.service");

      await expect(getPreSignedProfileImageUrl("user-1")).rejects.toThrow(
        "STORAGE_BACKEND=azure needs the @azure/storage-blob package, and it is not installed. Run npm install @azure/storage-blob or use STORAGE_BACKEND=s3."
      );
    });
  });

  describe("provider selection", () => {
    const mockProvider = (path, marker) => {
      jest.doMock(path, () => ({
        uploadToStorage: jest.fn(async () => marker),
        uploadStreamToStorage: jest.fn(),
        deleteFromStorage: jest.fn(),
        getPreSignedProfileImageUrl: jest.fn(),
        getPreSignedFileUrl: jest.fn(),
        getBlobContent: jest.fn(),
      }));
    };

    beforeEach(() => {
      mockProvider("../../../services/s3.blob.service", "s3");
      mockProvider("../../../services/azure.blob.service", "azure");
    });

    it("uses s3 when STORAGE_BACKEND is not set", async () => {
      const storage = require("../../../services/storage.service");

      await expect(storage.uploadToStorage()).resolves.toBe("s3");
    });

    it("uses azure when STORAGE_BACKEND=azure", async () => {
      process.env.STORAGE_BACKEND = "azure";
      const storage = require("../../../services/storage.service");

      await expect(storage.uploadToStorage()).resolves.toBe("azure");
    });

    it("rejects an unknown STORAGE_BACKEND and lists the valid values", async () => {
      process.env.STORAGE_BACKEND = "gcs";
      const storage = require("../../../services/storage.service");

      await expect(storage.uploadToStorage()).rejects.toThrow('STORAGE_BACKEND=gcs is not supported. Set STORAGE_BACKEND to "s3" or "azure".');
    });
  });

  describe("s3 provider settings", () => {
    const validSettings = {
      S3_BUCKET_NAME: "doc-pro",
      S3_ENDPOINT_URL: "http://localhost:9000",
      S3_ACCESS_KEY_ID: "key",
      S3_SECRET_ACCESS_KEY: "secret",
    };

    afterEach(() => {
      Object.keys(validSettings).forEach((name) => delete process.env[name]);
    });

    it.each([
      ["no bucket name", { S3_BUCKET_NAME: undefined }, "STORAGE_BACKEND=s3 needs S3_BUCKET_NAME. Set S3_BUCKET_NAME to the bucket name or use STORAGE_BACKEND=azure."],
      ["no access key", { S3_ACCESS_KEY_ID: undefined }, "STORAGE_BACKEND=s3 needs S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY. Set both or use STORAGE_BACKEND=azure."],
      ["an endpoint that is not a URL", { S3_ENDPOINT_URL: "localhost:9000" }, 'S3_ENDPOINT_URL "localhost:9000" is not a URL. Set S3_ENDPOINT_URL to a full URL such as http://localhost:9000.'],
    ])("rejects a call with %s and names the fix", async (_label, override, message) => {
      Object.entries({ ...validSettings, ...override }).forEach(([name, value]) => {
        if (value === undefined) delete process.env[name];
        else process.env[name] = value;
      });
      const { getPreSignedProfileImageUrl } = require("../../../services/s3.blob.service");

      await expect(getPreSignedProfileImageUrl("user-1")).rejects.toThrow(message);
    });
  });
});
