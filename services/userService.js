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
const uri = process.env.MONGODB_URI;
exports.default = {
    checkDuplicateUser,
    getUsers,
    getUserByName,
    getUserById,
    postUser
};
function getUserCollectionFromDB() {
    console.log('connecting to db...');
    return monk_1.default(uri).then((db) => {
        let users = db.get('users');
        if (users === null || users === undefined) {
            console.log('user collection not found, creating...');
            users = db.create('users');
        }
        console.log('got users');
        return users;
    });
}
function checkDuplicateUser(userToTest) {
    return __awaiter(this, void 0, void 0, function* () {
        let userFromDb = yield getUserByName(userToTest.username);
        return userFromDb !== null;
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield getUserCollectionFromDB();
        let result = yield users.find();
        return result;
    });
}
function getUserByName(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield getUserCollectionFromDB();
        let user = yield users.findOne({ 'username': username });
        return user;
    });
}
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield getUserCollectionFromDB();
        let user = yield users.findOne({ '_id': userId });
        return user;
    });
}
function postUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield getUserCollectionFromDB();
        let insertedUser = yield users.insert(user);
        return insertedUser._id;
    });
}
//# sourceMappingURL=userService.js.map