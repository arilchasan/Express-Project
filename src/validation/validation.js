import { ResponseError } from "../response/error-response.js";

const validate = (schema , req) => {
    const result = schema.validate(req, {
        abortEarly: false,
        allowUnknown: false,
    });
    if(result.error){
        throw new ResponseError(result.error.message, 400);
    } else {
        return result.value;
    }
}


export {
    validate
}