"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_1 = require("./routes/auth");
const tokenAuth_1 = require("./middleware/tokenAuth");
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.json());
// Routers
app.use('/auth/', auth_1.authRouter);
app.get("/", (req, res) => {
    res.json({
        'message': 'Hello world! This is an API!'
    });
});
app.get("/api/test/", tokenAuth_1.default, (req, res) => {
    res.json({
        'message': 'You are validated! Well done you!!'
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map