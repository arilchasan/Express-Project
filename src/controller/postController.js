import { ResponseError } from "../response/error-response.js";
import postService from "../service/postService.js";
import formidable from "formidable";

const createPost = async (req, res, next) => {
    const form = formidable({ multiples: true });

    try {
        const fields = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve(fields);
            });
        });

        const title = fields.title[0];
        const body = fields.body[0];
        const userId = String(req.user.username);

        console.log(fields);

        const post = await postService.createPost({ title, body, userId });

        res.status(200).json({
            code: 200,
            message: 'Create post success',
            data: post,
        });

    } catch (error) {
        if (error instanceof ResponseError) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const getPost = async (req, res, next) => {
    try {
        const post = await postService.getPost();
        res.status(200).json({
            code: 200,
            message: "Get post success",
            data: post,
        });
        console.log(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const updatePost = async (req, res, next) => {
    const form = formidable({ multiples: true });
  
    try {
      const fields = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve(fields);
        });
      });
  
      const postId = req.params.id; 
      const title = String(fields.title);
      const body = String(fields.body);
      const userId = String(req.user.username);
  
      const post = await postService.updatePost(postId, { title, body, userId });
      console.log(post);
      res.status(200).json({
        code: 200,
        message: 'Update post success',
        data: post,
      });
    } catch (error) {
      if (error instanceof ResponseError) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await postService.deletePost(postId);
        res.status(200).json({
            code: 200,
            message: "Delete post success",
            data: post,
        });
        console.log(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const getUserPosts = async (req, res, next) => {
    try {
        const post = await postService.userPost(req);
        res.status(200).json({
            code: 200,
            message: "Get user post success",
            data: post,
        });
        console.log(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export default {
    createPost,
    getPost,
    updatePost,
    deletePost,
    getUserPosts,
}