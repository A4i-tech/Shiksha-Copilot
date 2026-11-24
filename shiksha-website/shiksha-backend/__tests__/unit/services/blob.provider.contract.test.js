const { PassThrough } = require("stream");
const { randomUUID } = require("crypto");

const ENDPOINT = process.env.OBJECT_STORE_TEST_ENDPOINT_URL || "http://localhost:9000";
const ACCESS_KEY = process.env.OBJECT_STORE_TEST_ACCESS_KEY_ID || "test-access-key";
const SECRET_KEY = process.env.OBJECT_STORE_TEST_SECRET_ACCESS_KEY || "test-secret-key";
const BUCKET = process.env.OBJECT_STORE_TEST_BUCKET_NAME || "doc-pro";
const SEVEN_DAYS = 7 * 24 * 60 * 60;
const STORAGE = "../../../services/storage.service";

const runObjectStore = process.env.OBJECT_STORE_TESTS === "true";

jest.mock(
  "@azure/storage-blob",
  () => {
    const store = new Map();
    const sasCalls = [];
    const delegationKey = { key: "delegation-key" };
    const blobClient = (name) => ({
      uploadData: async (data) => store.set(name, Buffer.from(data)),
      uploadStream: async (stream, _size, _concurrency, options) => {
        const chunks = [];
        let loadedBytes = 0;
        for await (const chunk of stream) {
          chunks.push(chunk);
          loadedBytes += chunk.length;
          options.onProgress({ loadedBytes });
        }
        store.set(name, Buffer.concat(chunks));
      },
      downloadToBuffer: async () => {
        if (!store.has(name)) throw Object.assign(new Error("not found"), { statusCode: 404 });
        return store.get(name);
      },
    });
    const containerClient = {
      url: "https://testaccount.blob.core.windows.net/testcontainer",
      createIfNotExists: async () => {},
      getBlockBlobClient: blobClient,
      deleteBlob: async (name) => {
        if (!store.delete(name)) throw Object.assign(new Error("not found"), { statusCode: 404 });
      },
    };
    const blobServiceClient = {
      getContainerClient: () => containerClient,
      getUserDelegationKey: async () => delegationKey,
    };
    class BlobServiceClient {
      constructor() {
        return blobServiceClient;
      }
      static fromConnectionString() {
        return blobServiceClient;
      }
    }
    class StorageSharedKeyCredential {
      constructor(accountName, accountKey) {
        this.accountName = accountName;
        this.accountKey = accountKey;
      }
    }
    return {
      BlobServiceClient,
      StorageSharedKeyCredential,
      BlobSASPermissions: { parse: () => ({}) },
      generateBlobSASQueryParameters: (options, credential, accountName) => {
        sasCalls.push({ options, credential, accountName });
        return { toString: () => "sas-token" };
      },
      __store: store,
      __sasCalls: sasCalls,
      __delegationKey: delegationKey,
    };
  },
  { virtual: true }
);

jest.mock("@azure/identity", () => ({ DefaultAzureCredential: jest.fn() }));

const ENV_KEYS = [
  "STORAGE_BACKEND",
  "OBJECT_STORE_ENDPOINT_URL",
  "OBJECT_STORE_PUBLIC_ENDPOINT_URL",
  "OBJECT_STORE_ACCESS_KEY_ID",
  "OBJECT_STORE_SECRET_ACCESS_KEY",
  "OBJECT_STORE_BUCKET_NAME",
  "OBJECT_STORE_REGION",
  "AZURE_STORAGE_CONNECTION_STRING",
  "AZURE_STORAGE_ACCOUNT_NAME",
  "AZURE_STORAGE_CONTAINER_NAME",
];
const savedEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

const resetEnv = () => {
  ENV_KEYS.forEach((key) => {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  });
};

const setBackendEnv = (backend) => {
  ENV_KEYS.forEach((key) => delete process.env[key]);
  process.env.STORAGE_BACKEND = backend;
  if (backend === "object-store") {
    process.env.OBJECT_STORE_ENDPOINT_URL = ENDPOINT;
    process.env.OBJECT_STORE_ACCESS_KEY_ID = ACCESS_KEY;
    process.env.OBJECT_STORE_SECRET_ACCESS_KEY = SECRET_KEY;
    process.env.OBJECT_STORE_BUCKET_NAME = BUCKET;
  } else {
    process.env.AZURE_STORAGE_ACCOUNT_NAME = "testaccount";
    process.env.AZURE_STORAGE_CONTAINER_NAME = "testcontainer";
  }
};

