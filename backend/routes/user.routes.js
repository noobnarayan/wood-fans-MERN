const express = require('express');
const router = express.Router();

const { logOutUser, loginUser, refreshAccessToken, registerUser, addToCart, getCurrentUser, getUserCartData, removeFromCart } = require('../controllers/user.controller.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

// Secured routes

router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/get-user").get(verifyJWT, getCurrentUser);
router.route("/add-to-cart").post(verifyJWT, addToCart);
router.route("/remove-from-cart").post(verifyJWT, removeFromCart);
router.route("/get-cart-data").get(verifyJWT, getUserCartData);

module.exports = router;
