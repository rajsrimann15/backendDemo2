const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {Buffer} = require("buffer");
const userModel = require("../models/userModel");

//@desc Register a user
//@route POST /users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {

  // console.log(`req body is ${req.body}`);
  console.log(req.body.name ,
    req.body.age ,
    req.body.dateOfBirth ,
    req.body.profession ,
    req.body.email ,
    req.body.phone ,
    req.body.address ,
    req.body.bio);
  
  if (!req.body.name ||
    !req.body.age ||
    !req.body.dateOfBirth ||
    !req.body.profession ||
    !req.body.email ||
    !req.body.phone ||
    !req.body.address ||
    !req.body.bio) {
    res.status(401).json({error: "some fields are missing"});
    console.log("All fields are mandatory!");
    return;
  }

  const userAvailable = await User.findOne({ email: req.body.email });
  if (userAvailable) {
    res.status(400).json({error: "user already registered please login"});
    console.log("User already registered!");
    return;
  }

  const medicalDocuments = req.files['medicalDocuments'];
    
  const contactProfiles = req.files['contactProfiles'];
  
  const userProfile = req.files['userProfile'];

  if (medicalDocuments) {
      var medicalDocumentsCounter = 0;
      medicalDocuments.forEach(file => {
          req.body.medicalDocuments[medicalDocumentsCounter].reportBinary = Buffer.from(file.buffer).toString('base64');
      });
  }

  if (contactProfiles) {
    var contactProfilesCounter = 0;
      contactProfiles.forEach(file => {
        req.body.contacts[contactProfilesCounter].imageBinary = Buffer.from(file.buffer).toString('base64');
      });
  }

  var userProfileImageBinary;

  if (userProfile && userProfile.length > 0) {
    userProfileImageBinary = Buffer.from(userProfile[0].buffer).toString('base64')
    console.log('User Profile:', userProfile[0].originalname);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    name: req.body.name,
    age: req.body.age,
    dateOfBirth: req.body.dateOfBirth,
    profession: req.body.profession,
    email: req.body.email,
    phone: req.body.phone,
    bloodGroup: req.body.bloodGroup,
    address: req.body.address,
    password: hashedPassword,
    bio: req.body.bio,
    imageBinary: userProfileImageBinary,
    medicalDocuments: req.body.medicalDocuments,
    consultedDoctors: req.body.consultedDoctors,
    contacts: req.body.contacts,
    currentDayTabCount: 0,
    tabCount: 0
  });

  if (user) {
    console.log(`User created ${user}`);
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email }, 'raj@123', { expiresIn: '1d' }
    );
    res.status(201).json({ userId: user.id, email: user.email , token: accessToken});
  } else {
    console.log("User data is not valid");
    res.status(400).json({message: "error creating the user"});
  }
});

const checkEmail = asyncHandler(async (req, res) => {
  console.log(req.body.email);
  const userAvailable = await User.findOne({ email: req.body.email });
  if (userAvailable) {
    console.log("User already registered!");
    res.status(400).json({error: "user already registered please login"});
  }
  else {
    console.log("No such email registered can proceed");
    res.status(200).json({message: "No such email registered can proceed"});
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

    console.log('logined');
    res.status(200).json({ accessToken: accessToken, userId: user.id });
  } else {
    res.status(401).json({ message: 'incorrect credentials' });
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

  let user = await User.findOne({ email: profile.email });

  console.log(profile.profilePic);

  if (user && profile.profilePic) {
    await User.findOneAndUpdate(
      { email: profile.email },
      { $set: { profilePic: profile.profilePic } },
      { new: true }
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
  res.status(200).json({ message: "user success" });
});

//@desc update user info (doesn't apply to email)
//@route POST /users/current
//@access private
const updateUser = asyncHandler(async (req, res) => {
  console.log(req.body.data);
  if (!req.body.data) res.status(400).json({ message: 'Some fields are missing.' });

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { $set: req.body.data },
      { new: true } // Return the updated document
    );

    if (updatedUser) {
      res.status(200).json({ message: `${req.body.data} changed.`, userObj: updatedUser });
    }
    else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Couldn\'t update changes, please try again.' });
  }
});

const getUserGeneralDetails
  = asyncHandler(async (req, res) => {
    console.log(req.params.id);
    const user = await User.findOne({_id: req.params.id});

    console.log(user);

    if (user) {
      res.status(200).json({
        name: user.name,
        age: user.age,
        dateOfBirth: user.dateOfBirth,
        profession: user.profession,
        email: user.email,
        bloodGroup: user.bloodGroup,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        imageBinary: user.imageBinary,
        consultedDoctors: user.consultedDoctors,
        contacts: user.contacts,
        tabCount: user.tabCount,
        currentDayTabCount: user.currentDayTabCount,
      });
    }

    else {
      res.status(404).json({error: "not found"});
    }
  });

module.exports = { registerUser, checkEmail, loginUser, currentUser, loginGoogle, updateUser, getUserGeneralDetails };
