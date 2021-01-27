"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const databaseService_1 = require("../services/databaseService");
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
            databaseService_1.default.checkDuplicateUser(user).then((isDuplicate) => {
                if (isDuplicate) {
                    res.status(400).json({
                        'message': 'That username is taken',
                        'takenUsername': user.username
                    });
                }
                else {
                    let salt = bcryptjs_1.genSaltSync();
                    user.password = bcryptjs_1.hashSync(user.password, salt);
                    databaseService_1.default.postUser(user).then((userId) => {
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
    databaseService_1.default.getUserByName(user.username).then((userFromDB) => {
        if (userFromDB === null) {
            throw new Error('Invalid credentials.');
        }
        let doesPasswordMatch = bcryptjs_1.compareSync(user.password, userFromDB.password);
        if (!doesPasswordMatch) {
            throw new Error('Invalid credentials.');
        }
        else {
            console.log('passwords match...');
            let payload = {
                'sub': userFromDB._id.toString(),
                'username': userFromDB.username,
                'userLevel': userFromDB.userLevel.toString(),
            };
            const secret = process.env.JWT_SECRET_KEY;
            const token = jwt.sign(payload, secret, { 'expiresIn': '1d' });
            res.status(200).json({
                'message': 'Signin successful.',
                'token': token,
            });
        }
    }).catch((err) => {
        res.json({
            'message': 'Invalid credentials.',
            'username': user.username
        });
    });
});
//# sourceMappingURL=auth.js.map