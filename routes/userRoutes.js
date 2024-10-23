const express = require("express");
const router = express.Router();
const {signup,login}=require("../Controllers/userController");
const {otpSend,otpVerify}=require("../Controllers/mailOtpController");
const multer = require('multer');
const {uploadIdProof}=require("../Controllers/govIDControlller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

//signup
router.post("/signup",signup);
router.post("/send-otp",otpSend);
router.post("/verify-otp",otpVerify);
router.post("/upload-id-proof", upload.single('idProof'),uploadIdProof);

//login
router.post("/login",login);




module.exports = router;    


