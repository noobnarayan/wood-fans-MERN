const express = require('express');
const router = express.Router();

const { logOutUser, loginUser, refreshAccessToken, registerUser, addToCart } = require('../controllers/user.controller.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

// Secured routes

router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/add-to-cart").post(verifyJWT, addToCart);

module.exports = router;
