const express = require("express");
const router = express.Router();
const {
  getLocalMovingOrders,
  createLocaleMovingOrder,
  getLocalMovingOrder,
  updateLocalMovingOrder,
} = require("../controllers/localMovingController");


const ensureAuthenticated=require("../middleware/authMiddleware");

router.route("/").get(ensureAuthenticated, getLocalMovingOrders).post(ensureAuthenticated, createLocaleMovingOrder);
router.route("/:id").get(ensureAuthenticated, getLocalMovingOrder).put(ensureAuthenticated, updateLocalMovingOrder);

module.exports = router;