const readers = {
  "object-store": async (url) => {
    const response = await fetch(url);
    return response.status === 200 ? Buffer.from(await response.arrayBuffer()) : null;
  },
  azure: async (url) => {
    const name = decodeURIComponent(new URL(url).pathname).replace(/^\/testcontainer\//, "");
    return require("@azure/storage-blob").__store.get(name) ?? null;
  },
};

const expiryOf = {
  "object-store": (url) => Number(new URL(url).searchParams.get("X-Amz-Expires")),
  azure: () => {
    const { options } = require("@azure/storage-blob").__sasCalls.at(-1);
    return (options.expiresOn - options.startsOn) / 1000;
  },
};

describe.each([...(runObjectStore ? ["object-store"] : []), "azure"])("%s provider contract", (backend) => {
  const read = readers[backend];
  let storage;
  let links;

  const upload = async (name, body, mimeType = "text/plain") => {
    const link = await storage.uploadToStorage(body, name, mimeType);
    links.push(link);
    return link;
  };

  beforeEach(() => {
    jest.resetModules();
    setBackendEnv(backend);
    storage = require(STORAGE);
    links = [];
  });

  afterEach(async () => {
    await Promise.all(links.map((link) => storage.deleteFromStorage(link)));
  });

  afterAll(resetEnv);

  it("uploadToStorage returns a link that serves the uploaded bytes", async () => {
    const body = Buffer.from(`upload ${randomUUID()}`);

    const link = await upload(`contract-${randomUUID()}.txt`, body);

    expect((await read(link)).equals(body)).toBe(true);
  });

  it("presigned links expire in 7 days", async () => {
    const link = await upload(`contract-${randomUUID()}.txt`, Buffer.from("x"));

    expect(expiryOf[backend](link)).toBe(SEVEN_DAYS);
  });

  it("uploadStreamToStorage reports progress and stores every byte", async () => {
    const name = `contract-${randomUUID()}.bin`;
    const chunks = [Buffer.alloc(1000, 1), Buffer.alloc(2000, 2), Buffer.alloc(500, 3)];
    const stream = new PassThrough();
    const progress = [];

    const uploading = storage.uploadStreamToStorage(stream, name, "application/octet-stream", ({ loadedBytes }) =>
      progress.push(loadedBytes)
    );
    chunks.forEach((chunk) => stream.write(chunk));
    stream.end();
    const link = await uploading;
    links.push(link);

    expect((await read(link)).equals(Buffer.concat(chunks))).toBe(true);
    expect(progress[progress.length - 1]).toBe(3500);
  });

  it("getPreSignedProfileImageUrl links the {userId}_photo object", async () => {
    const userId = randomUUID();
    const body = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 255, 1]);
    await upload(`${userId}_photo`, body, "image/png");

    const link = await storage.getPreSignedProfileImageUrl(userId);

    expect((await read(link)).equals(body)).toBe(true);
  });

  it("getPreSignedFileUrl links the last path segment of a stored link", async () => {
    const id = randomUUID();
    const body = Buffer.from(`file ${id}`);
    await upload(`contract file ${id}.txt`, body);

    const link = await storage.getPreSignedFileUrl(
      `https://old-host.example.com/some/path/contract%20file%20${id}.txt?sig=old`
    );

    expect((await read(link)).equals(body)).toBe(true);
  });

  it("getBlobContent returns the given contentType and base64 content", async () => {
    const body = Buffer.from("content body");
    const link = await upload(`contract-${randomUUID()}.txt`, body);

    await expect(storage.getBlobContent(link, "application/json")).resolves.toEqual({
      contentType: "application/json",
      content: body.toString("base64"),
    });
  });

  it("getBlobContent rejects for a missing object", async () => {
    const link = await storage.getPreSignedProfileImageUrl(randomUUID());

    await expect(storage.getBlobContent(link, "text/plain")).rejects.toThrow();
  });

  it("deleteFromStorage removes the object", async () => {
    const link = await upload(`contract-${randomUUID()}.txt`, Buffer.from("to delete"));

    await storage.deleteFromStorage(link);

    expect(await read(link)).toBeNull();
  });

  it("deleteFromStorage does not throw for a missing object", async () => {
    const link = await storage.getPreSignedProfileImageUrl(randomUUID());

    await expect(storage.deleteFromStorage(link)).resolves.toBeUndefined();
  });
});

