const express = require('express');
const router = express.Router();

const { logOutUser, loginUser, refreshAccessToken, registerUser, addToCart, getCurrentUser, getUserCartData, removeFromCart, increaseQuantity, decreaseQuantity, addToWishlist, removeFromWishlist, getUserWishlistData, addVisitedProduct, getVisitedProduct } = require('../controllers/user.controller.js');
const { verifyJWT } = require('../middlewares/auth.middleware.js');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

// Secured routes

router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/get-user").get(verifyJWT, getCurrentUser);
router.route("/add-to-cart").post(verifyJWT, addToCart);
router.route("/add-to-wishlist").post(verifyJWT, addToWishlist);
router.route("/remove-from-cart").post(verifyJWT, removeFromCart);
router.route("/remove-from-wishlist").post(verifyJWT, removeFromWishlist);
router.route("/increase-quantity").post(verifyJWT, increaseQuantity);
router.route("/decrease-quantity").post(verifyJWT, decreaseQuantity);
router.route("/get-cart-data").get(verifyJWT, getUserCartData);
router.route("/get-wishlist-data").get(verifyJWT, getUserWishlistData);


router.route("/add-visited-products").post(verifyJWT, addVisitedProduct);
router.route("/get-visited-products").get(verifyJWT, getVisitedProduct);



module.exports = router;
