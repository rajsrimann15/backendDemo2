const nodemailer = require('nodemailer');
const asyncHandler = require("express-async-handler");
require('dotenv').config();
const otps = {};

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_NODEMAILER,
      pass: 'bndn bsel potk bipy',
    },
  });

 // Otp sent function
  const otpSend = asyncHandler(async (req, res) => {
    const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const otp = generateOtp();
  otps[email] = otp;


  const mailOptions = {
    from: 'public Grevience Reporting portal',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
    console.log('Email sent:', info.response);
    res.json({ success: true, message: 'OTP sent successfully' });
  });
});

 // otp verification 
 const otpVerify = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  if (otps[email] && otps[email] === otp) {
    delete otps[email];
    return res.json({ success: true, message: 'OTP verified successfully' });
  }

  res.status(400).json({ success: false, message: 'Invalid OTP' });
});


module.exports={otpSend,otpVerify};