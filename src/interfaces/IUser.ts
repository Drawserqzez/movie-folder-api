import { IObjectID } from 'monk';
import UserLevel from '../interfaces/UserLevel';

interface IUser {
    _id: IObjectID,
    username: string,
    password: string,
    userLevel: UserLevel
}

export default IUser;