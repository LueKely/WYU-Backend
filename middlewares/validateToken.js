const asyncHandler = require("express-async-handler");

const ResponseBuilder = require("../helpers/ResponseBuilder");
const TokenManager = require("../helpers/TokenManager");

/**
 * Middleware function to validate and verify the JWT token in the request header.
 * If the token is valid, it adds the decoded user information to the request object.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} - Promise that resolves after processing the request.
 */
const validateToken = asyncHandler(async (req, res, next) => {
    const response = new ResponseBuilder(req, res);
    const token = new TokenManager();
    let receivedToken = null;

    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        receivedToken = authHeader.split(" ")[1];

        let tokenVerification = token.verify(receivedToken);

        // Checks if the token verification is fail
        if (tokenVerification.status === "fail") {
            response.send(
                401,
                tokenVerification.status,
                tokenVerification.message
            );
            return;
        }

        // If verification of token is success proceed to protected route
        req.user = tokenVerification.data;
        next();
        return;
    }

    // If token is not found
    response.send(401, "fail", "Missing Token, Invalid, or Expired");
});

module.exports = validateToken;
