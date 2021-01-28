"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const monk_1 = require("monk");
require("dotenv/config");
const mongoURI = process.env.MONGODB_URI;
exports.default = {
    getAllMovies,
    getMovieById,
    getMoviesByTitle,
    getUsersCollections,
    postMovie,
    postMovieCollection,
};
function getMovieCollection() {
    console.log('Connecting to db...');
    return monk_1.default(mongoURI).then((db) => {
        let movies = db.get('movies');
        if (movies === null || movies === undefined) {
            console.log('No movies found, creating...');
            movies = db.create('movies');
        }
        console.log('movies got!');
        return movies;
    });
}
function getCollection() {
    console.log('connecting to db...');
    return monk_1.default(mongoURI).then((db) => {
        let collection = db.get('movie-collections');
        if (collection === null || collection === undefined) {
            db.create('movie-collections');
        }
        return collection;
    });
}
function getAllMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        let movies = yield getMovieCollection();
        let result = yield movies.find();
        return result;
    });
}
function getMovieById(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        let movies = yield getMovieCollection();
        let result = yield movies.findOne({ '_id': movieId });
        return result;
    });
}
function getMoviesByTitle(movieTitle) {
    return __awaiter(this, void 0, void 0, function* () {
        let movies = yield getMovieCollection();
        let result = yield movies.find({ 'title': movieTitle });
        return result.toArray();
    });
}
function getUsersCollections(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let collections = yield getCollection();
        let result = yield collections.find({ 'ownerId': user._id });
        return result.toArray();
    });
}
function postMovie(movie) {
    return __awaiter(this, void 0, void 0, function* () {
        let movies = yield getMovieCollection();
        let inserted = yield movies.insert(movie);
        return inserted._id;
    });
}
function postMovieCollection(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        let collections = yield getCollection();
        let inserted = yield collections.insert(collection);
        return inserted._id;
    });
}
//# sourceMappingURL=movieService.js.map