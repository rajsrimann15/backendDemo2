const express = require("express");
const router = express.Router();
const {
  getLongDistanceMovingOrders,
  getLongDistanceMovingOrder,
  createLongDistanceMovingOrder,
  updateLongDistanceMovingOrder
} = require("../controllers/LongDistanceMovingController");


const ensureAuthenticated=require("../middleware/authMiddleware");

router.route("/").get(ensureAuthenticated, getLongDistanceMovingOrders).post(ensureAuthenticated, createLongDistanceMovingOrder);
router.route("/:id").get(ensureAuthenticated, getLongDistanceMovingOrder).put(ensureAuthenticated, updateLongDistanceMovingOrder);

module.exports = router;
