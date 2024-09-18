const express = require('express');
const passport = require('passport');
const router = express.Router();
const session = require('express-session');
require('../controllers/authController');
const ensureAuthenticated = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  currentUser,
  loginGoogle,
  updateUser,
  userGetAllOrders
} = require('../controllers/userController');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");


//middlewares
router.use(bodyParser.json());
router.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());

//current user

router.get('/auth/current', ensureAuthenticated, currentUser);

//get all orders

router.get('/auth/current/orders', ensureAuthenticated, userGetAllOrders);

//update user

router.put('/auth/update/user/', ensureAuthenticated, updateUser);

//registration (custom)

router.post('/auth/register', registerUser);

//login (custom)

router.post('/auth/login', loginUser);

//google login

router.post('/auth/login/google', loginGoogle);

//google login website

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
router.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res) => {
    const user = req.user;
    const accessToken = jwt.sign({ userId: user.id, email: user.email }, 'raj@123', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id, email: user.email }, 'raj@456', { expiresIn: '7d' });

    res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, userName: user.username, userObj: user });
  }
);

router.post('/token', async (req, res) => {
  const { token, refreshToken } = req.body;

  try {
      const decoded = jwt.verify(token, 'raj@123');
      res.json({ token });
  } catch (err) {
      try {
          const decodedRefresh = jwt.verify(refreshToken, 'raj@456');
          const newToken = jwt.sign({ userId: decodedRefresh.userId }, 'raj@123', { expiresIn: '1h' });
          res.json({ token: newToken });
      } catch (err) {
          res.status(401).send('Unauthorized');
      }
  }
});

 

module.exports = router;