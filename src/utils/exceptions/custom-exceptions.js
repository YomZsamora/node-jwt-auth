
class ValidationError extends Error {
    constructor(message, errors = []) {
        super(message);
        this.name = "ValidationError";
        this.errors = errors;
        this.statusCode = 400;
    }
}

module.exports = { ValidationError }