import IUser from '../interfaces/IUser';
import db from '../services/databaseService';
import express = require('express');

import { genSaltSync, hashSync } from 'bcryptjs';
export const authRouter:express.Router = express.Router();

authRouter.post('/signup', (req, res, next) => {
    let user: IUser = {
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
            db.checkDuplicateUser(user).then((isDuplicate) => {
                if (isDuplicate) {
                    res.status(400).json({
                        'message': 'That username is taken',
                        'takenUsername': user.username
                    });
                }
                else {
                    let salt = genSaltSync();
                    user.password = hashSync(user.password, salt);

                    db.postUser(user).then((userId) => {
                        res.status(201).json({
                            'message': 'Created user',
                            'createdUserId': userId
                        });
                    });
                }
            })
        }
    } catch (err) {
        res.status(500).json({
            'message': 'something went very wrong here: ' + err.message
        });
    }
});