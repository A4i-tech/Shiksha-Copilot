const path = require("path");

jest.mock("@azure/storage-blob", () => {
  const containerClient = {
    exists: jest.fn(),
    create: jest.fn(),
    getBlockBlobClient: jest.fn(),
  };
  const delegationKey = { key: "delegation-key" };
  const blobServiceClient = {
    getContainerClient: jest.fn(() => containerClient),
    getUserDelegationKey: jest.fn(() => Promise.resolve(delegationKey)),
  };
  const blockBlobClient = { uploadData: jest.fn() };
  containerClient.getBlockBlobClient.mockReturnValue(blockBlobClient);

  const generateBlobSASQueryParameters = jest.fn((_, __, ___) => ({
    toString: () => "sas-token",
  }));

  const BlobSASPermissions = { parse: jest.fn(() => ({})) };

  class BlobServiceClient {
    constructor() {
      return blobServiceClient;
    }
  }

  return {
    BlobServiceClient,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
  };
});

jest.mock("@azure/identity", () => ({ DefaultAzureCredential: jest.fn() }));

describe("azure.blob.service", () => {
  const accountName = "testaccount";
  const containerName = "testcontainer";

  beforeEach(() => {
    jest.resetModules();
    process.env.AZURE_STORAGE_ACCOUNT_NAME = accountName;
    process.env.AZURE_STORAGE_CONTAINER_NAME = containerName;
  });

  it("uploads to storage and returns presigned url (creates container when missing)", async () => {
    const service = require("../../../services/azure.blob.service");
    const { BlobServiceClient } = require("@azure/storage-blob");
    const blobServiceClient = new BlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient();
    containerClient.exists.mockResolvedValue(false);
    const blockBlobClient = containerClient.getBlockBlobClient();
    blockBlobClient.uploadData.mockResolvedValue();

    const url = await service.uploadToStorage(
      Buffer.from("data"),
      "file.txt",
      "text/plain"
    );

    expect(containerClient.create).toHaveBeenCalled();
    expect(blockBlobClient.uploadData).toHaveBeenCalledWith(
      Buffer.from("data"),
      {
        blobHTTPHeaders: { blobContentType: "text/plain" },
      }
    );
    expect(url).toBe(
      `https://${accountName}.blob.core.windows.net/${containerName}/file.txt?sas-token`
    );
  });

  it("returns profile image presigned url", async () => {
    const service = require("../../../services/azure.blob.service");
    const url = await service.getPreSignedProfileImageUrl("user-1");
    expect(url).toBe(
      `https://${accountName}.blob.core.windows.net/${containerName}/user-1_photo?sas-token`
    );
  });

  it("returns generic file presigned url from file path", async () => {
    const service = require("../../../services/azure.blob.service");
    const url = await service.getPreSignedFileUrl(
      "https://domain.com/path/to/my%20file.pdf"
    );
    expect(url).toBe(
      `https://${accountName}.blob.core.windows.net/${containerName}/my file.pdf?sas-token`
    );
  });
});
