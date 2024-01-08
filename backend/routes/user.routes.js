const express = require('express');
const router = express.Router();

const { logOutUser, loginUser, refreshAccessToken, registerUser, addToCart, getCurrentUser, getUserCartData, removeFromCart, increaseQuantity, decreaseQuantity, addToWishlist, removeFromWishlist, getUserWishlistData, addVisitedProduct, getVisitedProduct } = require('../controllers/user.controller.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/").get(verifyJWT, getCurrentUser);
router.route("/tokens/refresh").post(refreshAccessToken);
router.route("/logout").post(verifyJWT, logOutUser);

router.route("/cart").post(verifyJWT, addToCart);
router.route("/cart").delete(verifyJWT, removeFromCart);
router.route("/cart/quantity/increase").post(verifyJWT, increaseQuantity);
router.route("/cart/quantity/decrease").post(verifyJWT, decreaseQuantity);
router.route("/cart").get(verifyJWT, getUserCartData);

router.route("/wishlist").post(verifyJWT, addToWishlist);
router.route("/wishlist").delete(verifyJWT, removeFromWishlist);
router.route("/wishlist").get(verifyJWT, getUserWishlistData);

router.route("/products/visited").post(verifyJWT, addVisitedProduct);
router.route("/products/visited").get(verifyJWT, getVisitedProduct);



module.exports = router;
