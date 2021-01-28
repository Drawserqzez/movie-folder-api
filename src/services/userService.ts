import monk, { ICollection, IObjectID } from 'monk';
import IUser from '../interfaces/IUser';
import 'dotenv/config'

const uri = process.env.MONGODB_URI;

export default {
    checkDuplicateUser,
    getUsers,
    getUserByName,
    getUserById,
    postUser
}

function getUserCollectionFromDB(): Promise<ICollection<IUser>> {
    console.log('connecting to db...');
    return monk(uri).then((db) => {
        let users = db.get('users');

        if (users === null || users === undefined) {
            console.log('user collection not found, creating...');
            users = db.create('users');
        }

        console.log('got users');
        return users;
    });
}

async function checkDuplicateUser(userToTest: IUser): Promise<boolean> {
    let userFromDb = await getUserByName(userToTest.username);

    return userFromDb !== null;
}

async function getUsers(): Promise<Array<IUser>> {
    let users = await getUserCollectionFromDB();
    let result = await users.find();
    return result;
}

async function getUserByName(username: string): Promise<IUser> {
    let users = await getUserCollectionFromDB();
    let user = await users.findOne({'username': username});

    return user;
}

async function getUserById(userId: IObjectID): Promise<IUser> {
    let users = await getUserCollectionFromDB();
    let user = await users.findOne({'_id': userId});

    return user;
}

async function postUser(user: IUser): Promise<IObjectID> {
    let users = await getUserCollectionFromDB();
    let insertedUser = await users.insert(user);

    return insertedUser._id;
}