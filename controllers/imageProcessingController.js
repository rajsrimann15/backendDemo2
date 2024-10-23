const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const { spawn } = require('child_process');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'imgpr';

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function createContainer() {
  const createContainerResponse = await containerClient.createIfNotExists();
  //console.log(`Create container ${containerName} successfully`, createContainerResponse.succeeded);
}

createContainer();

/*
const uploadImage = asyncHandler(async (req, res) => {
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
});*/

const uploadImage = asyncHandler(async (req, res) => {

  const pythonProcess = spawn('python', ['./ImgProcessingModule/imgProcessModule.py']);

  // Capture the output from the Python script
  let dataToSend = '';

  pythonProcess.stdout.on('data', (data) => {
    dataToSend += data.toString();
  });

  // Capture any errors from the Python script
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send('An error occurred while processing the image');
    }

    // Process the output from the Python script
    const description = dataToSend.trim();
    console.log(`Description: ${description}`);

    // Send the description as the response
    res.status(200).send({ description });
  })

});

module.exports = {
    uploadImage
};
