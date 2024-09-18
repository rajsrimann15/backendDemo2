const express = require("express");
const router = express.Router();
const {
  getPackingAndMovingOrders,
  createPackingAndMovingOrder,
  getPackingAndMovingOrder,
  updatePackingAndMovingOrder
} = require("../controllers/PackingAndMovingController");


const ensureAuthenticated=require("../middleware/authMiddleware");

router.route("/").get(ensureAuthenticated,getPackingAndMovingOrders).post(ensureAuthenticated,createPackingAndMovingOrder);
router.route("/:id").get(ensureAuthenticated, getPackingAndMovingOrder).put(ensureAuthenticated, updatePackingAndMovingOrder);

module.exports = router;