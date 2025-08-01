import jwt  from "jsonwebtoken";
import {config} from "./config";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    userId: string;
}

const authMiddleware = (req: Request,res: Response,next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log("=== AUTH MIDDLEWARE ===");
    console.log("Auth header:", authHeader);
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        console.log("Auth header not found or invalid format");
        return res.status(403).json({error: "authHeaders not found"})
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token ? "Token exists" : "No token");

    try{
        const decoded = jwt.verify(token,config.JWT_SECRET ) as JwtPayload; 
        console.log("Decoded token:", decoded);
        
        if(decoded.userId){
           // @ts-ignore
            req.userId = decoded.userId;
            console.log("User ID set in request:", decoded.userId);
            next();
        }
        else{
            return res.status(403).json({message:"Unable to decode"});
        }
    } catch(err: any){
        res.status(403).json({error:"JWT verification failed", details: err.message})
    }

};

export default authMiddleware;