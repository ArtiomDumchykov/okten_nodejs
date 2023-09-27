"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    static instance;
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        if (typeof ApiError.instance === "object") {
            return ApiError.instance;
        }
        ApiError.instance = this;
    }
}
exports.ApiError = ApiError;
