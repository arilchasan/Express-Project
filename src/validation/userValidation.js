import Joi from "joi";

const registerValidation = Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(3).max(30).required(),
});

const loginValidation = Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().min(6).required(),
});

const getUserValidation = Joi.string().max(50).required();

const updateUserValidation = Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().min(6).optional(),
    avatar: Joi.string().allow(null).optional(),
    name: Joi.string().min(3).max(30).optional(),
});

export {
    registerValidation,
    loginValidation,
    getUserValidation,
    updateUserValidation,
}