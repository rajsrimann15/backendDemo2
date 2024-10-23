const asyncHandler = require("express-async-handler");
const {UserModel,Counter}=require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = '1h';
const JWT_REFRESH_EXPIRATION = '7d';



//signup
const signup = asyncHandler(async (req, res) => {
    
  //password Hashing
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log("Hashed Password: ", hashedPassword);
  
  // creating unique userId
  async function getNextSequence(name) {
    const ret = await Counter.findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return ret.seq;
  }
  const sequenceNumber = await getNextSequence('userId');
  const uniqueCode = `user_${sequenceNumber.toString().padStart(3, '0')}`;


    // user Creation  
    const newUser = await UserModel.create({
        userId:uniqueCode,
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        password:hashedPassword,
        fileLink:req.body.fileLink
      });


      if(newUser){
        const { password, ...userDetails } = newUser.toObject();
        res.status(201).json({ message:"New  user Acouunt is created",user:userDetails});
      }
      else {
        res.status(400).json({message: "error creating the user"});
      }
});

//login
const login = asyncHandler(async (req, res) => {

  const { userId, password } = req.body;

  try {
    // Find user by userId
    const user = await UserModel.findOne({ userId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = {signup,login};