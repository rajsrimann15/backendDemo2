const asyncHandler = require("express-async-handler");
const doctorModel = require("../models/doctorModel");

const getDoctor = asyncHandler(async (req, res) => {
    const doctor = await doctorModel.findOne({doctorId: req.params.id});

    if (!doctor) {
        res.status(404).json({message: "no such doctor"});
        console.log(`Searched for doctor ${req.params.id} and not found`);
        return;
    }

    res.status(200).json({doctor});
    console.log(doctor);
});

module.exports = { getDoctor };