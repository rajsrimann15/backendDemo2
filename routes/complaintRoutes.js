const express = require("express");
const router = express.Router();
const multer = require('multer');
const {uploadImage}=require("../Controllers/imageProcessingController");


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/",upload.single('imgPr'),uploadImage);

module.exports = router;  