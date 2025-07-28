import mongoose from "mongoose";
import { config } from "./config";
const { Schema, Types } = mongoose;


mongoose.connect(config.Connection)

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
const contentSchema = new mongoose.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    userId: { type: Types.ObjectId, ref: 'User', required: true },
})



const linkSchema = new Schema({
    hash: { type: String, required: true},
    userId: { type: Types.ObjectId, ref: 'User', required: true,
    unique: true},
})

const User = mongoose.model('User',userSchema);
const Tag = mongoose.model('Tag', tagSchema);
const Content = mongoose.model('Content', contentSchema);
const Link = mongoose.model('Link', linkSchema);


export {
    User,
    Tag,
    Content,
    contentTypes,
    Link
}