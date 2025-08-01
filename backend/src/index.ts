import express from "express"; 
import { User, Content, Link, Tag, contentTypes} from "./db"
import mongoose from "mongoose";
import {z} from "zod";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {config} from "./config";
import authMiddleware from "./middleware";
import { random } from "./utils";
// import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const signupSchema = z.object({
    username: z.string().email(),
    password: z.string()
    .min(3, {message: "Password must be at least 8 character long"})
    .max(10, {message: "Password must not exceed 8 characters"}),
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
   console.log(req.body);
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
    .populate("userId","firstName lastName");
    // console.log(content);

    return res.status(200).json({ content });
} catch (err) {
    return res.status(500).json({message: "Internal error"});
}
})

app.delete("/api/v1/brain/content",authMiddleware, async(req,res)=>{
   
    try{
    // @ts-ignore
    const user = req.userId;

    if(!user){
        return res.status(400).json({message: "User not found"})
    }
    const contentId = req.body.contentId;

    if(!contentId){
        return res.status(404).json({message: "Content not found to delete"})
    }
       // @ts-ignore
    await Content.deleteMany({contentId, userId: req.userId});

   return res.json({message: "Content deleted successfully"});
} catch(err){
    return res.status(500).json({message: "Internal Server Error"})
}
})

app.post("/api/v1/brain/share", authMiddleware, async(req,res)=>{
    const share = req.body.share;
    if(share){

        const existingLink = await Link.findOne({
            //@ts-ignore
            userId: req.userId
        });

        if(existingLink){
            res.json({
                hash: existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await Link .create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        })

        res.json({
            message: "/share/" + hash
        })
    }
    else{
        await Link.deleteOne({
           // @ts-ignore
            userId: req.userId
        });

    res.json({
        message: "Removed link"
    })
}
})

app.get("/api/v1/brain/:shareLink", async(req,res)=>{
    const hash  = req.params.shareLink;

    const link = await Link.findOne({
        hash
    });

    if(!link){
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }

    const content = await Content.find({
        userId: link.userId
    })

    const user = await User.findOne({
        _id: link.userId
    })

    if(!user){
        res.status(411).json({
            message: "User not found, error should ideally not happen"
        })
        return;
    }
    res.json({
        username: user.username,
        content: content
    })
})

app.listen(3000,()=>{
    console.log("server started...");
})