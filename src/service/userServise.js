import { prismaclient } from "../application/database.js";
import { ResponseError } from "../response/error-response.js";
import { registerValidation, loginValidation, getUserValidation, updateUserValidation } from "../validation/userValidation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

const register = async (req) => {
    const user = validate(registerValidation, req);

    const countUser = await prismaclient.user.count({
        where: {
            username: user.username,
        },

    });


    if (countUser === 1) {
        throw new ResponseError("Username already exists", 400);
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaclient.user.create({
        data: user,
        select: {
            username: true,
            name: true,
            password: false,
        },
    });

};

const login = async (req) => {
    const loginValid = validate(loginValidation, req);

    const user = await prismaclient.user.findUnique({
        where: {
            username: loginValid.username,
        },
        select: {
            username: true,
            password: true,
        },
    });

    if (!user) {
        throw new ResponseError("Username not registered", 401);
    }

    const isPasswordValid = await bcrypt.compare(loginValid.password, user.password);

    if (!isPasswordValid) {
        throw new ResponseError("Password is wrong", 401);
    }

    const token = uuid();

    await prismaclient.user.update({
        where: {
            username: user.username,
        },
        data: {
            token: token,
        },
        select: {
            token: true,
        },
    });

    return { user , token };
};


const getUser = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaclient.user.findUnique({
        where: {
            username: username,
        },
        select: {
            username: true,
            name: true,
            avatar: true,
        },
    });

    if (!user) {
        throw new ResponseError("User not found", 404);
    }

    return user;
}

const updateUser = async (req) => {
    const user = validate(updateUserValidation, req);

    const countUser = await prismaclient.user.count({
        where: {
            username: user.username,
        },
    });

    if (countUser === 0) {
        throw new ResponseError("User not found", 404);
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }
    if (user.avatar) {
        data.avatar = user.avatar;
    }
    
    return prismaclient.user.update({
        where: {
            username: user.username,
        },
        data: data,
        select: {
            username: true,
            name: true,
            avatar: true,
        },
    });
}

const logout = async (username) => {
    username = validate(getUserValidation, username);
    
    const user = await prismaclient.user.findUnique({
        where: {
            username: username,
        },
    });

    if(!user){
        throw new ResponseError("User not found", 404);
    }

    return prismaclient.user.update({
        where: {
            username: username,
        },
        data: {
            token: null,
        },
        select: {
            username: true,
        },
    
    });
}
export default {
    register,
    login,
    getUser,
    updateUser,
    logout,
}