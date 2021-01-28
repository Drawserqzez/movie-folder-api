import { IObjectID } from 'monk';

interface IMovie {
    _id: IObjectID,
    title: string,
    amount: number,
}

export default IMovie;