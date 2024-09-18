const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/authModel");
const longDistanceMovingOrderModel = require("../models/LongDistanceMovingOrderModel");
const packingAndMovingOrderModel = require("../models/PackingAndMovingOrderModel");
const localMovingModel = require("../models/LocalMovingOrderModel");

//@desc Register a user
//@route POST /users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone, city } = req.body;
  if (!username || !email || !password || !phone) {
    res.status(401);
    console.log("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    console.log("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
    phone: phone,
    city: city,
  });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ userId: user.id, email: user.email });
  } else {
    res.status(400);
    console.log("User data is not valid");
  }
});

//@desc Login user
//@route POST /users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    console.log("All fields are mandatory!");
  }
  const user = await User.findOne({ email: email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email }, 'raj@123', { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email }, 'raj@456', { expiresIn: '7d' }
    );

    console.log('logined');
    res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, userName: user.username, userObj: user});
  } else {
    res.status(401).json({message: 'incorrect credentials'});
    console.log("email or password is not valid");
  }
});

//@desc Login user google
//@route POST /users/login/google
//@access public
const loginGoogle = asyncHandler(async (req, res) => {
  const profile = req.body;
  if (!profile) {
    res.status(400);
    console.log("All fields are mandatory!");
  }
  
  let user = await User.findOne({email: profile.email});

  console.log(profile.profilePic);

  if (user && profile.profilePic) {
    await User.findOneAndUpdate(
      {email: profile.email},
      {$set: {profilePic: profile.profilePic}},
      {new: true}
    );
  }

  if (!user) {
      user = await new User({
          googleId: profile.googleId,
          username: profile.username,
          email: profile.email,
          profilePic: profile.profilePic,
      }).save();
  }
  
  const accessToken = jwt.sign({ userId: user.id, email: user.email }, 'raj@123', { expiresIn: '1d' });
  const refreshToken = jwt.sign({ userId: user.id, email: user.email }, 'raj@456', { expiresIn: '7d' });

  console.log({ accessToken: accessToken, refreshToken: refreshToken, userName: user.username, userObj: user });

  res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, userName: user.username, userObj: user });
});

//@desc Current user info
//@route POST /users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json({message: "user success"});
});

//@desc update user info (doesn't apply to email)
//@route POST /users/current
//@access private
const updateUser = asyncHandler(async (req, res) => {
  console.log(req.body.data);
  if (!req.body.data) res.status(400).json({message: 'Some fields are missing.'});

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { $set: req.body.data  },
      { new: true } // Return the updated document
    );
    
    if (updatedUser) {
      res.status(200).json({message: `${req.body.data} changed.`, userObj: updatedUser});
    }
    else {
      res.status(404).json({message: 'Order not found.'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

const userGetAllOrders
 = asyncHandler(async (req, res) => {
    const allOrders = (await packingAndMovingOrderModel.find({user_id: req.user.userId})).concat(await longDistanceMovingOrderModel.find({user_id: req.user.userId})).concat(await localMovingModel.find({user_id: req.user.userId}));
    res.status(200).json(allOrders);
  });

module.exports = {registerUser, loginUser, currentUser, loginGoogle, updateUser, userGetAllOrders};
