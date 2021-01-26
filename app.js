"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_1 = require("../src/routes/auth");
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.json());
// Routers
app.use('/auth/', auth_1.authRouter);
app.get("/", (req, res) => {
    res.json({
        'message': 'Hello world!'
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map