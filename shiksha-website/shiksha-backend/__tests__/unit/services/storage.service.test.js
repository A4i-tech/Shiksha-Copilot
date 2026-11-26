const providerPaths = { "object-store": "../../../services/object.store.blob.service", azure: "../../../services/azure.blob.service" };

describe("storage.service", () => {
  let loaded;

  beforeEach(() => {
    jest.resetModules();
    Object.values(providerPaths).forEach((path) => jest.dontMock(path));
    loaded = [];
    Object.entries(providerPaths).forEach(([name, path]) => {
      jest.doMock(path, () => {
        loaded.push(name);
        return { container: name, upload: jest.fn(), remove: jest.fn(), getPreSignedUrl: jest.fn(async () => name) };
      });
    });
    delete process.env.STORAGE_BACKEND;
  });

  afterAll(() => {
    delete process.env.STORAGE_BACKEND;
  });

  it.each([undefined, ""])("throws at require when STORAGE_BACKEND is %p and loads no provider", (value) => {
    if (value !== undefined) process.env.STORAGE_BACKEND = value;

    expect(() => require("../../../services/storage.service")).toThrow('STORAGE_BACKEND is unset. Set STORAGE_BACKEND to "object-store" or "azure"');
    expect(loaded).toEqual([]);
  });

  it.each(["object-store", "azure"])("loads only the %s provider when STORAGE_BACKEND=%s", (backend) => {
    process.env.STORAGE_BACKEND = backend;

    require("../../../services/storage.service");

    expect(loaded).toEqual([backend]);
  });

  it.each(["Azure", "OBJECT-STORE"])("throws at require for STORAGE_BACKEND %p because the match is exact", (value) => {
    process.env.STORAGE_BACKEND = value;

    expect(() => require("../../../services/storage.service")).toThrow(`STORAGE_BACKEND is "${value}"`);
    expect(loaded).toEqual([]);
  });

  it("throws at require for an unknown STORAGE_BACKEND and loads no provider", () => {
    process.env.STORAGE_BACKEND = "gcs";

    expect(() => require("../../../services/storage.service")).toThrow('STORAGE_BACKEND is "gcs"');
    expect(loaded).toEqual([]);
  });

  it.each([
    ["raw-blob-name.png", "raw-blob-name.png"],
    ["https://host/azure/raw%20name.png", "raw name.png"],
  ])("deleteFromStorage maps %s to blob name %s", async (ref, name) => {
    process.env.STORAGE_BACKEND = "azure";
    const provider = require("../../../services/azure.blob.service");

    await require("../../../services/storage.service").deleteFromStorage(ref);

    expect(provider.remove).toHaveBeenCalledWith(name);
  });
});
