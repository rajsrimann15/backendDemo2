const mongoose = require("mongoose");

const doctorModelSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: [true, 'name is missing'],
    },
    age: {
        type: Number,
        required: [true, 'age is missing'],
    },
    doctorId: {
        type: String,
        required: [true, 'doctorId is missing'],
    },
    profileUrl: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, 'phone is missing'],
    },
    workingIn: {
        type: String,
        required: [true, 'workspace is missing'],
    }
});

module.exports = mongoose.model("DoctorModel", doctorModelSchema);