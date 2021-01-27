"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const validateJWT = (req, res, next) => {
    const secret = process.env.JWT_SECRET_KEY;
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
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
};
exports.default = validateJWT;
//# sourceMappingURL=tokenAuth.js.map