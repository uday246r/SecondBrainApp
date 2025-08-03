import express from "express"; 
import { User, Content, Link, Tag} from "./db"
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
app.use(express.json({ limit: '10mb' }));
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
    type: z.enum(['youtube', 'twitter', 'stackoverflow', 'github', 'medium', 'reddit', 'other']),
    link: z.string().min(1, "Link is required"),
    title: z.string().min(1, "Title is required"),
    tags: z.array(z.string()).optional(),
})

app.post("/api/v1/content",authMiddleware, async(req,res)=>{
    console.log("=== CONTENT POST REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    try{
        const result = contentSchema.safeParse(req.body);
        if(!result.success){
            console.log("Validation errors:", result.error);
            return res.status(400).json({
                message: "Invalid format", 
                details: result.error.issues
            })
        }
        
        console.log("Validation successful, creating content...");
        const { type, link, title, tags} = req.body;

        console.log("Creating content with:", { type, link, title, userId: (req as any).userId });

        const createdContent = await Content.create({
            type,
            link,
            title,
            //@ts-ignore
            userId: req.userId,
            tags: [], 
        });

        console.log("Content created successfully:", createdContent);

        return res.status(200).json({message: "Content added successfully"})
    } catch(err: any){
        console.log("Error in content posting:", err);
        console.log("Error message:", err.message);
        console.log("Error stack:", err.stack);
        return res.status(500).json({
            message: "Internal server error", 
            error: err.message,
            details: "Check server logs for more information"
        })
    }
})

app.get("/api/v1/content",authMiddleware, async(req,res)=>{
    // console.log("here");
try{
    //@ts-ignore
    const user = req.userId;
    
    if(!user){
        console.log("User not found in request");
        return res.status(404).json({message: "User not found"})
    }
    //@ts-ignore
    const content = await Content.find({userId:user})
    .populate("userId","firstName lastName");
    console.log("Found content:", content);

    return res.status(200).json({ content });
} catch (err: any) {
    console.log("Error in GET content:", err);
    return res.status(500).json({message: "Internal error", error: err.message});
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

    if(!contentId || !mongoose.Types.ObjectId.isValid(contentId)){
        return res.status(404).json({message: "Invalid content ID"});
    }
        console.log("user",user._id);
        const result = await Content.deleteOne({
        _id: new mongoose.Types.ObjectId(contentId),
         userId: new mongoose.Types.ObjectId(user)
        });

        if(result.deletedCount == 0){
            return res.status(404).json({message: "Content not found or not authorized"});
        }

   return res.json({message: "Content deleted successfully"});
} catch(err){
    return res.status(500).json({message: "Internal Server Error"})
}
});

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
            hash: hash
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

app.get("/api/v1/brain/share/:hash", async(req,res)=>{
    const hash  = req.params.hash;

    const link = await Link.findOne({
        hash
    });

    if(!link){
        res.status(404).json({
            success: false,
            message: "Brain not found or no longer available"
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
        res.status(404).json({
            success: false,
            message: "User not found"
        })
        return;
    }

    // Transform content to match frontend expectations
    const transformedContent = content.map(item => ({
        id: item._id.toString(),
        title: item.title,
        link: item.link,
        type: item.type
    }));

    res.json({
        success: true,
        brainTitle: `${user.firstName}'s Brain`,
        contents: transformedContent
    })
})

app.listen(3000,()=>{
    console.log("server started...");
})