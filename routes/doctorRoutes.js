const express = require("express");
const router = express.Router();

const {
    getDoctor
} = require("../controllers/doctorController");

router.get('/:id', getDoctor);

module.exports = router;