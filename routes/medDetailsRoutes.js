const express = require("express");
const router = express.Router();
const {
    getMedDetails,
    postmedDetail,
    getMedDetail,
    updateMedDetail

} = require("../controllers/MedDetailsController");
const ensureAuthenticated=require("../middleware/authMiddleware");


router.route("/").get(ensureAuthenticated,getMedDetails,).post(ensureAuthenticated,postmedDetail,);
router.route("/:id").get(ensureAuthenticated,getMedDetail).put(ensureAuthenticated,updateMedDetail);

module.exports = router;
