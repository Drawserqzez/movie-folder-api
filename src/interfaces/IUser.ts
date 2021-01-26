import { IObjectID } from 'monk';

interface IUser {
    _id: IObjectID,
    username: string,
    password: string,
}

export default IUser;