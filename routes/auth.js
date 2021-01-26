"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const databaseService_1 = require("../services/databaseService");
const express = require("express");
const bcryptjs_1 = require("bcryptjs");
exports.authRouter = express.Router();
exports.authRouter.post('/signup', (req, res, next) => {
    let user = {
        _id: null,
        username: req.body.username,
        password: req.body.password
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
//# sourceMappingURL=auth.js.map