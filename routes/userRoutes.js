const express = require("express");
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 100 }});

const {
    registerUser,
    loginUser,
    checkEmail,
    currentUser,
    getUserGeneralDetails
} = require('../controllers/userController');

const ensureAuthenticated = require("../middleware/authMiddleware");

router.post("/register", upload.fields([
    { name: 'medicalDocuments'},
    { name: 'contactProfiles'},
    { name: 'userProfile'}
]), registerUser).post("/login", loginUser).post("/checkEmail", checkEmail);

router.get("/", ensureAuthenticated, currentUser).get("/:id", ensureAuthenticated, getUserGeneralDetails);

module.exports = router;