"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieRouter = void 0;
const express = require("express");
const movieService_1 = require("../services/movieService");
exports.movieRouter = express.Router();
exports.movieRouter.get('/', (req, res, next) => {
    movieService_1.default.getAllMovies().then((movies) => {
        return res.status(200).json(movies);
    }).catch((err) => {
        return res.sendStatus(500);
    });
});
exports.movieRouter.post('/add', (req, res, next) => {
    let movie = {
        '_id': null,
        'title': req.body.title,
        'amount': req.body.discAmount
    };
    res.status(500).json({
        'message': "This endpoint isn't added yet :p"
    });
    // TODO: Validate the movie, then add to the db
});
//# sourceMappingURL=movieRouter.js.map