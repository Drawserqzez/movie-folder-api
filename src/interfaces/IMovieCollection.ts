import { IObjectID } from 'monk'
import IMovie from './IMovie';
import IUser from './IUser';

interface IMovieCollection {
    _id: IObjectID,
    name: string,
    movieIds: Array<IObjectID>,
    ownerId: IObjectID,
    maxCapacity: number
}

export default IMovieCollection;