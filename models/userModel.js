const mongoose = require("mongoose");

const UserModelSchema = new mongoose.Schema({
    
    userId: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'name is missing'],
    },
    email: {
        type: String,
        required: [true, 'email is missing'],
    },
    address: {
        type: String,
        required: [true, 'address is missing'],
    },
    password: {
        type: String,
        required: [true, 'password is missing'],
    },
    fileLink: {
        type: String,
        required: [true, 'Gov ID is missing'],
    },
});

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);
const UserModel = mongoose.model("UserModel", UserModelSchema);

module.exports = { UserModel, Counter };
