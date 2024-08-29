const { ApiResponse, ERROR_STATUS } = require('../responses');
const { ValidationError, NotAuthenticated, PermissionDenied, NotFound } = require('./custom-exceptions');

const errorHandler = (err, req, res, next) => {

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

    if (err instanceof NotAuthenticated) {
        apiResponse.code = err.statusCode;
        apiResponse.message = err.message;
    }

    if (err instanceof PermissionDenied) {
        apiResponse.code = err.statusCode;
        apiResponse.message = err.message;
    }

    if (err instanceof NotFound) {
        apiResponse.code = err.statusCode;
        apiResponse.message = err.message;
    }

    return res.status(apiResponse.code).json(apiResponse);

}

module.exports = errorHandler;