describe("azure.blob.service settings", () => {
  const ACCOUNT_KEY = Buffer.from("secret").toString("base64");

  beforeEach(() => {
    jest.resetModules();
    setBackendEnv("azure");
  });

  afterAll(resetEnv);

  it("signs with the account key when a connection string is set", async () => {
    process.env.AZURE_STORAGE_CONNECTION_STRING = `AccountName=keyaccount;AccountKey=${ACCOUNT_KEY};`;
    const { StorageSharedKeyCredential, __sasCalls } = require("@azure/storage-blob");
    const provider = require("../../../services/azure.blob.service");

    await provider.getPreSignedUrl("file.txt", 60);

    expect(__sasCalls[0].credential).toBeInstanceOf(StorageSharedKeyCredential);
    expect(__sasCalls[0].accountName).toBeUndefined();
  });

  it("signs with a user delegation key when no connection string is set", async () => {
    const { __sasCalls, __delegationKey } = require("@azure/storage-blob");
    const provider = require("../../../services/azure.blob.service");

    await provider.getPreSignedUrl("file.txt", 60);

    expect(__sasCalls[0].credential).toBe(__delegationKey);
    expect(__sasCalls[0].accountName).toBe("testaccount");
  });

  it("throws at load when the connection string has no AccountKey", () => {
    process.env.AZURE_STORAGE_CONNECTION_STRING = "AccountName=keyaccount;";

    expect(() => require("../../../services/azure.blob.service")).toThrow("needs both AccountName and AccountKey");
  });

  it("throws at load with no connection string and no account name", () => {
    delete process.env.AZURE_STORAGE_ACCOUNT_NAME;

    expect(() => require("../../../services/azure.blob.service")).toThrow(
      "needs AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME"
    );
  });

  it("throws at load with no container name", () => {
    delete process.env.AZURE_STORAGE_CONTAINER_NAME;

    expect(() => require("../../../services/azure.blob.service")).toThrow("needs AZURE_STORAGE_CONTAINER_NAME");
  });
});

describe("object.store.blob.service settings", () => {
  beforeEach(() => {
    jest.resetModules();
    setBackendEnv("object-store");
  });

  afterAll(resetEnv);

  it("throws at load when OBJECT_STORE_BUCKET_NAME is missing", () => {
    delete process.env.OBJECT_STORE_BUCKET_NAME;

    expect(() => require("../../../services/object.store.blob.service")).toThrow("needs OBJECT_STORE_BUCKET_NAME");
  });

  it.each(["OBJECT_STORE_ACCESS_KEY_ID", "OBJECT_STORE_SECRET_ACCESS_KEY"])("throws at load when %s is missing", (name) => {
    delete process.env[name];

    expect(() => require("../../../services/object.store.blob.service")).toThrow(
      "needs OBJECT_STORE_ACCESS_KEY_ID and OBJECT_STORE_SECRET_ACCESS_KEY"
    );
  });

  it("throws at load when only Azure settings exist", () => {
    ["OBJECT_STORE_ENDPOINT_URL", "OBJECT_STORE_ACCESS_KEY_ID", "OBJECT_STORE_SECRET_ACCESS_KEY", "OBJECT_STORE_BUCKET_NAME"].forEach(
      (key) => delete process.env[key]
    );
    process.env.AZURE_STORAGE_ACCOUNT_NAME = "testaccount";

    expect(() => require("../../../services/object.store.blob.service")).toThrow("found Azure settings and no OBJECT_STORE_");
  });

  it("throws at load when OBJECT_STORE_ENDPOINT_URL is not a URL", () => {
    process.env.OBJECT_STORE_ENDPOINT_URL = "not a url";

    expect(() => require("../../../services/object.store.blob.service")).toThrow("is not a URL");
  });

  it("signs links for OBJECT_STORE_PUBLIC_ENDPOINT_URL and not for OBJECT_STORE_ENDPOINT_URL", async () => {
    process.env.OBJECT_STORE_ENDPOINT_URL = "http://internal-store:9000";
    process.env.OBJECT_STORE_PUBLIC_ENDPOINT_URL = "https://files.example.com";

    const link = await require("../../../services/object.store.blob.service").getPreSignedUrl("file.txt", 60);

    expect(new URL(link).host).toBe("files.example.com");
  });

  it("throws at load when OBJECT_STORE_PUBLIC_ENDPOINT_URL is not a URL", () => {
    process.env.OBJECT_STORE_PUBLIC_ENDPOINT_URL = "not a url";

    expect(() => require("../../../services/object.store.blob.service")).toThrow("OBJECT_STORE_PUBLIC_ENDPOINT_URL");
  });

  it("throws at load when OBJECT_STORE_ENDPOINT_URL is not http or https", () => {
    process.env.OBJECT_STORE_ENDPOINT_URL = "localhost:9000";

    expect(() => require("../../../services/object.store.blob.service")).toThrow("must start with http:// or https://");
  });
});
