import express from 'express';
import userController from '../controller/userController.js';
import postController from '../controller/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/imgStorage.js';

import { prismaclient } from '../application/database.js';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userRouter = new express.Router();

userRouter.get('/avatars', async (req, res, next) => {
    try {
        const filename = req.query.filename;
        if (!filename) {
            res.status(400).send("Filename is required");
            return;
        }
        const imagePath = path.join(__dirname, '..', 'assets', 'img', filename);
        if (!fs.existsSync(imagePath)) {
            res.status(404).send("File not found");
            return;
        }
        res.status(200).sendFile(imagePath);
    } catch (e) {
        next(e);
    }
});

userRouter.get('/avatars/:username', async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await prismaclient.user.findUnique({
            where: {
                username: username,
            },
            select: {
                avatar: true,
            },
        });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        const imagePath = path.join(__dirname, '..', 'assets', 'img', user.avatar);
        if (!fs.existsSync(imagePath)) {
            res.status(404).send("File not found");
            return;
        }
        res.status(200).sendFile(imagePath);
    } catch (e) {
        next(e);
    }
});

userRouter.use(authMiddleware);
userRouter.get('/api/users',userController.getUser);
userRouter.patch('/api/users/update' ,upload.single('avatar') , userController.updateUser);
userRouter.delete('/api/users/logout', userController.logout);

const postRouter = new express.Router();
postRouter.get('/api/posts', postController.getPost);
postRouter.use(authMiddleware);
postRouter.get('/api/posts/user-posts', postController.getUserPosts);
postRouter.post('/api/posts/create', postController.createPost);
postRouter.post('/api/posts/update/:id', postController.updatePost);
postRouter.delete('/api/posts/delete/:id', postController.deletePost);
export {
    userRouter,
    postRouter,
}