"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const userService_1 = require("../services/userService");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const UserLevel_1 = require("../interfaces/UserLevel");
exports.authRouter = express.Router();
exports.authRouter.post('/signup', (req, res, next) => {
    let user = {
        _id: null,
        username: req.body.username,
        password: req.body.password,
        userLevel: UserLevel_1.default.User
    };
    try {
        if (RegExp(/([^a-zA-Z0-9_\-])/).test(user.username)) {
            res.status(400).json({
                'message': 'Username may only contain alphanumeric characters, underscores, and dashes',
                'username': user.username,
            });
        }
        else {
            userService_1.default.checkDuplicateUser(user).then((isDuplicate) => {
                if (isDuplicate) {
                    res.status(400).json({
                        'message': 'That username is taken',
                        'takenUsername': user.username
                    });
                }
                else {
                    let salt = bcryptjs_1.genSaltSync();
                    user.password = bcryptjs_1.hashSync(user.password, salt);
                    userService_1.default.postUser(user).then((userId) => {
                        res.status(201).json({
                            'message': 'Created user',
                            'createdUserId': userId
                        });
                    });
                }
            });
        }
    }
    catch (err) {
        res.status(500).json({
            'message': 'something went very wrong here: ' + err.message
        });
    }
});
exports.authRouter.post('/signin', (req, res, next) => {
    let user = {
        _id: null,
        username: req.body.username,
        password: req.body.password,
        userLevel: UserLevel_1.default.User
    };
    userService_1.default.getUserByName(user.username).then((userFromDB) => {
        if (userFromDB === null) {
            throw new Error('Invalid credentials.');
        }
        let doesPasswordMatch = bcryptjs_1.compareSync(user.password, userFromDB.password);
        if (!doesPasswordMatch) {
            throw new Error('Invalid credentials.');
        }
        else {
            console.log('passwords match...');
            const authPayload = {
                'sub': userFromDB._id.toString(),
                'username': userFromDB.username,
                'userLevel': userFromDB.userLevel.toString(),
            };
            const refreshPayload = {
                'sub': userFromDB._id.toString()
            };
            const secret = process.env.JWT_SECRET_KEY;
            const authToken = jwt.sign(authPayload, secret, { 'expiresIn': '1d' });
            const refreshToken = jwt.sign(refreshPayload, secret, { 'expiresIn': '7d' });
            res.status(200).json({
                'message': 'Signin successful.',
                'authToken': authToken,
                'refreshToken': refreshToken
            });
        }
    }).catch((err) => {
        res.status(400).json({
            'message': err.message || 'Invalid credentials',
            'username': user.username
        });
    });
});
exports.authRouter.post('/refresh', (req, res, next) => {
    const refreshToken = req.body.token;
    const secret = process.env.JWT_SECRET_KEY;
    if (refreshToken) {
        jwt.verify(refreshToken, secret, (err) => {
            if (err)
                return res.sendStatus(400);
            const refreshPayload = jwt.decode(refreshToken, { 'json': true });
            userService_1.default.getUserById(refreshPayload.sub).then((user) => {
                if (!user)
                    return res.sendStatus(400);
                const newPayload = {
                    'sub': user._id,
                    'username': user.username,
                    'userLevel': user.userLevel.toString(),
                };
                const refreshedToken = jwt.sign(newPayload, secret, { 'expiresIn': '1d' });
                return res.status(200).json({
                    'message': 'Token refreshed',
                    'token': refreshedToken
                });
            });
        });
    }
    else {
        res.sendStatus(400);
    }
});
//# sourceMappingURL=authRouter.js.map