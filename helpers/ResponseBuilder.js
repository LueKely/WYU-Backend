class ResponseBuilder {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    /**
     * Build a standardized response object.
     * @param {string} status - The status of the response ("success" or "fail").
     * @param {string} message - The message associated with the response.
     * @param {Array|Object} data - The data to include in the response.
     * @returns {Object} - The standardized response object.
     */
    build(status = "success", message, data) {
        const responseData = data;
        const response = {
            status,
            message,
        };

        if (data) {
            response.data = responseData;
        }

        return response;
    }

    /**
     * Send a standardized JSON response.
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {string} status - The status of the response ("success" or "fail").
     * @param {string} message - The message associated with the response.
     * @param {Array|Object} data - The data to include in the response.
     */
    send(statusCode = 200, status = "success", message, data = []) {
        const response = this.build(status, message, data);
        this.res.status(statusCode).json(response);
    }
}

module.exports = ResponseBuilder;
