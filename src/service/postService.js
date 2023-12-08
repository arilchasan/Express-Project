import { prismaclient } from "../application/database.js";
import { ResponseError } from "../response/error-response.js";
import { validate } from "../validation/validation.js";
import { createPostValidation , updatePostValidation  } from "../validation/postValidation.js";

const createPost = async (req) => {
    const post = validate(createPostValidation, req);

    return prismaclient.post.create({
        data: post,
        select: {
            id: true,
            title: true,
            body: true,
            userId: true
        },
    });
}

const getPost = async (req) => {
    const post = await prismaclient.post.findMany({
        select: {
            id: true,
            title: true,
            body: true,
            userId: true
        },
    });
    return post;
}

const updatePost = async (postId, postData) => {

    const post = validate(updatePostValidation, postData);

    const parsedPostId = parseInt(postId, 10);

    const existingPost = await prismaclient.post.findUnique({
      where: {
        id: parsedPostId,
      },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    const updatedPost = await prismaclient.post.update({
      where: {
        id: parsedPostId,
      },
      data: {
        title: post.title,
        body: post.body,
        userId: post.userId,
      },
      select: {
        id: true,
        title: true,
        body: true,
        userId: true,
      },
    });

    return updatedPost;

};

const deletePost = async (postId) => {
    const parsedPostId = parseInt(postId, 10);

    const existingPost = await prismaclient.post.findUnique({
      where: {
        id: parsedPostId,
      },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    const deletedPost = await prismaclient.post.delete({
      where: {
        id: parsedPostId,
      },
      select: {
        id: true,
        title: true,
        body: true,
        userId: true,
      },
    });

    return deletedPost;
};

const userPost = async (req) => {
    const userId = req.user.username;
    const post = await prismaclient.post.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            title: true,
            body: true,
            userId: true
        },
    });
    if (post.length === 0) {
      throw new Error('No posts found for the user.');
    }
    return post;
}

export default {
    createPost,
    getPost,
    updatePost,
    deletePost,
    userPost
}