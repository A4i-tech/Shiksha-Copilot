const providerPaths = { s3: "../../../services/s3.blob.service", azure: "../../../services/azure.blob.service" };

describe("storage.service", () => {
  let loaded;

  beforeEach(() => {
    jest.resetModules();
    Object.values(providerPaths).forEach((path) => jest.dontMock(path));
    loaded = [];
    Object.entries(providerPaths).forEach(([name, path]) => {
      jest.doMock(path, () => {
        loaded.push(name);
        return { container: name, upload: jest.fn(), getPreSignedUrl: jest.fn(async () => name) };
      });
    });
    delete process.env.STORAGE_BACKEND;
  });

  afterAll(() => {
    delete process.env.STORAGE_BACKEND;
  });

  it("uses s3 when STORAGE_BACKEND is not set", () => {
    require("../../../services/storage.service");

    expect(loaded).toEqual(["s3"]);
  });

  it.each(["s3", "azure"])("loads only the %s provider when STORAGE_BACKEND=%s", (backend) => {
    process.env.STORAGE_BACKEND = backend;

    require("../../../services/storage.service");

    expect(loaded).toEqual([backend]);
  });

  it("throws at require for an unknown STORAGE_BACKEND and loads no provider", () => {
    process.env.STORAGE_BACKEND = "gcs";

    expect(() => require("../../../services/storage.service")).toThrow("STORAGE_BACKEND=gcs is not supported");
    expect(loaded).toEqual([]);
  });
});
