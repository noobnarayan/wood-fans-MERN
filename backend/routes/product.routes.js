const express = require('express');
const router = express.Router();

const { getAllProducts, getSingleProduct } = require('../controllers/product.controller.js');

router.route("/").get(getAllProducts);
router.route("/:id").get(getSingleProduct);


module.exports = router;
