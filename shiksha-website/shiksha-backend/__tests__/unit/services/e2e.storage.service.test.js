jest.mock("minio", () => {
  const client = {
    bucketExists: jest.fn(),
    makeBucket: jest.fn(),
    putObject: jest.fn(),
    presignedUrl: jest.fn(),
  };
  return { Client: jest.fn(() => client) };
});

describe("e2e.storage.service", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.E2E_STORAGE_URL = "minio.local";
    process.env.E2E_STORAGE_ACCESS_KEY = "key";
    process.env.E2E_STORAGE_SECRET_KEY = "secret";
    process.env.E2E_STORAGE_BUCKET = "bucket";
  });

  it("creates bucket when missing and uploads", async () => {
    const service = require("../../../services/e2e.storage.service");
    const minio = require("minio");
    const client = new minio.Client();
    client.bucketExists.mockResolvedValue(false);
    client.putObject.mockResolvedValue();
    client.presignedUrl.mockResolvedValue("http://url/file");

    const url = await service.uploadToStorage(
      Buffer.from("data"),
      "file.txt",
      "text/plain"
    );

    expect(client.bucketExists).toHaveBeenCalledWith("bucket");
    expect(client.makeBucket).toHaveBeenCalled();
    expect(client.putObject).toHaveBeenCalledWith(
      "bucket",
      "file.txt",
      Buffer.from("data"),
      { "Content-Type": "text/plain" }
    );
    expect(url).toBe("http://url/file");
  });

  it("returns presigned profile image url", async () => {
    const service = require("../../../services/e2e.storage.service");
    const minio = require("minio");
    const client = new minio.Client();
    client.presignedUrl.mockResolvedValue("http://url/profile");

    const url = await service.getPreSignedProfileImageUrl("user-1");

    expect(client.presignedUrl).toHaveBeenCalledWith(
      "GET",
      "bucket",
      "user-1_photo",
      604800
    );
    expect(url).toBe("http://url/profile");
  });

  it("returns presigned file url from file path", async () => {
    const service = require("../../../services/e2e.storage.service");
    const minio = require("minio");
    const client = new minio.Client();
    client.presignedUrl.mockResolvedValue("http://url/file.pdf");

    const url = await service.getPreSignedFileUrl(
      "https://example.com/path/to/file.pdf"
    );

    expect(client.presignedUrl).toHaveBeenCalledWith(
      "GET",
      "bucket",
      "file.pdf",
      604800
    );
    expect(url).toBe("http://url/file.pdf");
  });
});
