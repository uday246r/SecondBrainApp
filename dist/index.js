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
// import jwt from "jsonwebtoken";
const app = (0, express_1.default)();
app.use(express_1.default.json());
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("signup working");
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        console.log("signup notworking");
        return res.status(411).json({
            message: "Email already exist / Incorrect details"
        });
    }
    const existingUser = yield db_1.User.findOne({
        username: req.body.username
    });
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect email"
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
    res.json({
        message: "User created successfully",
        token: token
    });
}));
const siginSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string()
});
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        return res.status(411).json({
            messsage: "User not found"
        });
    }
    const passwordMatch = yield argon2_1.default.verify(user.password, req.body.password);
    if (!passwordMatch) {
        return res.status(411).json({
            message: "Invalid credentials"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user._id,
    }, config_1.config.JWT_SECRET);
    res.json({
        message: "Signin Successfully",
        token: token
    });
}));
app.post("api/v1/content", (req, res) => {
});
app.get("api/v1/content", (req, res) => {
});
app.delete("api/v1/brain/content", (req, res) => {
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000, () => {
    console.log("server started...");
});
