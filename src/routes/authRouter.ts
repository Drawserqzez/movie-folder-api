import IUser from '../interfaces/IUser';
import db from '../services/userService';
import express = require('express');
import jwt = require('jsonwebtoken');

import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import UserLevel from '../interfaces/UserLevel';
export const authRouter:express.IRouter = express.Router();

authRouter.post('/signup', (req, res, next) => {
    let user: IUser = {
        _id: null,
        username: req.body.username,
        password: req.body.password,
        userLevel: UserLevel.User
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

authRouter.post('/signin', (req, res, next) => {
    let user: IUser = {
        _id: null,
        username: req.body.username,
        password: req.body.password,
        userLevel: UserLevel.User
    };

    db.getUserByName(user.username).then((userFromDB) => {
        if (userFromDB === null) {
            throw new Error('Invalid credentials.');
        }

        let doesPasswordMatch = compareSync(user.password, userFromDB.password);

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

            const secret: string = process.env.JWT_SECRET_KEY;
            const authToken = jwt.sign(authPayload, secret, { 'expiresIn': '1d' });
            const refreshToken = jwt.sign(refreshPayload, secret, { 'expiresIn': '7d' })
            
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

authRouter.post('/refresh', (req, res, next) => {
    const refreshToken = req.body.token;
    const secret = process.env.JWT_SECRET_KEY;
    
    if (refreshToken) {
        jwt.verify(refreshToken, secret, (err: Error) => {
            if (err) return res.sendStatus(400);

            const refreshPayload = jwt.decode(refreshToken, { 'json': true });

            db.getUserById(refreshPayload.sub).then((user) => {
                if (!user) return res.sendStatus(400);

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
        })
    }
    else {
        res.sendStatus(400);
    }
})