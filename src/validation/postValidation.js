import Joi from "joi";

const createPostValidation = Joi.object({
    // id: Joi.number().required(),
    title: Joi.string().max(50).required(),
    body: Joi.string().max(500).required(),
    userId: Joi.string().max(100).required(),
});

const updatePostValidation = Joi.object({
    // id: Joi.number().required(),
    title: Joi.string().max(50).required(),
    body: Joi.string().max(500).required(),
    userId: Joi.string().max(100).required(),
});


export {
    createPostValidation,
    updatePostValidation,
}