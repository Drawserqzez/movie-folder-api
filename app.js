"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const tokenAuth_1 = require("./middleware/tokenAuth");
const authRouter_1 = require("./routes/authRouter");
const movieRouter_1 = require("./routes/movieRouter");
const userRouter_1 = require("./routes/userRouter");
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.json());
// Routers
app.use('/auth/', authRouter_1.authRouter);
app.use('/api/v1/movies/', tokenAuth_1.default, movieRouter_1.movieRouter);
app.use('/api/v1/users/', tokenAuth_1.default, userRouter_1.userRouter);
app.get("/", (req, res) => {
    res.json({
        'message': 'Hello world! This is an API!'
    });
});
app.get("/birthday/", (req, res) => {
    res.send('Grattis på födelsedagen! Den här tjänsten är grunden för ett digitaliserat system för pärmarna som jag har jobbat på det senaste. Det är inte riktigt klart än, men du kan nog vänta dig att allting är i sin ordning innan mars.\nKram <3 Algot');
});
exports.default = app;
//# sourceMappingURL=app.js.map