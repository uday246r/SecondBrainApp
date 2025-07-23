import jwt  from "jsonwebtoken";
import {config} from "./config";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    userId: string;
}

const authMiddleware = (req: Request,res: Response,next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({error: "authHeaders not found"})
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token,config.JWT_SECRET ) as JwtPayload; 
        if(decoded.userId){
           // @ts-ignore
            req.userId = decoded.userId;
            next();
        }
        else{
            return res.status(403).json({});
        }
    } catch(err){
        res.status(403).json({error:"fail here"})
    }

};

export default authMiddleware;