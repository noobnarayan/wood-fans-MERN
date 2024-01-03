const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { Product } = require('../models/products.model.js');
const { ApiResponse } = require('../utils/ApiResponse.js');

const jwt = require('jsonwebtoken');

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
    res.status(201).json(new ApiResponse(200, products, "Get products successful"))
})


module.exports = {
    getAllProducts,
};

