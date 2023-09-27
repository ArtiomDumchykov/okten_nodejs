"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.configs = {
    PORT: process.env.PORT || 8080,
    mongo: {
        DB_URI: process.env.DB_URI || "mongodb://localhost:27017/okten"
    }
};
