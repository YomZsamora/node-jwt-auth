const { ApiResponse, ERROR_STATUS } = require('../responses');
const { ValidationError } = require('./custom-exceptions');

const errorHandler = (err, req, res) => {

    const apiResponse = new ApiResponse();
    apiResponse.code = err.statusCode || 500;
    apiResponse.status = ERROR_STATUS;
    apiResponse.message = err.message || "Internal Server Error";
    apiResponse.data = err.errors || [];

    if (err instanceof ValidationError) {
        apiResponse.code = err.statusCode;
        apiResponse.message = err.message;
        apiResponse.data = err.errors;
    }

    return res.status(apiResponse.code).json(apiResponse);

}

module.exports = errorHandler;