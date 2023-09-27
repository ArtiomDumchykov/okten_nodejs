"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    res.status(200).send("<h1>Hello World</h1>");
});
exports.homeRoutes = router;
