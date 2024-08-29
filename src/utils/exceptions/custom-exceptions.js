
class ValidationError extends Error {
    constructor(message, errors = []) {
        super(message);
        this.name = "ValidationError";
        this.errors = errors;
        this.statusCode = 400;
    }
}

class NotAuthenticated extends Error {
    constructor() {
        super('Authentication credentials were not provided.');
        this.statusCode = 401;
        this.name = "NotAuthenticated"
    }
}

class PermissionDenied extends Error {
    constructor() {
        super("You don't have required permission to perform this action.");
        this.statusCode = 403;
        this.name = "PermissionDenied";
    }
}

class NotFound extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        this.name = "NotFound";
    }
}

module.exports = { ValidationError, NotAuthenticated, PermissionDenied, NotFound }