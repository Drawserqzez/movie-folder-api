import monk, { ICollection, IObjectID } from 'monk';
import IUser from '../interfaces/IUser';
import 'dotenv/config'

let users:ICollection<IUser>;

const db = monk(process.env.MONGODB_URI).then((db) => {
    console.log('Connected to the server :D');
    users = db.get('users');

    if (users === undefined || users === null) {
        console.log('users collection not found, creating....');
        users = db.create('users');
        console.log('created!');
    }

    console.log('Got data from cloud...');
}).catch((err) => {
    console.log(err.message)
});

async function checkDuplicateUser(userToTest: IUser): Promise<boolean> {
    let userFromDb = await getUserByName(userToTest.username);

    return userFromDb !== null;
}

async function getUsers(): Promise<Array<IUser>> {
    let result = await users.find();
    return result;
}

async function getUserByName(username: string): Promise<IUser> {
    let user = await users.findOne({'username': username});

    return user;
}

async function getUserById(userId: IObjectID): Promise<IUser> {
    let user = await users.findOne({'_id': userId});

    return user;
}

async function postUser(user: IUser): Promise<IObjectID> {
    let insertedUser = await users.insert(user);

    return insertedUser._id;
}

export default {
    checkDuplicateUser,
    getUsers,
    getUserByName,
    getUserById,
    postUser
}