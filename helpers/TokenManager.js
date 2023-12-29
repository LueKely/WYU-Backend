class TokenManager {
    constructor() {
        this.secretKey = process.env.ACCESS_TOKEN_SECRET;
        this.jwt = require("jsonwebtoken");
    }

    /**
     * Generate a JWT token.
     * @param {Object} data - The data to be included in the token payload.
     * @param {string} expiresIn - The expiration time for the token (default: "1hr").
     * @returns {string|boolean} - The generated JWT token or false if an error occurs.
     */
    generate(data, expiresIn = "1hr") {
        if (typeof data === "object") {
            try {
                const token = this.jwt.sign({ data }, this.secretKey, {
                    expiresIn,
                });
                return token;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    }

    /**
     * Verify a JWT token.
     * @param {string} token - The JWT token to be verified.
     * @returns {Object} - An object containing the status and data or fail message.
     */
    verify(token) {
        if (!token) {
            return {
                status: "fail",
                message: "Missing Token",
            };
        }

        try {
            const decoded = this.jwt.verify(token, this.secretKey);
            return {
                status: "success",
                data: decoded.data,
            };
        } catch (error) {
            console.error(error);
            return {
                status: "fail",
                message: "Invalid Token",
            };
        }
    }
}

module.exports = TokenManager;
