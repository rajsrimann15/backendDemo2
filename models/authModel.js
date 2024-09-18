const mongoose = require('mongoose');

// Define the schema if not already defined
const userSchema = mongoose.Schema(
  {
    googleId: String,
    username: String,
    email: String,
    profilePic: String,
    password: String,
    phone: String,
    address: String,
    city: String
  }, 
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent redefining
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;