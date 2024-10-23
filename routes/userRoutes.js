const express = require("express");
const router = express.Router();
const {signup,login}=require("../controllers/userController");
const {otpSend,otpVerify}=require("../controllers/mailOtpController");
const multer = require('multer');
const {uploadIdProof}=require("../controllers/govIDControlller");

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


