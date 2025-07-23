"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = exports.Content = exports.Tag = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const { Schema, Types } = mongoose_1.default;
mongoose_1.default.connect(config_1.config.Connection);
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    }
});
const tagSchema = new Schema({
    title: { type: String, required: true, unique: true }
});
const contentTypes = ['image', 'video', 'article', 'audio'];
const contentSchema = new mongoose_1.default.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    userId: { type: Types.ObjectId, ref: 'User', required: true },
});
const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
});
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
const Tag = mongoose_1.default.model('Tag', tagSchema);
exports.Tag = Tag;
const Content = mongoose_1.default.model('Content', contentSchema);
exports.Content = Content;
const Link = mongoose_1.default.model('Link', linkSchema);
exports.Link = Link;
