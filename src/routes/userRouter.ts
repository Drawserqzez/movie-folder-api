import express = require('express');
import jwt = require('jsonwebtoken');
import db from '../services/userService';

export const userRouter:express.IRouter = express.Router();

userRouter.get('/me', (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const payload = jwt.decode(token, { "json": true });

    if (payload) {
        db.getUserById(payload.sub).then((user) => {
            if (!user) return res.sendStatus(400);

            return res.json({
                'user': {
                    '_id': user._id,
                    'username': user.username,
                    'userLevel': user.userLevel.toString()
                }
            });
        })
    }
});