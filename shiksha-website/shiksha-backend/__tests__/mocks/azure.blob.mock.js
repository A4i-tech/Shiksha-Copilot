/**
 * Mock implementation of Azure Blob Storage service
 * Used to avoid actual Azure calls during testing
 */

const mockUploadFile = jest.fn().mockResolvedValue({
  success: true,
  url: 'https://mock-storage.blob.core.windows.net/container/test-file.pdf',
  fileName: 'test-file.pdf',
});

const mockDownloadFile = jest.fn().mockResolvedValue({
  success: true,
  buffer: Buffer.from('mock file content'),
  contentType: 'application/pdf',
});

const mockDeleteFile = jest.fn().mockResolvedValue({
  success: true,
  message: 'File deleted successfully',
});

const mockGetFileUrl = jest.fn().mockReturnValue(
  'https://mock-storage.blob.core.windows.net/container/test-file.pdf'
);

const mockListFiles = jest.fn().mockResolvedValue({
  success: true,
  files: [
    { name: 'file1.pdf', size: 1024, lastModified: new Date() },
    { name: 'file2.pdf', size: 2048, lastModified: new Date() },
  ],
});

const AzureBlobService = {
  uploadFile: mockUploadFile,
  downloadFile: mockDownloadFile,
  deleteFile: mockDeleteFile,
  getFileUrl: mockGetFileUrl,
  listFiles: mockListFiles,
};

module.exports = AzureBlobService;
module.exports.mockUploadFile = mockUploadFile;
module.exports.mockDownloadFile = mockDownloadFile;
module.exports.mockDeleteFile = mockDeleteFile;
module.exports.mockGetFileUrl = mockGetFileUrl;
module.exports.mockListFiles = mockListFiles;
