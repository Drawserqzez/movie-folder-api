import { NextFunction, Request, Response } from 'express';
import jwt = require('jsonwebtoken');

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.JWT_SECRET_KEY;
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ',)[1];

        jwt.verify(token, secret, (err) => {
            if (err) {
                return res.sendStatus(403);
            }

            next();
        });
    }
    else {
        res.sendStatus(403);
    }
}

export default validateJWT;