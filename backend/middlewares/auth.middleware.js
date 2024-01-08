const { ApiError } = require('../utils/ApiError.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model.js');

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        let token = req.cookies?.accessToken;
        if (!token && authHeader) {
            const parts = authHeader.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }

        if (!token) {
            console.log("No token");
            throw new ApiError(401, "Unauthorized request");
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error);
    }
});

module.exports = { verifyJWT };
