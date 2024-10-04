const express = require("express");
const router = express.Router();
const {
  getChipDetails,
  postChipDetails,
  getChipDetail,
  updateChipDetail

} = require("../controllers/ChipController");
const ensureAuthenticated=require("../middleware/authMiddleware");



router.route("/").get(ensureAuthenticated,getChipDetails).post(ensureAuthenticated,postChipDetails);
router.route("/:id").get(ensureAuthenticated,getChipDetail).put(ensureAuthenticated,updateChipDetail);

module.exports = router;
