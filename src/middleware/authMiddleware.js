import { prismaclient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get("Authorization") ;
    if(!token){
        res.status(401).json({
            error: "Unauthorized",
            message: "Token not found",
        }).end();
    } else {
        const user = await prismaclient.user.findFirst({
            where: {
                token: token,
            },
            select: {
                username: true,
                name: true,
            },
        });

        if(!user){
            res.status(401).json({
                message: "Unauthorized",
               
            }).end();
        } else {
            req.user = user;
            next();
        }
    }
}

