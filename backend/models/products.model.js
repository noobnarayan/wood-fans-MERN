const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        short: {
            type: String,
            required: true
        },
        long: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    reviews: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: true
    }
});


const Product = mongoose.model('Product', ProductSchema);
module.exports = { Product }