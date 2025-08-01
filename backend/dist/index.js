"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const zod_1 = require("zod");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware_1 = __importDefault(require("./middleware"));
const utils_1 = require("./utils");
// import jwt from "jsonwebtoken";
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string()
        .min(3, { message: "Password must be at least 8 character long" })
        .max(10, { message: "Password must not exceed 8 characters" }),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string().optional(),
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = signupSchema.safeParse(req.body);
        if (!success) {
            console.log("signup not working");
            return res.status(411).json({
                message: "Invalid credentials"
            });
        }
        const existingUser = yield db_1.User.findOne({
            username: req.body.username
        });
        if (existingUser) {
            return res.status(401).json({
                message: "User already exists with this username"
            });
        }
        const hashedPassword = yield argon2_1.default.hash(req.body.password);
        const user = yield db_1.User.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, config_1.config.JWT_SECRET);
        res.status(200).json({
            message: "User created successfully",
            token: token
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Internal server error. Please try again later."
        });
    }
}));
const siginSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string()
});
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = siginSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Invalid credentials"
            });
        }
        const user = yield db_1.User.findOne({
            username: req.body.username,
        });
        if (!user) {
            return res.status(403).json({
                messsage: "Invalid credentials"
            });
        }
        const passwordMatch = yield argon2_1.default.verify(user.password, req.body.password);
        if (!passwordMatch) {
            return res.status(403).json({
                message: "Invalid credentials"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, config_1.config.JWT_SECRET);
        res.status(200).json({
            message: "Signin Successfully",
            token: token
        });
    }
    catch (err) {
        res.status(500).json({
            messsage: "internal server error"
        });
    }
}));
const contentSchema = zod_1.z.object({
    type: zod_1.z.enum(['youtube', 'twitter']),
    link: zod_1.z.string().url(),
    title: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
app.post("/api/v1/content", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside post request");
    try {
        const { success } = contentSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid format" });
        }
        console.log("Incoming data:", req.body);
        const { type, link, title, tags } = req.body;
        yield db_1.Content.create({
            type,
            link,
            title,
            //@ts-ignore
            userId: req.userId,
            tags: [],
        });
        // console.log("Parsed Zod:", data);
        return res.status(200).json({ message: "Content added successfully" });
    }
    catch (err) {
        console.log("error in content posting");
        return res.status(500).json({ messages: "Internal server error" });
    }
}));
app.get("/api/v1/content", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("here");
    try {
        //@ts-ignore
        const user = req.userId;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //@ts-ignore
        const content = yield db_1.Content.find({ userId: user })
            .populate("userId", "firstName lastName");
        // console.log(content);
        return res.status(200).json({ content });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal error" });
    }
}));
app.delete("/api/v1/brain/content", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = req.userId;
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const contentId = req.body.contentId;
        if (!contentId) {
            return res.status(404).json({ message: "Content not found to delete" });
        }
        // @ts-ignore
        yield db_1.Content.deleteMany({ contentId, userId: req.userId });
        return res.json({ message: "Content deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/api/v1/brain/share", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.Link.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.Link.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });
        res.json({
            message: "/share/" + hash
        });
    }
    else {
        yield db_1.Link.deleteOne({
            // @ts-ignore
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.Link.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    const content = yield db_1.Content.find({
        userId: link.userId
    });
    const user = yield db_1.User.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "User not found, error should ideally not happen"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
app.listen(3000, () => {
    console.log("server started...");
});
