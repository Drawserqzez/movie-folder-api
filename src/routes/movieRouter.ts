import express = require('express');
import db from '../services/movieService';
import IMovie from '../interfaces/IMovie';

export const movieRouter: express.IRouter = express.Router();

movieRouter.get('/', (req, res, next) => {
    db.getAllMovies().then((movies) => {
        return res.status(200).json(movies);
    }).catch((err) => {
        return res.sendStatus(500);
    });
});

movieRouter.post('/add', (req, res, next) => {
    let movie: IMovie = {
        '_id': null,
        'title': req.body.title,
        'amount': req.body.discAmount
    };

    res.status(500).json({
        'message': "This endpoint isn't added yet :p"
    });

    // TODO: Validate the movie, then add to the db
});