import express from "express"; 
import { User, Content, Link, Tag, contentTypes} from "./db"
import mongoose from "mongoose";
import {z} from "zod";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {config} from "./config";
import authMiddleware from "./middleware";
// import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const signupSchema = z.object({
    username: z.string().email(),
    password: z.string()
    .min(3, {message: "Password must be at least 8 character long"})
    .max(8, {message: "Password must not exceed 8 characters"}),
    firstName: z.string(),
    lastName: z.string().optional(),
})

app.post("/api/v1/signup",async (req,res)=>{
    try{
    const {success} = signupSchema.safeParse(req.body)
    if(!success){
        console.log("signup not working");
        return res.status(411).json({
            message: "Invalid credentials"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(401).json({
            message: "User already exists with this username"
        })
    }

    const hashedPassword = await argon2.hash(req.body.password);

    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    const token = jwt.sign({
        userId: user._id,
    }, config.JWT_SECRET);


    res.status(200).json({
        message : "User created successfully",
        token: token
    })

} catch(err){
    res.status(500).json({
        message: "Internal server error. Please try again later."
    });
}

})

const siginSchema = z.object({
    username : z.string().email(),
    password : z.string()
})

app.post("/api/v1/signin",async(req,res)=>{
    try{
    const {success} = siginSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Invalid credentials"
        })
    }

    const user = await User.findOne({
        username : req.body.username,
    })

    if(!user){
        return res.status(403).json({
            messsage: "Invalid credentials"
        });
    }
    const passwordMatch = await argon2.verify(user.password,req.body.password);

    if(!passwordMatch){
        return res.status(403).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign({
        userId: user._id,
    },config.JWT_SECRET);


    res.status(200).json({
        message: "Signin Successfully",
        token: token
    });
} catch(err){
    res.status(500).json({
        messsage: "internal server error"
    })
}
});

const contentSchema = z.object({
    type: z.enum(contentTypes),
    link: z.string().url(),
    title: z.string(),
    tags: z.array(z.string()),
})

app.post("/api/v1/content",authMiddleware, async(req,res)=>{
   // console.log("enter in post content");
    try{
    const {success} = contentSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({message: "Invalid content format"})
    }
// console.log("Incoming data:", req.body);

    const { type, link, title, tags} = req.body;

    await Content.create({
        type,
        link,
        title,
        //@ts-ignore
        userId: req.userId,
        tags:[],
    })

// console.log("Parsed Zod:", data);

    return res.status(200).json({message: "Content added successfully"})
} catch(err){
    console.log("error in content posting")
    return res.status(500).json({messages: "Internal server error"})
}

})

app.get("/api/v1/content",authMiddleware, async(req,res)=>{
try{
    //@ts-ignore
    const user = req.userId;
    
    if(!user){
        return res.status(404).json({message: "User not found"})
    }
    //@ts-ignore
    const content = await Content.find({userId:user})
    .populate({
        path:"tags",
        model:"Tag"
    })
    .populate({
        path:"userId",
        model:"User"
    });
    // console.log(content);

    return res.status(200).json({ content });
} catch (err) {
    return res.status(500).json({message: "Internal error"});
}
})

app.delete("api/v1/brain/content", (req,res)=>{

})

app.post("/api/v1/brain/share", (req,res)=>{

})

app.get("/api/v1/brain/:shareLink", (req,res)=>{

})

app.listen(3000,()=>{
    console.log("server started...");
})