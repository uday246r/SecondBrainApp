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
// import jwt from "jsonwebtoken";
const app = (0, express_1.default)();
app.use(express_1.default.json());
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string()
        .min(3, { message: "Password must be at least 8 character long" })
        .max(8, { message: "Password must not exceed 8 characters" }),
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
    type: zod_1.z.enum(db_1.contentTypes),
    link: zod_1.z.string().url(),
    title: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()),
});
app.post("/api/v1/content", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("enter in post content");
    try {
        const { success } = contentSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid content format" });
        }
        // console.log("Incoming data:", req.body);
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
    try {
        //@ts-ignore
        const user = req.userId;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //@ts-ignore
        const content = yield db_1.Content.findOne({ userId })
            .populate("type")
            .populate("tags")
            .populate("link")
            .populate("title")
            .populate("userId");
        return res.status(200).json({ content });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal error" });
    }
}));
app.delete("api/v1/brain/content", (req, res) => {
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000, () => {
    console.log("server started...");
});
