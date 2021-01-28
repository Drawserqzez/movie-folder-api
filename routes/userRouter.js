"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express = require("express");
const jwt = require("jsonwebtoken");
const userService_1 = require("../services/userService");
exports.userRouter = express.Router();
exports.userRouter.get('/me', (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const payload = jwt.decode(token, { "json": true });
    if (payload) {
        userService_1.default.getUserById(payload.sub).then((user) => {
            if (!user)
                return res.sendStatus(400);
            return res.json({
                'user': {
                    '_id': user._id,
                    'username': user.username,
                    'userLevel': user.userLevel.toString()
                }
            });
        });
    }
});
//# sourceMappingURL=userRouter.js.map