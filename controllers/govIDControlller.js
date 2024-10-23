const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'pgrdb';

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function createContainer() {
  const createContainerResponse = await containerClient.createIfNotExists();
  //console.log(`Create container ${containerName} successfully`, createContainerResponse.succeeded);
}

createContainer();

const uploadIdProof = asyncHandler(async (req, res) => {
  const blobName = uuidv4() + '-' + req.file.originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    const fileUrl = blockBlobClient.url;

    res.status(200).json({ success: true, fileUrl: fileUrl });
  } catch (err) {
    console.error('Error uploading file to Azure Blob Storage:', err);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

module.exports = {
  uploadIdProof
};
