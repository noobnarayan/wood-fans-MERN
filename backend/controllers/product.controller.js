const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { Product } = require('../models/products.model.js');
const { ApiResponse } = require('../utils/ApiResponse.js');

const jwt = require('jsonwebtoken');

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            throw new ApiError(404, "No products found");
        }
        res.status(200).json(new ApiResponse(200, products, "Get products successful"));
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        } else {
            throw new ApiError(500, `Internal Server Error: ${error}`);
        }
    }
});

const getSingleProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        res.status(200).json(new ApiResponse(200, product, "Get product successful"));
    } catch (error) {
        throw new ApiError(500, `Internal Server Error: ${error}`);
    }
});



module.exports = {
    getAllProducts,
    getSingleProduct
};

