import monk, { ICollection, IObjectID } from 'monk';
import IMovie from '../interfaces/IMovie';
import IUser from '../interfaces/IUser';
import IMovieCollection from '../interfaces/IMovieCollection';
import 'dotenv/config';

const mongoURI = process.env.MONGODB_URI;

export default {
    getAllMovies,
    getMovieById,
    getMoviesByTitle,
    getUsersCollections,
    postMovie,
    postMovieCollection,
}

function getMovieCollection(): Promise<ICollection<IMovie>> {
    console.log('Connecting to db...');
    return monk(mongoURI).then((db) => {
        let movies = db.get('movies');

        if (movies === null || movies === undefined) {
            console.log('No movies found, creating...');
            movies = db.create('movies');
        }

        console.log('movies got!');
        return movies;
    });
}

function getCollection(): Promise<ICollection<IMovieCollection>> {
    console.log('connecting to db...');
    return monk(mongoURI).then((db) => {
        let collection = db.get('movie-collections');

        if (collection === null || collection === undefined) {
            db.create('movie-collections');
        }

        return collection;
    });
}

async function getAllMovies(): Promise<Array<IMovie>> {
    let movies = await getMovieCollection();
    let result = await movies.find();
    
    return result;
}

async function getMovieById(movieId: IObjectID): Promise<IMovie> {
    let movies = await getMovieCollection();
    let result = await movies.findOne({ '_id': movieId });

    return result;
}

async function getMoviesByTitle(movieTitle: string): Promise<Array<IMovie>> {
    let movies = await getMovieCollection();
    let result = await movies.find({ 'title': movieTitle });

    return result.toArray();
}

async function getUsersCollections(user: IUser): Promise<Array<IMovieCollection>> {
    let collections = await getCollection();
    let result = await collections.find({ 'ownerId': user._id });

    return result.toArray();
}

async function postMovie(movie: IMovie): Promise<IObjectID> {
    let movies = await getMovieCollection();
    let inserted = await movies.insert(movie);

    return inserted._id;
}

async function postMovieCollection(collection: IMovieCollection): Promise<IObjectID> {
    let collections  = await getCollection();
    let inserted = await collections.insert(collection);

    return inserted._id;
}