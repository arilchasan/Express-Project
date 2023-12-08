import { ResponseError } from "../response/error-response.js";
import userServise from "../service/userServise.js";
import formidable from "formidable";
import jwt from "jsonwebtoken";
import { upload } from '../middleware/imgStorage.js';
import multer from 'multer';

const register = async (req, res, next) => {
    const form = formidable({ multiples: true });

    try {
        const fields = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve(fields);
            });
        });

        console.log('Received fields:', fields);


        const username = fields.username[0];
        const password = fields.password[0];
        const name = fields.name[0];

        const user = await userServise.register({ username, password, name });

        res.status(200).json({
            code: 200,
            message: "Register success",
            data: user,
        });
    } catch (error) {
        if (error instanceof ResponseError) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const login = async (req, res, next) => {
    const form = formidable({ multiples: true });

    try {
        const fields = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve(fields);
            });
        });

        console.log('Received fields:', fields);
        const username = fields.username[0];
        const password = fields.password[0];

        const user = await userServise.login({ username, password });


        res.status(200).json({
            code: 200,
            message: "Login success",
            data: user,
        });

    } catch (error) {
        if (error instanceof ResponseError) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const getUser = async (req, res, next) => {
    try {
        const username = req.user.username;
        const user = await userServise.getUser(username);
        res.status(200).json({
            code: 200,
            message: "Get user success",
            data: user,
        });
    } catch (e) {
        next(e);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const username = req.user.username;
        const userData = {
            name: req.body.name,
            password: req.body.password,
            avatar: req.file ? req.file.filename : null,
        };

        req.username = username;
        console.log('Received data:', { 
            username, 
            userData 
        });
        const name = userData.name;
        const password = userData.password;
        const avatar = userData.avatar;
        const user = await userServise.updateUser({username, name, password, avatar });

        res.status(200).json({
            code: 200,
            message: "Update user success",
            data: user,
        });
    } catch (e) {
        next(e);
    }
}


const logout = async (req, res, next) => {
    try {
        const username = req.user.username;
        const user = await userServise.logout(username);
        res.status(200).json({
            code: 200,
            message: "Logout success",
            data: user,
        });
    } catch (e) {
        next(e);
    }
}



export default {
    register,
    login,
    getUser,
    updateUser,
    logout,
}