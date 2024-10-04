const mongoose = require("mongoose");

const UserModelSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is missing'],
    },
    age: {
        type: Number,
        required: [true, 'age is missing'],
    },
    dateOfBirth: {
        type: String,
        required: [true, 'date iso string is missing'],
    },
    bloodGroup: {
        type: String,
        required: [true, 'date iso string is missing'],
    },
    profession: {
        type: String,
        required: [true, 'profession is missing'],
    },
    email: {
        type: String,
        required: [true, 'email is missing'],
    },
    phone: {
        type: Number,
        required: [true, 'phone is missing'],
    },
    password: {
        type: String,
        required: [true, 'password is missing'],
    },
    address: {
        type: String,
        required: [true, 'address is missing'],
    },
    bio: {
        type: String,
        required: [true, 'bio is missing'],
    },
    imageBinary: {
        type: String,
    },
    contacts: {
        type: Array,
    },
    medicalDocuments: {
        type: Array,
    },
    consultedDoctors: {
        type: Array,
    },
    ownedClothes: {
        type: Array,
    },
    tabCount: {
        type: Number,
        required: [true, 'tabCount missing'],
    },
    currentDayTabCount: {
        type: Number,
        required: [true, 'current day count is missing'],
    },
});

module.exports = mongoose.model("UserModel", UserModelSchema);