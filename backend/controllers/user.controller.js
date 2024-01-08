const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { User } = require('../models/user.model.js');
const { ApiResponse } = require('../utils/ApiResponse.js');

const jwt = require('jsonwebtoken');

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, `Something went wrong while generating referesh and access token: ${error}`)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")

    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const isProduction = process.env.NODE_ENV === 'production';

    const options = {
        httpOnly: true,
        secure: isProduction
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

const logOutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id

    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }
    try {

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refreshed token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed"
            )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetch successfull"))
})
const getUserCartData = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user.cartItems, "Cart data fetch successfull"))
})

const addToCart = asyncHandler(async (req, res) => {
    const { id, quantity } = req.body

    try {
        const user = await User.findById(req.user._id)
        user.cartItems.push({ productId: id, quantity })

        await user.save()

        res.status(200).json(new ApiResponse(200, {}, 'Item added to cart successfully'))
    } catch (error) {
        throw new ApiError(500, `An error occurred while adding the item to the cart: ${error}`)
    }
})
const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params

    try {
        const user = await User.findById(req.user._id)
        const itemIndex = user.cartItems.findIndex(item => item.productId == productId)

        if (itemIndex > -1) {
            user.cartItems.splice(itemIndex, 1)
            await user.save()
            res.status(200).json(new ApiResponse(200, {}, 'Item removed from cart successfully'))
        } else {
            throw new ApiError(404, `Item not found in the cart`)
        }
    } catch (error) {
        throw new ApiError(500, `An error occurred while removing the item from the cart: ${error}`)
    }

})


const increaseQuantity = asyncHandler(async (req, res) => {
    const { id } = req.body

    try {
        const user = await User.findById(req.user._id)
        const item = user.cartItems.find(item => item.productId == id)

        if (item) {
            item.quantity++
            await user.save()
            res.status(200).json(new ApiResponse(200, {}, 'Item quantity increased successfully'))
        } else {
            throw new ApiError(404, `Item not found in the cart`)
        }
    } catch (error) {
        throw new ApiError(500, `An error occurred while increasing the item quantity: ${error}`)
    }
})

const decreaseQuantity = asyncHandler(async (req, res) => {
    const { id } = req.body

    try {
        const user = await User.findById(req.user._id)
        const item = user.cartItems.find(item => item.productId == id)

        if (item) {
            item.quantity = Math.max(0, item.quantity - 1)
            await user.save()
            res.status(200).json(new ApiResponse(200, {}, 'Item quantity decreased successfully'))
        } else {
            throw new ApiError(404, `Item not found in the cart`)
        }
    } catch (error) {
        throw new ApiError(500, `An error occurred while decreasing the item quantity: ${error}`)
    }
})

const addToWishlist = asyncHandler(async (req, res) => {
    const { id } = req.body

    try {
        const user = await User.findById(req.user._id)
        user.wishlistItems.push(id)

        await user.save()

        res.status(200).json(new ApiResponse(200, {}, 'Item added to wishlist successfully'))
    } catch (error) {
        throw new ApiError(500, `An error occurred while adding the item to the wishlist: ${error}`)
    }
})

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params

    try {
        const user = await User.findById(req.user._id)
        const itemIndex = user.wishlistItems.indexOf(productId)

        if (itemIndex > -1) {
            user.wishlistItems.splice(itemIndex, 1)
            await user.save()
            res.status(200).json(new ApiResponse(200, {}, 'Item removed from wishlist successfully'))
        } else {
            throw new ApiError(404, 'Item not found in wishlist')
        }
    } catch (error) {
        throw new ApiError(500, `An error occurred while removing the item from the wishlist: ${error}`)
    }
})





const getUserWishlistData = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user.wishlistItems, "Wishlist data fetch successfull"))
})
const addVisitedProduct = asyncHandler(async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new Error('User not found');
        }
        const existingProductIndex = user.recentlyVisitedProducts.findIndex(
            (product) => product._id.equals(id)
        );

        if (existingProductIndex > -1) {
            user.recentlyVisitedProducts[existingProductIndex].visitedAt = Date.now();
        } else {
            user.recentlyVisitedProducts.unshift({ _id: id });
        }
        const maxProducts = 10;
        user.recentlyVisitedProducts = user.recentlyVisitedProducts.slice(0, maxProducts);

        await user.save();

        return res
            .status(200)
            .json(new ApiResponse(200, user.recentlyVisitedProducts, "Recently visited product added successfully"));
    } catch (error) {
        throw new ApiError(500, `Error while adding to recently visited products: ${error.message}`)
    }
});
const getVisitedProduct = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user.recentlyVisitedProducts, "Wishlist data fetch successfull"))
});





module.exports = {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    getCurrentUser,
    addToCart,
    getUserCartData,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    addToWishlist,
    removeFromWishlist,
    getUserWishlistData,
    addVisitedProduct,
    getVisitedProduct
}