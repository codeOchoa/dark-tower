import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from '../utils/user-utils.js';

class UserManager {
    constructor(path) {
        this.path = path;
    }

    async getAllUsers(limit) {
        try {
            if (fs.existsSync(this.path)) {
                const users = await fs.promises.readFile(this.path, 'utf-8');
                // if(limit){..
                // filter....(limit) 
                // .}
                return JSON.parse(users);
            } else return [];
        } catch (error) {
            throw new Error(error);
        }
    }

    async createUser(obj) {
        try {
            const user = {
                id: uuidv4(),
                ...obj,
            };
            const users = await this.getAllUsers(); //[] | [{}, {}]
            const userExists = users.find((u) => u.email === user.email);
            if (userExists) throw new Error('User already exists');
            createHash(user);
            users.push(user);
            await fs.promises.writeFile(this.path, JSON.stringify(users));
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(obj, id) {
        try {
            const users = await this.getAllUsers();
            let userExist = await this.getUserByid(id);
            userExist = { ...userExist, ...obj };
            createHash(userExist);
            const newArray = users.filter((u) => u.id !== id);
            newArray.push(userExist);
            await fs.promises.writeFile(this.path, JSON.stringify(newArray));
            return userExist;
        } catch (error) {
            throw error;
        }
    }

    async getUserByid(id) {
        try {
            const users = await this.getAllUsers();
            const userExists = users.find((u) => u.id === id);
            if (!userExists) throw new Error('User does not exist');
            return userExists;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const users = await this.getAllUsers();
            if (!users.length) throw new Error('Users is empty');
            const userExists = await this.getUserByid(id);
            const newArray = users.filter((u) => u.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(newArray));
            return userExists;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export const manager = new UserManager('./src/data/users.json');
